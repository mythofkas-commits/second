'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ReportForm({ featureId }: { featureId: string }) {
  const [country, setCountry] = useState('US');
  const [device, setDevice] = useState('');
  const [os, setOs] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [hasFeature, setHasFeature] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    setError(null);
    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, country, device, os, appVersion, hasFeature }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? 'Failed to submit report');
      }
      setMessage('Thanks! Your report has been submitted for review.');
      setDevice('');
      setOs('');
      setAppVersion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="text-sm font-medium">Country code</label>
        <Input value={country} onChange={(event) => setCountry(event.target.value.toUpperCase())} maxLength={2} />
      </div>
      <div>
        <label className="text-sm font-medium">Device</label>
        <Input value={device} onChange={(event) => setDevice(event.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">Operating system</label>
        <Input value={os} onChange={(event) => setOs(event.target.value)} required />
      </div>
      <div>
        <label className="text-sm font-medium">App version (optional)</label>
        <Input value={appVersion} onChange={(event) => setAppVersion(event.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="hasFeature"
          type="checkbox"
          checked={hasFeature}
          onChange={(event) => setHasFeature(event.target.checked)}
          className="h-4 w-4"
        />
        <label htmlFor="hasFeature" className="text-sm">
          I see this feature enabled
        </label>
      </div>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? 'Submitting…' : 'Submit report'}
      </Button>
      {message && <p className="text-sm text-emerald-600">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Your IP is hashed before storing. Reports help moderators verify regional availability.
      </p>
    </form>
  );
}
