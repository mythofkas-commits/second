import Script from 'next/script';
import { env } from '@/lib/env';

export function Analytics() {
  if (!env.PLAUSIBLE_DOMAIN) return null;
  return (
    <Script
      strategy="lazyOnload"
      data-domain={env.PLAUSIBLE_DOMAIN}
      src="https://plausible.io/js/script.js"
    />
  );
}
