'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { productsService } from '@/services/products';
import {
  PageHeader,
  ActionButton,
  SurfaceCard,
  StatusPill,
  DataTable,
} from '@/components/ui';
import type { TableColumn } from '@/components/ui/DataTable';

type PriceHistory = {
  id: string;
  changed_at: string;
  old_buy_price: number;
  new_buy_price: number;
  old_sell_price: number;
  new_sell_price: number;
  profiles?: { full_name: string };
};

export default function ProductDetailPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [showHistory, setShowHistory] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getProductById(id),
  });

  const { data: priceHistory = [], isLoading: historyLoading } = useQuery({
    queryKey: ['products', id, 'price-history'],
    queryFn: () => productsService.getPriceHistory(id),
    enabled: showHistory,
  });

  const handleDelete = async () => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;
    await productsService.deleteProduct(id);
    router.push('/products');
  };

  const historyColumns: TableColumn<PriceHistory>[] = [
    {
      key: 'changed_at',
      label: 'Tanggal',
      render: (h) => new Date(h.changed_at).toLocaleString('id-ID'),
    },
    {
      key: 'buy_price',
      label: 'Harga Beli',
      render: (h) =>
        `Rp ${h.old_buy_price.toLocaleString()} → Rp ${h.new_buy_price.toLocaleString()}`,
    },
    {
      key: 'sell_price',
      label: 'Harga Jual',
      render: (h) =>
        `Rp ${h.old_sell_price.toLocaleString()} → Rp ${h.new_sell_price.toLocaleString()}`,
    },
    {
      key: 'profile',
      label: 'Oleh',
      render: (h) => <span>{h.profiles?.full_name}</span>,
    },
  ];

  if (isLoading) {
    return (
      <section className='space-y-10'>
        <PageHeader eyebrow='Product Profile' title='Loading...' />
        <SurfaceCard>Loading...</SurfaceCard>
      </section>
    );
  }

  if (!product) {
    return (
      <section className='space-y-10'>
        <PageHeader eyebrow='Product Profile' title='Produk Tidak Ditemukan' />
        <SurfaceCard>Produk tidak ditemukan.</SurfaceCard>
      </section>
    );
  }

  return (
    <section className='space-y-10'>
      <PageHeader
        eyebrow='Product Profile'
        title={product.name}
        actions={
          <>
            <ActionButton variant='secondary' onPress={() => router.back()}>
              Kembali
            </ActionButton>
            <ActionButton
              variant='secondary'
              onPress={() => router.push(`/products/${id}/edit`)}
            >
              Edit
            </ActionButton>
            <ActionButton variant='danger' onPress={handleDelete}>
              Hapus
            </ActionButton>
          </>
        }
      />

      <div className='flex gap-3'>
        <ActionButton
          variant={!showHistory ? 'primary' : 'secondary'}
          onPress={() => setShowHistory(false)}
        >
          Informasi Utama
        </ActionButton>
        <ActionButton
          variant={showHistory ? 'primary' : 'secondary'}
          onPress={() => setShowHistory(true)}
        >
          Riwayat Harga
        </ActionButton>
      </div>

      {!showHistory ? (
        <SurfaceCard>
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div>
              <p className='eyebrow'>Nama Produk</p>
              <p
                className='mt-2 text-2xl'
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.name}
              </p>
            </div>
            <div>
              <p className='eyebrow'>Kategori</p>
              <p className='mt-2 text-lg'>{product.categories?.name || '-'}</p>
            </div>
            <div>
              <p className='eyebrow'>SKU</p>
              <p className='mt-2'>{product.sku || '-'}</p>
            </div>
            <div>
              <p className='eyebrow'>Barcode</p>
              <p className='mt-2'>{product.barcode || '-'}</p>
            </div>
            <div>
              <p className='eyebrow'>Harga Beli</p>
              <p className='mt-2'>
                Rp {product.buy_price.toLocaleString('id-ID')}
              </p>
            </div>
            <div>
              <p className='eyebrow'>Harga Jual</p>
              <p className='mt-2'>
                Rp {product.sell_price.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className='mt-6 rounded-lg bg-accent-soft p-5'>
            <div className='flex flex-wrap items-center justify-between gap-3'>
              <div>
                <p className='eyebrow'>Stok Saat Ini</p>
                <div className='flex items-center gap-3 mt-1'>
                  <p
                    className='text-4xl'
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {product.current_stock}
                  </p>
                  <span className='text-lg text-muted'>{product.unit}</span>
                  <StatusPill
                    variant={
                      product.current_stock <= product.min_stock
                        ? 'warning'
                        : 'success'
                    }
                  >
                    {product.current_stock <= product.min_stock
                      ? 'Menipis'
                      : 'Aman'}
                  </StatusPill>
                </div>
              </div>
              <div className='text-right'>
                <p className='eyebrow'>Stok Minimum</p>
                <p className='mt-1 text-xl'>{product.min_stock}</p>
              </div>
            </div>
          </div>
        </SurfaceCard>
      ) : (
        <DataTable
          columns={historyColumns}
          data={priceHistory}
          keyExtractor={(h) => h.id}
          isLoading={historyLoading}
          emptyMessage='Belum ada riwayat perubahan harga.'
        />
      )}
    </section>
  );
}
