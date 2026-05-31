import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';

import { PrismaService } from '../../prisma/prisma.service';
import { slugify } from '../../common/utils/slug';
import {
  ForgotPasswordDto,
  GoogleAuthCallbackDto,
  LoginDto,
  RegisterDto,
  ResetPasswordDto,
  VerifyEmailDto,
} from './dto/auth.dto';

type AuthUserRecord = Prisma.UserGetPayload<{
  include: { role: true };
}>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('Email is already registered.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const verificationToken = randomUUID();

    const user = await this.prisma.$transaction(async (tx) => {
      const role = await this.ensureRole(tx, 'USER', 'User');
      const createdUser = await tx.user.create({
        data: {
          roleId: role.id,
          name: dto.name,
          email: dto.email.toLowerCase(),
          passwordHash,
          emailVerificationToken: verificationToken,
        },
      });

      const tenant = await tx.tenant.create({
        data: {
          ownerUserId: createdUser.id,
          name: `${dto.name}'s Workspace`,
          slug: this.buildTenantSlug(dto.name),
        },
      });

      await tx.tenantMember.create({
        data: {
          tenantId: tenant.id,
          userId: createdUser.id,
          role: 'OWNER',
        },
      });

      await tx.user.update({
        where: { id: createdUser.id },
        data: { defaultTenantId: tenant.id },
      });

      await tx.activityLog.create({
        data: {
          tenantId: tenant.id,
          actorUserId: createdUser.id,
          actorType: 'USER',
          action: 'auth.register',
          subjectType: 'user',
          subjectId: createdUser.id,
          metadata: {
            email: createdUser.email,
          },
        },
      });

      return tx.user.findUniqueOrThrow({
        where: { id: createdUser.id },
        include: { role: true },
      });
    });

    return this.createSession(user);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: { role: true },
    });

    if (!user?.passwordHash) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid || !user.isActive) {
      throw new UnauthorizedException('Invalid email or password.');
    }

    return this.createSession(user);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      return { message: 'If the account exists, a reset token has been refreshed.' };
    }

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: randomUUID(),
        passwordResetExpiresAt: new Date(Date.now() + 60 * 60 * 1000),
      },
    });

    return { message: 'Reset token generated. Wire this into your email provider next.' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        passwordResetToken: dto.token,
        passwordResetExpiresAt: {
          gt: new Date(),
        },
      },
      include: { role: true },
    });

    if (!user) {
      throw new BadRequestException('Reset token is invalid or expired.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetToken: null,
        passwordResetExpiresAt: null,
      },
    });

    return { message: 'Password has been updated.' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prisma.user.findFirst({
      where: { emailVerificationToken: dto.token },
      include: { role: true },
    });

    if (!user) {
      throw new BadRequestException('Verification token is invalid.');
    }

    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerifiedAt: new Date(),
        emailVerificationToken: null,
      },
      include: { role: true },
    });

    return this.createSession(updated);
  }

  async loginWithGoogle(dto: GoogleAuthCallbackDto) {
    const user = await this.prisma.$transaction(async (tx) => {
      const existingByGoogleId = await tx.user.findUnique({
        where: { googleId: dto.googleId },
        include: { role: true },
      });

      if (existingByGoogleId) {
        return tx.user.update({
          where: { id: existingByGoogleId.id },
          data: {
            avatarUrl: dto.avatarUrl,
            emailVerifiedAt: existingByGoogleId.emailVerifiedAt ?? new Date(),
          },
          include: { role: true },
        });
      }

      const existingByEmail = await tx.user.findUnique({
        where: { email: dto.email.toLowerCase() },
        include: { role: true },
      });

      if (existingByEmail) {
        return tx.user.update({
          where: { id: existingByEmail.id },
          data: {
            googleId: dto.googleId,
            avatarUrl: dto.avatarUrl,
            emailVerifiedAt: existingByEmail.emailVerifiedAt ?? new Date(),
          },
          include: { role: true },
        });
      }

      const role = await this.ensureRole(tx, 'USER', 'User');
      const createdUser = await tx.user.create({
        data: {
          roleId: role.id,
          name: dto.name,
          email: dto.email.toLowerCase(),
          googleId: dto.googleId,
          avatarUrl: dto.avatarUrl,
          emailVerifiedAt: new Date(),
        },
      });

      const tenant = await tx.tenant.create({
        data: {
          ownerUserId: createdUser.id,
          name: `${dto.name}'s Workspace`,
          slug: this.buildTenantSlug(dto.name),
        },
      });

      await tx.tenantMember.create({
        data: {
          tenantId: tenant.id,
          userId: createdUser.id,
          role: 'OWNER',
        },
      });

      await tx.user.update({
        where: { id: createdUser.id },
        data: { defaultTenantId: tenant.id },
      });

      return tx.user.findUniqueOrThrow({
        where: { id: createdUser.id },
        include: { role: true },
      });
    });

    return this.createSession(user);
  }

  async validateJwtUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user?.isActive) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return this.serializeUser(user);
  }

  private createSession(user: AuthUserRecord) {
    const payload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role.code,
      tenantId: user.defaultTenantId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: this.serializeUser(user),
    };
  }

  private serializeUser(user: AuthUserRecord) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      role: user.role.code,
      defaultTenantId: user.defaultTenantId,
      emailVerifiedAt: user.emailVerifiedAt,
    };
  }

  private async ensureRole(
    tx: Prisma.TransactionClient,
    code: string,
    name: string,
  ) {
    return tx.role.upsert({
      where: { code },
      update: { name },
      create: { code, name },
    });
  }

  private buildTenantSlug(name: string) {
    return `${slugify(name)}-${randomUUID().slice(0, 6)}`;
  }
}
