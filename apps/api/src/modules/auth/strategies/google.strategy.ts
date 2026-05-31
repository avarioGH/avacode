import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID', 'disabled-client'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET', 'disabled-secret'),
      callbackURL: configService.get<string>(
        'GOOGLE_CALLBACK_URL',
        'http://localhost:4000/api/v1/auth/google/callback',
      ),
      scope: ['profile', 'email'],
    });
  }

  validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return {
      googleId: profile.id,
      email: profile.emails?.[0]?.value ?? '',
      name: profile.displayName ?? 'Google User',
      avatarUrl: profile.photos?.[0]?.value,
    };
  }
}
