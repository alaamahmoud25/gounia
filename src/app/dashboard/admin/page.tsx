import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function AdminDashboardPage() {
  const user = await currentUser();

  if (!user) {
    redirect('/sign-in');
  }

  const role = user?.privateMetadata?.role;

  // إذا لم يكن المستخدم بائع، امنعه من الدخول
  if (role !== 'ADMIN') {
    redirect('/');
  }

  return <div>admin dashboard</div>;
}
