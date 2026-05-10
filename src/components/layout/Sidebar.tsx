'use client';

import { Avatar } from '@heroui/react';
import {
  ArrowRightLeft,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  UserRound,
  Users,
  Warehouse,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
// import { ThemeToggle } from './ThemeToggle';

interface SidebarProps {
  profile: any;
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      roles: ['owner', 'staff', 'admin'],
    },
    {
      name: 'Produk',
      href: '/products',
      icon: Package,
      roles: ['owner', 'staff', 'admin'],
    },
    {
      name: 'Transaksi',
      href: '/transactions',
      icon: ArrowRightLeft,
      roles: ['owner', 'staff', 'admin'],
    },
    {
      name: 'Pelanggan',
      href: '/customers',
      icon: UserRound,
      roles: ['owner', 'staff', 'admin'],
    },
    {
      name: 'Hutang',
      href: '/debts',
      icon: CreditCard,
      roles: ['owner', 'staff', 'admin'],
    },
    { name: 'Staff', href: '/staff', icon: Users, roles: ['owner', 'admin'] },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(profile?.role || 'staff'),
  );

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  };

  return (
    <aside className='hidden w-[18rem] shrink-0 flex-col border-r border-border bg-surface/82 p-4 shadow-[var(--shadow-soft)] backdrop-blur-xl md:flex'>
      <div className='mb-5 rounded-[1.75rem] border border-border bg-surface-secondary/70 p-5'>
        <div className='flex items-center gap-3'>
          <div className='grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-[var(--shadow-accent)]'>
            <Warehouse size={21} />
          </div>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.24em] text-muted'>
              Warung Bu Dami
            </p>
            <h2 className='font-[var(--font-display)] text-2xl font-bold leading-none tracking-[-0.04em]'>
              Stock Room
            </h2>
          </div>
        </div>
      </div>

      <nav className='flex-1 space-y-2 overflow-y-auto pr-1'>
        {filteredNavItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ' +
                  (isActive
                    ? 'bg-accent text-accent-foreground shadow-[var(--shadow-accent)]'
                    : 'text-muted hover:bg-accent-soft hover:text-foreground')
                }
              >
                <item.icon size={19} />
                <span>{item.name}</span>
                {isActive ? <span className='ml-auto'>•</span> : null}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className='mt-5 rounded-[1.75rem] border border-border bg-surface-secondary/70 p-4'>
        <div className='mb-4 flex items-center justify-between gap-3'>
          <div className='flex min-w-0 items-center gap-3'>
            <Avatar size='sm'>
              <Avatar.Fallback>
                {profile?.full_name?.charAt(0) || 'U'}
              </Avatar.Fallback>
            </Avatar>
            <div className='min-w-0 text-left'>
              <p className='truncate text-sm font-bold'>
                {profile?.full_name || 'User'}
              </p>
              <p className='text-[10px] font-bold uppercase tracking-[0.18em] text-muted'>
                {profile?.role || 'staff'}
              </p>
            </div>
          </div>
          {/* <ThemeToggle /> */}
        </div>
        <button
          onClick={handleLogout}
          className='flex w-full items-center justify-center gap-2 rounded-2xl border border-border px-3 py-2 text-sm font-bold text-danger transition hover:bg-danger/10'
        >
          <LogOut size={17} />
          Logout
        </button>
      </div>
    </aside>
  );
}
