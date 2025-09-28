import { Metadata } from 'next';
import { getSessionUser } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Profile',
};

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/auth/sign-in');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">Profile</h1>
      <p className="text-muted-foreground">Welcome back, {user.email}. Followed feature summaries will appear here in future iterations.</p>
    </div>
  );
}
