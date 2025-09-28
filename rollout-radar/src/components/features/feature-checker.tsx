'use client';

import { useState } from 'react';
import { CountrySelect } from '@/components/shared/forms/country-select';
import { OsSelect } from '@/components/shared/forms/os-select';
import { VersionInput } from '@/components/shared/forms/version-input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const defaultResult = {
  status: null as string | null,
  reasons: [] as string[],
};

type Props = {
  featureSlug: string;
  countries: string[];
  osOptions: string[];
};

export function FeatureChecker({ featureSlug, countries, osOptions }: Props) {
  const [country, setCountry] = useState(countries[0] ?? 'US');
  const [osName, setOsName] = useState(osOptions[0] ?? 'iOS');
  const [osVersion, setOsVersion] = useState('');
  const [appVersion, setAppVersion] = useState('');
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState(defaultResult);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        featureSlug,
        country,
        osName,
      });
      if (osVersion) params.set('osVersion', osVersion);
      if (appVersion) params.set('appVersion', appVersion);

      const response = await fetch(`/api/check?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Unable to check availability.');
      }
      const data = await response.json();
      setResult({ status: data.status, reasons: data.reasons ?? [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
      setResult(defaultResult);
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Checker</CardTitle>
        <CardDescription>Enter your details to see if the feature should be available.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Country</label>
              <CountrySelect countries={countries} value={country} onChange={setCountry} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Operating system</label>
              <OsSelect options={osOptions} value={osName} onChange={setOsName} />
            </div>
            <VersionInput label="OS version" value={osVersion} onChange={setOsVersion} placeholder="e.g. 18.0" />
            <VersionInput label="App version" value={appVersion} onChange={setAppVersion} placeholder="optional" />
          </div>
          <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? 'Checking…' : 'Run check'}
          </Button>
          {result.status && (
            <div className="rounded-md border border-dashed bg-muted/40 p-4 text-sm">
              <p className="font-semibold">Result: {result.status}</p>
              {result.reasons.length > 0 && (
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {result.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </CardContent>
    </Card>
  );
}
