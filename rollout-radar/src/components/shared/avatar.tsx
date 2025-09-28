'use client';

import * as AvatarPrimitive from '@radix-ui/react-avatar';
import { cn } from '@/lib/utils';

type AvatarProps = {
  image?: string | null;
  fallback: string;
  className?: string;
};

export function Avatar({ image, fallback, className }: AvatarProps) {
  return (
    <AvatarPrimitive.Root className={cn('flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-secondary', className)}>
      {image ? (
        <AvatarPrimitive.Image src={image} alt={fallback} className="h-full w-full object-cover" />
      ) : (
        <AvatarPrimitive.Fallback className="text-sm font-medium text-secondary-foreground">
          {fallback}
        </AvatarPrimitive.Fallback>
      )}
    </AvatarPrimitive.Root>
  );
}

export const AvatarFallback = AvatarPrimitive.Fallback;
