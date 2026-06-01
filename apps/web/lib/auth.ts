export type AppRole = 'admin' | 'client';

export type DemoSession = {
  email: string;
  name: string;
  role: AppRole;
  avatarInitials: string;
};

export type DemoCredential = DemoSession & {
  password: string;
  redirectTo: string;
  label: string;
};

export const SESSION_STORAGE_KEY = 'automationhub.session';

export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    label: 'Admin Demo',
    email: 'admin@avacode.id',
    password: 'Admin123!',
    name: 'Ava Platform Admin',
    role: 'admin',
    avatarInitials: 'AD',
    redirectTo: '/admin',
  },
  {
    label: 'Client Demo',
    email: 'client@avacode.id',
    password: 'Client123!',
    name: 'Automation Client',
    role: 'client',
    avatarInitials: 'CL',
    redirectTo: '/dashboard',
  },
];

export function findDemoCredential(email: string, password: string) {
  return DEMO_CREDENTIALS.find(
    (credential) =>
      credential.email.toLowerCase() === email.toLowerCase().trim() &&
      credential.password === password,
  );
}

export function toSession(credential: DemoCredential): DemoSession {
  return {
    email: credential.email,
    name: credential.name,
    role: credential.role,
    avatarInitials: credential.avatarInitials,
  };
}
