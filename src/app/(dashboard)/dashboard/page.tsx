'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { productsService } from '@/services/products';
import { Card, Spinner, Table, Chip } from '@heroui/react';
import { Package, AlertTriangle, TrendingUp } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

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

  const processChartData = (transactions: any[]) => {
    const days: any = {};
    // Get last 7 days
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

  const processedChartData = processChartData(chartData);

  const summaryData = summary || {
    totalProducts: 0,
    lowStock: 0,
    transactionsToday: 0,
  };

  if (loading) {
    return (
      <div className='flex h-full items-center justify-center'>
        <Spinner />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Dashboard</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <Card className='p-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-primary/10 rounded-lg text-primary'>
              <Package size={24} />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Total Produk Aktif</p>
              <h3 className='text-2xl font-bold'>{summaryData.totalProducts}</h3>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-danger/10 rounded-lg text-danger'>
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Produk Stok Menipis</p>
              <h3 className='text-2xl font-bold'>{summaryData.lowStock}</h3>
            </div>
          </div>
        </Card>

        <Card className='p-4'>
          <div className='flex items-center gap-4'>
            <div className='p-3 bg-success/10 rounded-lg text-success'>
              <TrendingUp size={24} />
            </div>
            <div>
              <p className='text-sm text-gray-500'>Transaksi Hari Ini</p>
              <h3 className='text-2xl font-bold'>
                {summaryData.transactionsToday}
              </h3>
            </div>
          </div>
        </Card>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>
            Statistik Transaksi (7 Hari Terakhir)
          </h3>
          <div className='h-[300px] w-full'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={processedChartData}>
                <CartesianGrid strokeDasharray='3 3' vertical={false} />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='Masuk'
                  stroke='#10b981'
                  strokeWidth={2}
                />
                <Line
                  type='monotone'
                  dataKey='Keluar'
                  stroke='#ef4444'
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className='p-6'>
          <h3 className='text-lg font-semibold mb-4'>Produk Stok Menipis</h3>
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label='Low stock products'>
                <Table.Header>
                  <Table.Column isRowHeader>PRODUK</Table.Column>
                  <Table.Column>STOK</Table.Column>
                  <Table.Column>MIN</Table.Column>
                </Table.Header>
                <Table.Body>
                  {lowStockProducts.length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={3} className='text-center py-4'>
                        Semua stok aman.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    lowStockProducts.slice(0, 5).map((p: any) => (
                      <Table.Row key={p.id}>
                        <Table.Cell className='font-medium'>
                          {p.name}
                        </Table.Cell>
                        <Table.Cell>
                          <span className='text-danger font-bold'>
                            {p.current_stock}
                          </span>{' '}
                          {p.unit}
                        </Table.Cell>
                        <Table.Cell>{p.min_stock}</Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card>
      </div>
    </div>
  );
}
