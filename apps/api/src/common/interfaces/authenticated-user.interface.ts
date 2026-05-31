export interface AuthenticatedUser {
  sub: string;
  email: string;
  name: string;
  role: string;
  tenantId?: string | null;
}
