'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Form } from '@heroui/react';
import { productsService } from '@/services/products';
import { transactionsService } from '@/services/transactions';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';
import {
  PageHeader,
  ActionButton,
  FormSelectField,
  FormTextField,
  SurfaceCard,
} from '@/components/ui';

export default function NewTransactionPage() {
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState('');

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => productsService.getProducts(),
  });

  const createMutation = useMutation({
    mutationFn: transactionsService.createTransaction,
    onSuccess: () => router.push('/transactions'),
    onError: (error: { message?: string }) =>
      alert(error.message || 'Gagal menyimpan transaksi'),
  });

  const productOptions = [
    { key: '', label: 'Pilih Produk' },
    ...products.map((p) => ({
      key: p.id,
      label: `${p.name} (Stok: ${p.current_stock})`,
    })),
  ];

  const transactionTypeOptions = [
    { key: 'IN', label: 'Stok Masuk (IN)' },
    { key: 'OUT', label: 'Stok Keluar (OUT)' },
    { key: 'ADJUST', label: 'Penyesuaian (Opname)' },
  ];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataSubmit = new FormData(e.currentTarget);
    createMutation.mutate({
      product_id: formDataSubmit.get('product_id') as string,
      type: formDataSubmit.get('type') as 'IN' | 'OUT' | 'ADJUST',
      quantity: Number(formDataSubmit.get('quantity')) || 0,
      note: (formDataSubmit.get('note') as string) || undefined,
    });
  };

  return (
    <section className='space-y-10'>
      <PageHeader eyebrow='Transaction Entry' title='Input Transaksi' />

      <SurfaceCard>
        <Form
          className='flex flex-col gap-6'
          onSubmit={onSubmit}
          validationBehavior='aria'
        >
          <div>
            <FormSelectField
              label='Pilih Produk'
              name='product_id'
              placeholder='Pilih Produk'
              options={productOptions}
              isRequired
            />
            <ActionButton
              variant='secondary'
              size='sm'
              className='mt-3'
              onPress={() => setIsScannerOpen(true)}
            >
              Scan
            </ActionButton>
          </div>

          <FormSelectField
            label='Jenis Transaksi'
            name='type'
            options={transactionTypeOptions}
            defaultValue='IN'
            isRequired
          />

          <FormTextField
            label='Catatan'
            name='note'
            placeholder='Keterangan (Opsional)'
          />

          <div className='flex flex-wrap justify-end gap-3'>
            <ActionButton variant='secondary' onPress={() => router.back()}>
              Batal
            </ActionButton>
            <ActionButton
              type='submit'
              variant='primary'
              isPending={createMutation.isPending}
            >
              Simpan Transaksi
            </ActionButton>
          </div>
        </Form>
      </SurfaceCard>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(code) => {
          const prod = products.find(
            (p) => p.barcode === code || p.sku === code,
          );
          if (prod) setSelectedProductId(prod.id);
          else alert('Produk dengan barcode ' + code + ' tidak ditemukan');
        }}
      />
    </section>
  );
}
