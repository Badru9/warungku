import { Card } from '@heroui/react';
import { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: ReactNode;
  variant?: 'transparent' | 'default' | 'secondary' | 'tertiary';
  className?: string;
}

export function StatCard({
  label,
  value,
  subLabel,
  icon,
  variant = 'default',
  className = '',
}: StatCardProps) {
  return (
    <Card variant={variant} className={`app-card group overflow-hidden p-6 ${className}`}>
      <div className='relative z-10'>
        <div className='mb-5 flex items-start justify-between gap-4'>
          <span className='max-w-[11rem] text-[11px] font-bold uppercase tracking-[0.2em] text-muted'>
            {label}
          </span>
          {icon && (
            <span className='grid size-10 place-items-center rounded-2xl bg-accent-soft text-accent transition group-hover:scale-105'>
              {icon}
            </span>
          )}
        </div>
        <p
          className='font-[var(--font-display)] text-5xl font-bold leading-none tracking-[-0.06em] text-foreground'
        >
          {value}
        </p>
        {subLabel && <p className='mt-3 text-sm text-muted'>{subLabel}</p>}
      </div>
    </Card>
  );
}
