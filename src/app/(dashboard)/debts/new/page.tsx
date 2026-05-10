'use client';

import { useRouter } from 'next/navigation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Form } from '@heroui/react';
import {
  ActionButton,
  FormSelectField,
  FormTextField,
  PageHeader,
  SurfaceCard,
} from '@/components/ui';
import { customersService } from '@/services/customers';
import { debtsService } from '@/services/debts';

export default function NewDebtPage() {
  const router = useRouter();

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: () => customersService.getCustomers(),
  });

  const createMutation = useMutation({
    mutationFn: debtsService.createDebt,
    onSuccess: () => router.push('/debts'),
    onError: (error: { message?: string }) =>
      alert(error.message || 'Gagal menyimpan hutang'),
  });

  const customerOptions = [
    { key: '', label: customersLoading ? 'Loading pelanggan...' : 'Pilih pelanggan' },
    ...customers.map((customer) => ({ key: customer.id, label: customer.name })),
  ];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    createMutation.mutate({
      customer_id: formData.get('customer_id') as string,
      amount: Number(formData.get('amount')) || 0,
      paid_amount: Number(formData.get('paid_amount')) || 0,
      due_date: (formData.get('due_date') as string) || undefined,
      note: (formData.get('note') as string) || undefined,
    });
  };

  return (
    <section className='space-y-8'>
      <PageHeader
        eyebrow='Debt Entry'
        title='Catat Hutang'
        description='Input sederhana untuk piutang pelanggan. Payment history bisa menyusul.'
        actions={
          <ActionButton variant='secondary' onPress={() => router.push('/customers/new')}>
            Tambah Pelanggan
          </ActionButton>
        }
      />

      <SurfaceCard className='max-w-2xl'>
        <Form className='flex flex-col gap-6' onSubmit={onSubmit} validationBehavior='aria'>
          <FormSelectField
            label='Pelanggan'
            name='customer_id'
            options={customerOptions}
            isRequired
          />
          <FormTextField label='Nominal Hutang' name='amount' type='number' min={0} step={1000} isRequired />
          <FormTextField label='Sudah Dibayar' name='paid_amount' type='number' min={0} step={1000} defaultValue='0' />
          <FormTextField label='Jatuh Tempo' name='due_date' type='date' />
          <FormTextField label='Catatan' name='note' placeholder='Contoh: belanja tanggal 12' />

          <div className='flex w-full flex-wrap justify-end gap-3'>
            <ActionButton variant='secondary' onPress={() => router.back()}>
              Batal
            </ActionButton>
            <ActionButton type='submit' isPending={createMutation.isPending}>
              Simpan Hutang
            </ActionButton>
          </div>
        </Form>
      </SurfaceCard>
    </section>
  );
}
