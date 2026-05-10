'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Form } from '@heroui/react';
import { staffService } from '@/services/staff';
import { PageHeader, ActionButton, FormTextField, SurfaceCard } from '@/components/ui';

export default function NewStaffPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: staffService.createStaff,
    onSuccess: () => router.push('/staff'),
    onError: (error: { message?: string }) =>
      alert(error.message || 'Gagal menambah staff'),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      full_name: formData.get('full_name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    });
  };

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Team Access"
        title="Tambah Staff Baru"
      />

      <SurfaceCard className="max-w-2xl">
        <Form
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          validationBehavior="aria"
        >
          <FormTextField
            label="Nama Lengkap"
            name="full_name"
            placeholder="Nama Lengkap"
            isRequired
          />

          <FormTextField
            label="Email"
            name="email"
            type="email"
            placeholder="Email"
            isRequired
          />

          <FormTextField
            label="Password"
            name="password"
            type="password"
            placeholder="Password"
            isRequired
          />

          <div className="flex flex-wrap justify-end gap-3">
            <ActionButton variant="secondary" onPress={() => router.back()}>
              Batal
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              isPending={createMutation.isPending}
            >
              Simpan Staff
            </ActionButton>
          </div>
        </Form>
      </SurfaceCard>
    </section>
  );
}
