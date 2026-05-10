import { Button } from '@heroui/react';

interface ActionButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'outline'
    | 'ghost'
    | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isDisabled?: boolean;
  isPending?: boolean;
  isIconOnly?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
}

export function ActionButton({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  isDisabled = false,
  isPending = false,
  isIconOnly = false,
  className = '',
  type = 'button',
  fullWidth = false,
}: ActionButtonProps) {
  return (
    <Button
      onPress={onPress}
      variant={variant}
      size={size}
      isDisabled={isDisabled}
      isPending={isPending}
      isIconOnly={isIconOnly}
      className={className}
      type={type}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  );
}
