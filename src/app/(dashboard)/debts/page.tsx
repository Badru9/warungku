'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ActionButton, DataTable, PageHeader, StatCard, StatusPill } from '@/components/ui';
import type { TableColumn } from '@/components/ui/DataTable';
import { debtsService, type DebtRecord, type DebtStatus } from '@/services/debts';

const rupiah = (value = 0) => `Rp ${value.toLocaleString('id-ID')}`;

const statusLabel: Record<DebtStatus, string> = {
  UNPAID: 'Belum Bayar',
  PARTIAL: 'Sebagian',
  PAID: 'Lunas',
};

export default function DebtsPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'' | DebtStatus>('');

  const { data: debts = [], isLoading } = useQuery({
    queryKey: ['debts', { status }],
    queryFn: () => debtsService.getDebts({ status: status || undefined }),
  });

  const receivable = debts.reduce((sum, debt) => sum + (debt.remaining_amount || 0), 0);
  const paid = debts.reduce((sum, debt) => sum + (debt.paid_amount || 0), 0);
  const openCount = debts.filter((debt) => debt.status !== 'PAID').length;

  const columns: TableColumn<DebtRecord>[] = [
    {
      key: 'customer',
      label: 'Pelanggan',
      render: (d) => <span className='font-bold'>{d.customers?.name || '-'}</span>,
    },
    {
      key: 'amount',
      label: 'Total',
      render: (d) => <span>{rupiah(d.amount)}</span>,
    },
    {
      key: 'paid_amount',
      label: 'Dibayar',
      render: (d) => <span>{rupiah(d.paid_amount)}</span>,
    },
    {
      key: 'remaining_amount',
      label: 'Sisa',
      render: (d) => <span className='font-bold'>{rupiah(d.remaining_amount)}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (d) => (
        <StatusPill variant={d.status === 'PAID' ? 'success' : d.status === 'PARTIAL' ? 'warning' : 'danger'}>
          {statusLabel[d.status]}
        </StatusPill>
      ),
    },
    {
      key: 'due_date',
      label: 'Jatuh Tempo',
      render: (d) => <span>{d.due_date ? new Date(d.due_date).toLocaleDateString('id-ID') : '-'}</span>,
    },
  ];

  return (
    <section className='space-y-8'>
      <PageHeader
        eyebrow='Simple Finance'
        title='Hutang'
        description='Catat piutang pelanggan. Simple dulu: nominal, dibayar, sisa.'
        actions={
          <ActionButton onPress={() => router.push('/debts/new')}>
            Catat Hutang
          </ActionButton>
        }
      />

      <div className='grid gap-5 md:grid-cols-3'>
        <StatCard label='Piutang Aktif' value={rupiah(receivable)} />
        <StatCard label='Sudah Dibayar' value={rupiah(paid)} />
        <StatCard label='Belum Lunas' value={openCount} />
      </div>

      <div className='app-card flex flex-wrap items-end gap-4 rounded-[2rem] p-5'>
        <label className='block min-w-[260px]'>
          <span className='mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-muted'>
            Filter Status
          </span>
          <select
            className='login-input'
            value={status}
            onChange={(e) => setStatus(e.target.value as '' | DebtStatus)}
          >
            <option value=''>Semua Status</option>
            <option value='UNPAID'>Belum Bayar</option>
            <option value='PARTIAL'>Sebagian</option>
            <option value='PAID'>Lunas</option>
          </select>
        </label>
        {status ? (
          <ActionButton variant='secondary' onPress={() => setStatus('')}>
            Reset
          </ActionButton>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        data={debts}
        keyExtractor={(d) => d.id}
        isLoading={isLoading}
        emptyMessage='Belum ada catatan hutang.'
      />
    </section>
  );
}
