import { ExternalLink } from 'lucide-react';

export function SourceLink({ title, url, type }: { title?: string | null; url: string; type?: string | null }) {
  return (
    <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline">
      <ExternalLink className="h-4 w-4" />
      <span>{title ?? url}</span>
      {type && <span className="rounded-full border px-2 py-0.5 text-xs text-muted-foreground">{type}</span>}
    </a>
  );
}
