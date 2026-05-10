'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ActionButton, DataTable, PageHeader, StatCard, StatusPill } from '@/components/ui';
import type { TableColumn } from '@/components/ui/DataTable';
import { customersService, type Customer } from '@/services/customers';

const rupiah = (value = 0) => `Rp ${value.toLocaleString('id-ID')}`;

export default function CustomersPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers', { search }],
    queryFn: () => customersService.getCustomers({ search }),
  });

  const totalDebt = customers.reduce((sum, c) => sum + (c.total_debt || 0), 0);
  const customersWithDebt = customers.filter((c) => (c.total_debt || 0) > 0).length;

  const columns: TableColumn<Customer>[] = [
    {
      key: 'name',
      label: 'Pelanggan',
      render: (c) => <span className='font-bold'>{c.name}</span>,
    },
    {
      key: 'phone',
      label: 'Kontak',
      render: (c) => <span>{c.phone || '-'}</span>,
    },
    {
      key: 'address',
      label: 'Alamat',
      render: (c) => <span>{c.address || '-'}</span>,
    },
    {
      key: 'total_debt',
      label: 'Total Hutang',
      render: (c) =>
        (c.total_debt || 0) > 0 ? (
          <StatusPill variant='warning'>{rupiah(c.total_debt)}</StatusPill>
        ) : (
          <StatusPill variant='success'>Lunas</StatusPill>
        ),
    },
  ];

  return (
    <section className='space-y-8'>
      <PageHeader
        eyebrow='Customer Ledger'
        title='Pelanggan'
        description='Basis data pelanggan untuk hutang sekarang, finance nanti.'
        actions={
          <ActionButton onPress={() => router.push('/customers/new')}>
            Tambah Pelanggan
          </ActionButton>
        }
      />

      <div className='grid gap-5 md:grid-cols-3'>
        <StatCard label='Total Pelanggan' value={customers.length} />
        <StatCard label='Punya Hutang' value={customersWithDebt} />
        <StatCard label='Nominal Hutang' value={rupiah(totalDebt)} />
      </div>

      <div className='app-card rounded-[2rem] p-5'>
        <label className='block max-w-xl'>
          <span className='mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-muted'>
            Cari Pelanggan
          </span>
          <input
            className='login-input'
            placeholder='Nama / nomor HP'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      <DataTable
        columns={columns}
        data={customers}
        keyExtractor={(c) => c.id}
        isLoading={isLoading}
        emptyMessage='Belum ada pelanggan.'
      />
    </section>
  );
}
