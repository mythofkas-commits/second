import { Metadata } from 'next';
import { SignInButtons } from '@/components/auth/sign-in-buttons';
import { env } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Sign in',
};

export default function SignInPage() {
  const providers = [
    ...(env.GOOGLE_CLIENT_ID ? ['google'] : []),
    ...(env.GITHUB_ID ? ['github'] : []),
  ];

  return (
    <div className="mx-auto max-w-md space-y-6 text-center">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-muted-foreground">Use a social account to join Rollout Radar.</p>
      </div>
      <SignInButtons providers={providers} />
    </div>
  );
}
