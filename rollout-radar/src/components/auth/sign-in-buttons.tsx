'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const providerLabels: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
};

export function SignInButtons({ providers }: { providers: string[] }) {
  if (providers.length === 0) {
    return <p className="text-sm text-muted-foreground">No providers configured.</p>;
  }
  return (
    <div className="flex flex-col gap-3">
      {providers.map((provider) => (
        <Button key={provider} onClick={() => signIn(provider)} className="w-full">
          Continue with {providerLabels[provider] ?? provider}
        </Button>
      ))}
    </div>
  );
}
