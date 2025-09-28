'use client';

import { useMemo, useState } from 'react';
import type { Availability, AvailabilityStatus } from '@prisma/client';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils';

type AvailabilityWithStatus = Availability & { status: AvailabilityStatus };

type Props = {
  rows: AvailabilityWithStatus[];
};

export function AvailabilityTable({ rows }: Props) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<AvailabilityStatus | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    return rows
      .filter((row) =>
        query ? row.country.toLowerCase().includes(query.toLowerCase()) : true,
      )
      .filter((row) => (status === 'ALL' ? true : row.status === status));
  }, [rows, query, status]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Filter by country code"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="max-w-xs"
        />
        <div className="flex gap-2 text-sm">
          {(['ALL', 'LIVE', 'STAGED', 'NOT_LIVE', 'UNKNOWN'] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value as AvailabilityStatus | 'ALL')}
              className={`rounded-md border px-3 py-1 ${status === value ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
            >
              {value === 'ALL' ? 'All' : value.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last seen</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.country}</TableCell>
              <TableCell>
                <StatusBadge status={row.status} />
              </TableCell>
              <TableCell>{formatDate(row.lastSeen)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filtered.length === 0 && <p className="text-sm text-muted-foreground">No countries match the filters.</p>}
    </div>
  );
}
