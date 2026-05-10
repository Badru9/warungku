import { Card } from '@heroui/react';

export interface TableColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  isLoading?: boolean;
  emptyMessage?: string;
  onRowClick?: (item: T) => void;
  className?: string;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyMessage = 'Tidak ada data ditemukan.',
  onRowClick,
  className = '',
}: DataTableProps<T>) {
  return (
    <Card className={`app-card overflow-x-auto p-2 ${className}`}>
      <table className='w-full min-w-[800px] border-collapse'>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className='px-4 py-4 text-left text-[11px] font-bold uppercase tracking-[0.2em] text-muted'
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody title='Klik untuk lihat detail'>
          {isLoading ? (
            <tr>
              <td
                colSpan={columns.length}
                className='py-10 text-center text-muted'
              >
                Loading...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className='py-10 text-center text-muted'
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={
                  'border-t border-border/70 transition ' +
                  (onRowClick
                    ? 'cursor-pointer hover:bg-accent-soft'
                    : 'hover:bg-surface-secondary/70')
                }
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className='px-4 py-4 text-sm text-foreground'
                  >
                    {col.render
                      ? col.render(item)
                      : ((item as Record<string, unknown>)[
                          col.key
                        ] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
