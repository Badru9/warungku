'use client';

import {
  ActionButton,
  DataTable,
  PageHeader,
  StatCard,
  StatusPill,
  SurfaceCard,
} from '@/components/ui';
import type { TableColumn } from '@/components/ui/DataTable';
import { categoriesService } from '@/services/categories';
import { productsService } from '@/services/products';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', { search, categoryId }],
    queryFn: () =>
      productsService.getProducts({
        search,
        category_id: categoryId || undefined,
      }),
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  });

  const loading = productsLoading || categoriesLoading;

  const heroProduct = products[0];

  const columns: TableColumn<any>[] = [
    {
      key: 'name',
      label: 'Nama Produk',
      render: (p) => <span>{p.name}</span>,
    },
    {
      key: 'sku',
      label: 'SKU / Barcode',
      render: (p) => (
        <span>
          {p.sku || '-'} {p.barcode ? ` / ${p.barcode}` : ''}
        </span>
      ),
    },
    {
      key: 'category',
      label: 'Kategori',
      render: (p) => <span>{p.categories?.name || '-'}</span>,
    },
    {
      key: 'stock',
      label: 'Stok',
      render: (p) => (
        <span>
          {p.current_stock} {p.unit}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Harga Jual',
      render: (p) => <span>Rp {p.sell_price.toLocaleString('id-ID')}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (p) => (
        <StatusPill
          variant={p.current_stock <= p.min_stock ? 'danger' : 'success'}
        >
          {p.current_stock <= p.min_stock ? 'Menipis' : 'Aman'}
        </StatusPill>
      ),
    },
  ];

  console.log(categories, products);

  return (
    <section className='space-y-12 md:space-y-16'>
      <PageHeader
        eyebrow='Editorial Inventory'
        title='Products'
        actions={
          <ActionButton onPress={() => router.push('/products/new')}>
            Tambah Produk
          </ActionButton>
        }
      />

      <div className='grid gap-6 md:grid-cols-[1fr_240px_240px] md:items-end'>
        <label className='block'>
          <span className='eyebrow'>Search</span>
          <input
            placeholder='Cari nama, SKU, barcode'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <label className='block'>
          <span className='eyebrow'>Category</span>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value=''>Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>
        <div className='flex gap-3 md:justify-end'>
          <span className='text-sm font-medium text-muted'>
            {products.length} Produk
          </span>
        </div>
      </div>

      <div className='grid gap-8 lg:grid-cols-3'>
        <SurfaceCard variant='default' className='lg:col-span-2'>
          <div className='mb-6 flex items-center justify-between'>
            <h2
              className='text-2xl font-bold text-foreground'
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Featured Product
            </h2>
            <span className='eyebrow'>Hero Card</span>
          </div>
          {heroProduct ? (
            <div className='grid gap-8 md:grid-cols-[1.3fr_1fr]'>
              <div className='h-[240px] rounded-xl border border-border bg-[linear-gradient(140deg,var(--app-accent-soft),color-mix(in_oklch,var(--surface-secondary)_72%,transparent))]' />
              <div className='space-y-4'>
                <h3
                  className='text-2xl font-semibold'
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {heroProduct.name}
                </h3>
                <p className='text-sm text-muted'>
                  Kategori: {heroProduct.categories?.name || '-'}
                </p>
                <p className='text-sm text-muted'>
                  Harga Jual: Rp{' '}
                  {heroProduct.sell_price.toLocaleString('id-ID')}
                </p>
                <p className='text-sm text-muted'>
                  Stok: {heroProduct.current_stock} {heroProduct.unit}
                </p>
                <ActionButton
                  variant='secondary'
                  className='mt-3'
                  onPress={() => router.push('/products/' + heroProduct.id)}
                >
                  Lihat Detail
                </ActionButton>
              </div>
            </div>
          ) : (
            <p className='text-muted'>Belum ada produk.</p>
          )}
        </SurfaceCard>

        <SurfaceCard variant='default'>
          <h2
            className='text-2xl font-bold text-foreground'
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Quick Insight
          </h2>
          <div className='mt-6 space-y-4'>
            <StatCard
              label='Low Stock'
              value={
                products.filter((p) => p.current_stock <= p.min_stock).length
              }
            />
            <StatCard label='Kategori' value={categories.length} />
            <StatCard
              label='Total SKU'
              value={products.filter((p) => p.sku).length}
            />
          </div>
        </SurfaceCard>
      </div>

      <div className='mt-6'>
        <DataTable
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          isLoading={loading}
          emptyMessage='Tidak ada produk ditemukan.'
          onRowClick={(p) => router.push('/products/' + p.id)}
        />
      </div>

      <div className='fixed bottom-8 right-8'>
        <ActionButton
          variant='primary'
          size='lg'
          isIconOnly={false}
          className='h-16 w-16 rounded-full'
          onPress={() => router.push('/products/new')}
        >
          +
        </ActionButton>
      </div>
    </section>
  );
}
