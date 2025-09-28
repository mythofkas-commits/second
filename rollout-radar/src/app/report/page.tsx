import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { ReportForm } from '@/components/report/report-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Submit a report',
  description: 'Let the community know whether a feature is available for you.',
};

export default async function ReportPage() {
  const feature = await prisma.feature.findFirst({ orderBy: { createdAt: 'desc' } });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Submit a report</h1>
        <p className="text-muted-foreground">
          Share your experience to help others verify availability. We review each submission.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Report availability</CardTitle>
          <CardDescription>Your IP is hashed. Submissions are moderated before publication.</CardDescription>
        </CardHeader>
        <CardContent>
          {feature ? (
            <ReportForm featureId={feature.id} />
          ) : (
            <p className="text-sm text-muted-foreground">No features available yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
