'use client';

import { DataTable, PageHeader, StatCard, StatusPill } from '@/components/ui';
import type { TableColumn } from '@/components/ui/DataTable';
import { dashboardService } from '@/services/dashboard';
import { productsService } from '@/services/products';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Package, TrendingUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type ChartPoint = {
  created_at: string;
  type: 'IN' | 'OUT';
  quantity: number;
};

type DayPoint = {
  name: string;
  Masuk: number;
  Keluar: number;
};

type LowStockProduct = {
  id: string;
  name: string;
  current_stock: number;
  min_stock: number;
  unit: string;
};

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
  });

  const { data: lowStockProducts = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productsService.getProducts({ low_stock: true }),
  });

  const { data: chartData = [], isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard', 'chart', 'weekly'],
    queryFn: () => dashboardService.getChartData('weekly'),
  });

  const loading = summaryLoading || productsLoading || chartLoading;

  const processChartData = (transactions: ChartPoint[]): DayPoint[] => {
    const days: Record<string, DayPoint> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('id-ID', { weekday: 'short' });
      days[dateStr] = { name: dateStr, Masuk: 0, Keluar: 0 };
    }

    transactions.forEach((t) => {
      const dateStr = new Date(t.created_at).toLocaleDateString('id-ID', {
        weekday: 'short',
      });
      if (days[dateStr]) {
        if (t.type === 'IN') days[dateStr].Masuk += t.quantity;
        if (t.type === 'OUT') days[dateStr].Keluar += t.quantity;
      }
    });

    return Object.values(days);
  };

  const processedChartData = processChartData(chartData as ChartPoint[]);

  const summaryData = summary || {
    totalProducts: 0,
    lowStock: 0,
    transactionsToday: 0,
  };

  const stats = [
    {
      label: 'Total Produk Aktif',
      value: summaryData.totalProducts,
      icon: <Package size={18} />,
      sub: 'produk terdaftar',
    },
    {
      label: 'Stok Menipis',
      value: summaryData.lowStock,
      icon: <AlertTriangle size={18} />,
      sub: 'butuh perhatian',
    },
    {
      label: 'Transaksi Hari Ini',
      value: summaryData.transactionsToday,
      icon: <TrendingUp size={18} />,
      sub: 'barang masuk & keluar',
    },
  ];

  const columns: TableColumn<LowStockProduct>[] = [
    {
      key: 'name',
      label: 'Nama Produk',
      render: (p) => <span className='font-medium'>{p.name}</span>,
    },
    {
      key: 'min_stock',
      label: 'Min Stok',
      render: (p) => `${p.min_stock} ${p.unit}`,
    },
    {
      key: 'current_stock',
      label: 'Stok Saat Ini',
      render: (p) => (
        <StatusPill variant='warning'>
          {p.current_stock} {p.unit}
        </StatusPill>
      ),
    },
  ];

  return (
    <section className='space-y-8 md:space-y-10'>
      <div className='app-card overflow-hidden rounded-[2rem] p-6 md:p-8'>
        <div className='grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end'>
          <PageHeader
            eyebrow='Daily Operations Brief'
            title='Dashboard'
            description='Ringkasan arus inventori, restock, dan transaksi harian.'
          />
          <div className='rounded-[1.5rem] border border-border bg-accent-soft px-5 py-4 text-sm text-muted'>
            <span className='block text-[10px] font-bold uppercase tracking-[0.22em]'>
              Theme Source
            </span>
            <span className='mt-1 block font-bold text-foreground'>HeroUI tokens</span>
          </div>
        </div>
      </div>

      <div className='grid gap-5 md:grid-cols-3'>
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={loading ? '-' : stat.value}
            subLabel={stat.sub}
            icon={stat.icon}
          />
        ))}
      </div>

      <div className='grid gap-6 lg:grid-cols-5'>
        <article className='lg:col-span-3'>
          <div className='mb-5 flex items-end justify-between gap-4'>
            <h2
              className='text-2xl font-semibold text-foreground'
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Alur Transaksi
            </h2>
            <p className='mt-1 text-xs font-semibold uppercase tracking-widest text-muted'>
              7 hari terakhir
            </p>
          </div>

          <div className='app-card h-[320px] w-full rounded-[2rem] p-5 md:p-6'>
            {loading ? (
              <div className='flex h-full items-center justify-center text-sm text-muted'>
                Loading chart&hellip;
              </div>
            ) : (
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart
                  data={processedChartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id='dashMasuk' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='5%'
                        stopColor='var(--accent)'
                        stopOpacity={0.24}
                      />
                      <stop
                        offset='95%'
                        stopColor='var(--accent)'
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient id='dashKeluar' x1='0' y1='0' x2='0' y2='1'>
                      <stop
                        offset='5%'
                        stopColor='var(--danger)'
                        stopOpacity={0.2}
                      />
                      <stop
                        offset='95%'
                        stopColor='var(--danger)'
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray='3 3'
                    vertical={false}
                    stroke='var(--border)'
                    opacity={0.55}
                  />
                  <XAxis
                    dataKey='name'
                    tick={{ fill: 'var(--muted)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: 'var(--muted)', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 8,
                      color: 'var(--foreground)',
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='Masuk'
                    stroke='var(--accent)'
                    strokeWidth={2.4}
                    fill='url(#dashMasuk)'
                    dot={false}
                  />
                  <Area
                    type='monotone'
                    dataKey='Keluar'
                    stroke='var(--danger)'
                    strokeWidth={2.4}
                    fill='url(#dashKeluar)'
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </article>

        <article className='lg:col-span-2'>
          <div className='mb-5'>
            <h2
              className='text-2xl font-semibold text-foreground'
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Stok Menipis
            </h2>
            <p className='mt-1 text-xs font-semibold uppercase tracking-widest text-muted'>
              Prioritas restock
            </p>
          </div>

          <div className='space-y-3'>
            {loading ? (
              <p className='text-sm text-muted'>Loading...</p>
            ) : lowStockProducts.length === 0 ? (
              <p className='text-sm text-muted'>Semua stok aman.</p>
            ) : (
              <DataTable
                columns={columns}
                data={lowStockProducts}
                keyExtractor={(p) => p.id}
                isLoading={false}
                emptyMessage='Tidak ada stok menipis.'
              />
            )}
          </div>
        </article>
      </div>
    </section>
  );
}
