import { cookies } from 'next/headers';
import { AppLayout } from '@/components/layout/AppLayout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get('access_token')?.value;

  let profile = null;
  let user = null;

  if (token) {
    try {
      const payload = JSON.parse(
        Buffer.from(token.split('.')[1], 'base64').toString('utf-8'),
      );
      user = {
        id: payload.sub || payload.id || '',
        email: payload.email || '',
      };
      profile = {
        full_name: payload.full_name || payload.name || 'User',
        role: payload.role || 'staff',
      };
    } catch {}
  }

  return (
    <AppLayout user={user} profile={profile}>
      {children}
    </AppLayout>
  );
}
