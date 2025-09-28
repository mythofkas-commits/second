import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote/rsc';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { cn } from './utils';

export type MarkdownProps = {
  source: string | MDXRemoteSerializeResult;
  className?: string;
};

export function MarkdownRenderer({ source, className }: MarkdownProps) {
  if (!source) return null;
  return (
    <div className={cn('prose prose-neutral dark:prose-invert max-w-none', className)}>
      {/* @ts-expect-error Server Component support */}
      <MDXRemote
        source={source}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeRaw, rehypeSanitize],
          },
        }}
      />
    </div>
  );
}
