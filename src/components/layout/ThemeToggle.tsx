'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

const subscribe = () => () => undefined;
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function ThemeToggle({ className }: { className?: string }) {
  const mounted = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
  const { setTheme, resolvedTheme } = useTheme();

  const buttonClassName = `p-2 hover:bg-accent-soft rounded-full text-muted ${className || ''}`;

  if (!mounted) {
    return (
      <button
        className={buttonClassName}
        title='Toggle theme'
        aria-label='Toggle theme'
        type='button'
      >
        <Sun size={18} />
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';
  const title = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={buttonClassName}
      title={title}
      aria-label={title}
      type='button'
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
