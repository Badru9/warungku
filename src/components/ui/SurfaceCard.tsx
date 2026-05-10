import { Card } from '@heroui/react';

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'transparent' | 'default' | 'secondary' | 'tertiary';
}

export function SurfaceCard({
  children,
  className = '',
  variant = 'default',
}: SurfaceCardProps) {
  return (
    <Card variant={variant} className={`p-6 ${className}`}>
      {children}
    </Card>
  );
}
