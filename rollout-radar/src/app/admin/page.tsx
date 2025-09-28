import { Metadata } from 'next';
import { requireAdmin } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin',
};

export default async function AdminPage() {
  await requireAdmin();
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <p className="text-muted-foreground">Advanced management tools are coming soon.</p>
    </div>
  );
}
