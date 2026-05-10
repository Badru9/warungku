'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Form } from '@heroui/react';
import { productsService } from '@/services/products';
import { categoriesService } from '@/services/categories';
import { BarcodeScanner } from '@/components/scanner/BarcodeScanner';
import { PageHeader, ActionButton, FormTextField, FormSelectField, SurfaceCard } from '@/components/ui';

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [initialData, setInitialData] = useState<Record<string, unknown> | null>(null);

  const { isLoading: productLoading } = useQuery({
    queryKey: ['products', params.id],
    queryFn: () => productsService.getProductById(params.id),
    select: (data) => {
      if (data) {
        setInitialData({
          name: data.name || '',
          sku: data.sku || '',
          barcode: data.barcode || '',
          category_id: data.category_id || '',
          unit: data.unit || '',
          buy_price: data.buy_price || 0,
          sell_price: data.sell_price || 0,
          current_stock: data.current_stock || 0,
          min_stock: data.min_stock || 0,
        });
      }
      return data;
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      productsService.updateProduct(params.id, payload as Parameters<typeof productsService.updateProduct>[1]),
    onSuccess: () => router.push(`/products/${params.id}`),
    onError: () => alert('Gagal update produk'),
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
      sku: formDataSubmit.get('sku') as string || undefined,
      barcode: formDataSubmit.get('barcode') as string || undefined,
      category_id: formDataSubmit.get('category_id') as string || undefined,
      unit: formDataSubmit.get('unit') as string,
      buy_price: Number(formDataSubmit.get('buy_price')) || 0,
      sell_price: Number(formDataSubmit.get('sell_price')) || 0,
      current_stock: Number(formDataSubmit.get('current_stock')) || 0,
      min_stock: Number(formDataSubmit.get('min_stock')) || 0,
    };
    updateMutation.mutate(payload);
  };

  if (productLoading || !initialData) {
    return (
      <section className="space-y-10">
        <PageHeader eyebrow="Edit Product" title="Edit Produk" />
        <SurfaceCard>Loading...</SurfaceCard>
      </section>
    );
  }

  return (
    <section className="space-y-10">
      <PageHeader
        eyebrow="Edit Product"
        title="Edit Produk"
      />

      <SurfaceCard>
        <Form
          className="flex flex-col gap-6"
          onSubmit={onSubmit}
          validationBehavior="aria"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormTextField
              label="Nama Produk"
              name="name"
              placeholder="Nama Produk"
              defaultValue={initialData.name as string}
              isRequired
            />
            <FormTextField
              label="SKU"
              name="sku"
              placeholder="SKU"
              defaultValue={initialData.sku as string}
            />

            <div className="md:col-span-2">
              <FormTextField
                label="Barcode"
                name="barcode"
                placeholder="Barcode"
                defaultValue={initialData.barcode as string}
                className="mb-3"
              />
              <ActionButton
                variant="secondary"
                size="sm"
                onPress={() => setIsScannerOpen(true)}
              >
                Scan
              </ActionButton>
            </div>

            <FormSelectField
              label="Kategori"
              name="category_id"
              placeholder="Semua Kategori"
              options={categoryOptions}
              defaultValue={initialData.category_id as string}
            />

            <FormTextField
              label="Satuan"
              name="unit"
              placeholder="pcs, box, kg"
              defaultValue={initialData.unit as string}
              isRequired
            />

            <FormTextField
              label="Harga Beli"
              name="buy_price"
              type="number"
              defaultValue={String(initialData.buy_price)}
              isRequired
            />
            <FormTextField
              label="Harga Jual"
              name="sell_price"
              type="number"
              defaultValue={String(initialData.sell_price)}
              isRequired
            />
            <FormTextField
              label="Stok Saat Ini"
              name="current_stock"
              type="number"
              defaultValue={String(initialData.current_stock)}
              isRequired
            />
            <FormTextField
              label="Stok Minimum"
              name="min_stock"
              type="number"
              defaultValue={String(initialData.min_stock)}
              isRequired
            />
          </div>

          <div className="flex flex-wrap justify-end gap-3">
            <ActionButton variant="secondary" onPress={() => router.back()}>
              Batal
            </ActionButton>
            <ActionButton
              type="submit"
              variant="primary"
              isPending={updateMutation.isPending}
            >
              Simpan Perubahan
            </ActionButton>
          </div>
        </Form>
      </SurfaceCard>

      <BarcodeScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        onScan={(code) => setInitialData((prev) => prev ? { ...prev, barcode: code } : null)}
      />
    </section>
  );
}
