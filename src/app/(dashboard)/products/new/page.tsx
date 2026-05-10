'use client';

import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';
import {
  ActionButton,
  FormSelectField,
  FormTextField,
  PageHeader,
  SurfaceCard,
} from '@/components/ui';
import { categoriesService } from '@/services/categories';
import { productsService } from '@/services/products';
import { Form } from '@heroui/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewProductPage() {
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    barcode: '',
    category_id: '',
    unit: 'pcs',
    buy_price: 0,
    sell_price: 0,
    current_stock: 0,
    min_stock: 0,
  });

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => router.push('/products'),
    onError: () => alert('Gagal menyimpan produk'),
  });

  const categoryOptions = [
    { key: '', label: 'Semua Kategori' },
    ...categories.map((cat) => ({ key: cat.id, label: cat.name })),
  ];

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formDataSubmit = new FormData(e.currentTarget);
    const payload = {
      name: formDataSubmit.get('name') as string,
      sku: (formDataSubmit.get('sku') as string) || undefined,
      barcode: (formDataSubmit.get('barcode') as string) || undefined,
      category_id: (formDataSubmit.get('category_id') as string) || undefined,
      unit: formDataSubmit.get('unit') as string,
      buy_price: Number(formDataSubmit.get('buy_price')) || 0,
      sell_price: Number(formDataSubmit.get('sell_price')) || 0,
      current_stock: Number(formDataSubmit.get('current_stock')) || 0,
      min_stock: Number(formDataSubmit.get('min_stock')) || 0,
    };
    createMutation.mutate(payload);
  };

  return (
    <section className='space-y-10'>
      <PageHeader eyebrow='Create Product' title='Tambah Produk' />

      <SurfaceCard>
        <Form
          className='flex flex-col gap-6'
          onSubmit={onSubmit}
          validationBehavior='aria'
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <FormTextField
              label='Nama Produk'
              name='name'
              placeholder='Nama Produk'
              isRequired
            />
            <FormTextField label='SKU' name='sku' placeholder='SKU' />

            <div className='md:col-span-2'>
              <FormTextField
                label='Barcode'
                name='barcode'
                placeholder='Barcode'
                className='mb-3'
              />
              <ActionButton
                variant='secondary'
                size='sm'
                onPress={() => setIsScannerOpen(true)}
              >
                Scan
              </ActionButton>
            </div>

            <FormSelectField
              label='Kategori'
              name='category_id'
              placeholder='Semua Kategori'
              options={categoryOptions}
            />

            <FormTextField
              label='Satuan'
              name='unit'
              placeholder='pcs, box, kg'
              isRequired
            />

            <FormTextField
              label='Harga Beli'
              name='buy_price'
              type='number'
              isRequired
            />
            <FormTextField
              label='Harga Jual'
              name='sell_price'
              type='number'
              isRequired
            />
            <FormTextField
              label='Stok Awal'
              name='current_stock'
              type='number'
              isRequired
            />
            <FormTextField
              label='Stok Minimum'
              name='min_stock'
              type='number'
              isRequired
            />
          </div>

          <div className='flex flex-wrap justify-end gap-3'>
            <ActionButton variant='secondary' onPress={() => router.back()}>
              Batal
            </ActionButton>
            <ActionButton
              type='submit'
              variant='primary'
              isPending={createMutation.isPending}
            >
              Simpan
            </ActionButton>
          </div>
        </Form>
      </SurfaceCard>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(code) => setFormData((prev) => ({ ...prev, barcode: code }))}
      />
    </section>
  );
}
