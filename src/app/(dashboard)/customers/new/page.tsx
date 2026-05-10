'use client';

import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Form } from '@heroui/react';
import { ActionButton, FormTextField, PageHeader, SurfaceCard } from '@/components/ui';
import { customersService } from '@/services/customers';

export default function NewCustomerPage() {
  const router = useRouter();

  const createMutation = useMutation({
    mutationFn: customersService.createCustomer,
    onSuccess: () => router.push('/customers'),
    onError: (error: { message?: string }) =>
      alert(error.message || 'Gagal menyimpan pelanggan'),
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      name: formData.get('name') as string,
      phone: (formData.get('phone') as string) || undefined,
      address: (formData.get('address') as string) || undefined,
      note: (formData.get('note') as string) || undefined,
    });
  };

  return (
    <section className='space-y-8'>
      <PageHeader
        eyebrow='Customer Entry'
        title='Tambah Pelanggan'
        description='Data minimal dulu. Bisa jadi dasar finance module nanti.'
      />

      <SurfaceCard className='max-w-2xl'>
        <Form className='flex flex-col gap-6' onSubmit={onSubmit} validationBehavior='aria'>
          <FormTextField label='Nama Pelanggan' name='name' placeholder='Contoh: Bu Sari' isRequired />
          <FormTextField label='Nomor HP' name='phone' placeholder='08xxxxxxxxxx' />
          <FormTextField label='Alamat' name='address' placeholder='Alamat singkat' />
          <FormTextField label='Catatan' name='note' placeholder='Info tambahan' />

          <div className='flex w-full flex-wrap justify-end gap-3'>
            <ActionButton variant='secondary' onPress={() => router.back()}>
              Batal
            </ActionButton>
            <ActionButton type='submit' isPending={createMutation.isPending}>
              Simpan Pelanggan
            </ActionButton>
          </div>
        </Form>
      </SurfaceCard>
    </section>
  );
}
