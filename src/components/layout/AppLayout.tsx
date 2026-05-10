'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRightLeft,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Package,
  UserRound,
  Users,
} from 'lucide-react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  user: any;
  profile: any;
}

export function AppLayout({ children, profile }: AppLayoutProps) {
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
    <div className='dashboard-shell flex h-screen overflow-hidden bg-background text-foreground'>
      <Sidebar profile={profile} />

      <div className='flex h-screen flex-1 flex-col overflow-hidden'>
        <header className='flex items-center justify-between border-b border-border bg-surface/85 p-4 backdrop-blur-xl md:hidden'>
          <div>
            <p className='text-[10px] font-bold uppercase tracking-[0.22em] text-muted'>
              Warung Bu Dami
            </p>
            <h2 className='font-[var(--font-display)] text-xl font-bold tracking-[-0.03em] text-foreground'>
              Stock Room
            </h2>
          </div>
          <button
            onClick={handleLogout}
            className='rounded-full border border-border p-2 text-danger transition hover:bg-danger/10'
            aria-label='Logout'
          >
            <LogOut size={18} />
          </button>
        </header>

        <main className='flex-1 overflow-y-auto p-5 pb-28 md:p-8 md:pb-8'>
          {children}
        </main>

        <nav className='fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-border bg-surface/90 p-2 shadow-[var(--shadow-soft)] backdrop-blur-xl md:hidden'>
          {filteredNavItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.name} href={item.href} className='flex-1'>
                <div
                  className={
                    'mx-1 flex flex-col items-center rounded-2xl p-2 transition ' +
                    (isActive
                      ? 'bg-accent text-accent-foreground shadow-[var(--shadow-accent)]'
                      : 'text-muted hover:bg-accent-soft')
                  }
                >
                  <item.icon size={22} />
                  <span className='mt-1 text-[10px] font-bold'>
                    {item.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
