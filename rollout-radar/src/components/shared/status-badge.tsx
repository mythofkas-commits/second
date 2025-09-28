import { AvailabilityStatus } from '@prisma/client';
import { Badge } from '@/components/ui/badge';
import { statusToBadgeVariant } from '@/lib/data';

type StatusBadgeProps = {
  status: AvailabilityStatus;
  label?: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const variant = statusToBadgeVariant(status);
  return <Badge variant={variant as never}>{label ? `${label}: ${status.replace('_', ' ')}` : status}</Badge>;
}
