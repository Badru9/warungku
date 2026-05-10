'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { transactionsService } from '@/services/transactions';
import { exportToExcel, exportToPDF } from '@/utils/export';
import {
  PageHeader,
  ActionButton,
  StatusPill,
  StatCard,
  DataTable,
  SurfaceCard,
} from '@/components/ui';
import type { TableColumn } from '@/components/ui/DataTable';

export default function TransactionsPage() {
  const router = useRouter();
  const [type, setType] = useState<'' | 'IN' | 'OUT' | 'ADJUST'>('');

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', { type }],
    queryFn: () =>
      transactionsService.getTransactions({ type: type || undefined }),
  });

  const handleExportExcel = () => {
    const data = transactions.map((t) => ({
      Tanggal: new Date(t.created_at).toLocaleString('id-ID'),
      Produk: t.products?.name,
      Jenis: t.type,
      Jumlah: t.quantity,
      Satuan: t.products?.unit,
      'Stok Akhir': t.stock_after,
      Pencatat: t.profiles?.full_name,
      Catatan: t.note || '-',
    }));
    exportToExcel(
      data,
      `Transaksi_Warungku_${new Date().toISOString().split('T')[0]}`,
    );
  };

  const handleExportPDF = () => {
    const headers = [
      'Tanggal',
      'Produk',
      'Jenis',
      'Jumlah',
      'Stok Akhir',
      'Pencatat',
    ];
    const data = transactions.map((t) => [
      new Date(t.created_at).toLocaleString('id-ID'),
      t.products?.name,
      t.type,
      `${t.type === 'OUT' ? '-' : '+'}${t.quantity} ${t.products?.unit}`,
      `${t.stock_after} ${t.products?.unit}`,
      t.profiles?.full_name,
    ]);
    exportToPDF(
      headers,
      data,
      `Transaksi_Warungku_${new Date().toISOString().split('T')[0]}`,
      'Laporan Transaksi Stok Warungku',
    );
  };

  const columns: TableColumn<any>[] = [
    {
      key: 'date',
      label: 'Tanggal',
      render: (t) => (
        <span>{new Date(t.created_at).toLocaleString('id-ID')}</span>
      ),
    },
    {
      key: 'product',
      label: 'Produk',
      render: (t) => <span>{t.products?.name}</span>,
    },
    {
      key: 'type',
      label: 'Jenis',
      render: (t) => (
        <StatusPill variant={t.type === 'IN' ? 'success' : 'danger'}>
          {t.type}
        </StatusPill>
      ),
    },
    {
      key: 'quantity',
      label: 'Jumlah',
      render: (t) => (
        <span>
          {t.type === 'OUT' ? '-' : '+'}
          {t.quantity} {t.products?.unit}
        </span>
      ),
    },
    {
      key: 'stock_after',
      label: 'Stok Akhir',
      render: (t) => (
        <span>
          {t.stock_after} {t.products?.unit}
        </span>
      ),
    },
    {
      key: 'profile',
      label: 'Pencatat',
      render: (t) => <span>{t.profiles?.full_name}</span>,
    },
  ];

  return (
    <section className='space-y-12'>
      <PageHeader
        eyebrow='Operational Ledger'
        title='Transactions'
        actions={
          <>
            <ActionButton variant='secondary' onPress={handleExportExcel}>
              Export Excel
            </ActionButton>
            <ActionButton variant='secondary' onPress={handleExportPDF}>
              Export PDF
            </ActionButton>
            <ActionButton
              variant='primary'
              onPress={() => router.push('/transactions/new')}
            >
              Input Transaksi
            </ActionButton>
          </>
        }
      />

      <div className='grid gap-6 md:grid-cols-3'>
        <StatCard label='Total Entries' value={transactions.length} />
        <StatCard
          label='Stok Masuk'
          value={transactions.filter((t) => t.type === 'IN').length}
        />
        <StatCard
          label='Stok Keluar'
          value={transactions.filter((t) => t.type === 'OUT').length}
        />
      </div>

      <div className='flex flex-wrap items-end gap-6'>
        <label className='block min-w-[260px]'>
          <span className='eyebrow'>Filter Jenis</span>
          <select
            value={type}
            onChange={(e) =>
              setType(e.target.value as '' | 'IN' | 'OUT' | 'ADJUST')
            }
          >
            <option value=''>Semua Jenis</option>
            <option value='IN'>Stok Masuk</option>
            <option value='OUT'>Stok Keluar</option>
            <option value='ADJUST'>Penyesuaian</option>
          </select>
        </label>
        {type ? <StatusPill>Filter Aktif: {type}</StatusPill> : null}
        {type ? (
          <ActionButton variant='tertiary' onPress={() => setType('')}>
            Reset
          </ActionButton>
        ) : null}
      </div>

      <DataTable
        columns={columns}
        data={transactions}
        keyExtractor={(t) => t.id}
        isLoading={isLoading}
        emptyMessage='Tidak ada transaksi ditemukan.'
      />
    </section>
  );
}
