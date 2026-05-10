'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { staffService } from '@/services/staff';
import { PageHeader, ActionButton, StatusPill, SurfaceCard } from '@/components/ui';

export default function StaffPage() {
  const router = useRouter();

  const { data: staffs = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => staffService.getStaff(),
  });

  return (
    <section className="space-y-12">
      <PageHeader
        eyebrow="People & Control"
        title="Staff"
        actions={<ActionButton onPress={() => router.push('/staff/new')}>Tambah Staff</ActionButton>}
      />

      {isLoading ? (
        <SurfaceCard>Loading...</SurfaceCard>
      ) : staffs.length === 0 ? (
        <SurfaceCard>Belum ada staff terdaftar.</SurfaceCard>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {staffs.map((item) => (
            <SurfaceCard key={item.id} className="border-l-3 border-accent">
              <div className="mb-6 flex items-center gap-5">
                <div className="flex h-24 w-24 items-center justify-center rounded-full border border-accent text-3xl font-semibold text-accent" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl text-foreground" style={{ fontFamily: 'var(--font-display)' }}>{item.full_name}</h3>
                  <StatusPill>{item.role || 'staff'}</StatusPill>
                </div>
              </div>
              <div className="space-y-3 text-sm text-muted">
                <p>Status: {item.is_active ? 'Aktif' : 'Nonaktif'}</p>
                <p>Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</p>
              </div>
            </SurfaceCard>
          ))}
        </div>
      )}
    </section>
  );
}
