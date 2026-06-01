import { LoginForm } from '@/components/auth/login-form';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string; next?: string }>;
}) {
  const params = await searchParams;
  const mode = params.mode === 'admin' ? 'admin' : 'client';

  return <LoginForm mode={mode} nextPath={params.next} />;
}
