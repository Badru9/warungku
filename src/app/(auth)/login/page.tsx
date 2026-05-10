'use client';

import {
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  WarehouseIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useReducer } from 'react';
import { authService } from '@/services/auth';

type LoginState = {
  email: string;
  password: string;
  error: string;
  loading: boolean;
  showPassword: boolean;
};

type LoginAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SHOW_PASSWORD'; payload: boolean };

export default function LoginPage() {
  const { push, refresh } = useRouter();

  const [state, dispatch] = useReducer(
    (state: LoginState, action: LoginAction): LoginState => {
      switch (action.type) {
        case 'SET_EMAIL':
          return { ...state, email: action.payload };
        case 'SET_PASSWORD':
          return { ...state, password: action.payload };
        case 'SET_ERROR':
          return { ...state, error: action.payload };
        case 'SET_LOADING':
          return { ...state, loading: action.payload };
        case 'SET_SHOW_PASSWORD':
          return { ...state, showPassword: action.payload };
        default:
          return state;
      }
    },
    {
      email: '',
      password: '',
      error: '',
      loading: false,
      showPassword: false,
    },
  );

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: '' });

    try {
      await authService.login({ email: state.email, password: state.password });
      push('/dashboard');
      refresh();
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Gagal login';
      dispatch({ type: 'SET_ERROR', payload: message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  return (
    <div className='login-canvas relative min-h-screen overflow-hidden text-foreground'>
      <div className='login-aura login-aura-one' />
      <div className='login-aura login-aura-two' />
      <div className='login-grid' />

      <header className='relative z-10 mx-auto flex w-[min(1180px,calc(100%-32px))] items-center justify-between py-6 md:w-[min(1180px,calc(100%-56px))]'>
        <div className='flex items-center gap-3'>
          <div className='grid size-11 place-items-center rounded-2xl border border-border bg-surface/80 shadow-[var(--shadow-soft)] backdrop-blur-xl'>
            <WarehouseIcon size={20} className='text-accent' />
          </div>
          <div>
            <div className='text-[11px] font-bold uppercase tracking-[0.28em] text-muted'>
              Warung Bu Dami Stock
            </div>
            <div className='font-[var(--font-display)] text-xl font-bold tracking-[-0.02em]'>
              Control Room
            </div>
          </div>
        </div>
        <div className='hidden rounded-full border border-border bg-surface/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-muted shadow-[var(--shadow-soft)] backdrop-blur-xl sm:block'>
          Secure Access
        </div>
      </header>

      <main className='relative z-10 mx-auto grid min-h-[calc(100vh-96px)] w-[min(1180px,calc(100%-32px))] items-center gap-10 pb-20 pt-6 md:w-[min(1180px,calc(100%-56px))] lg:grid-cols-[1.05fr_0.95fr]'>
        <section className='max-w-2xl'>
          <div className='mb-6 inline-flex rounded-full border border-border bg-surface/70 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-muted backdrop-blur-xl'>
            Inventory · Staff · Transactions
          </div>
          <h1 className='font-[var(--font-display)] text-[clamp(3.8rem,10vw,7.2rem)] font-bold leading-[0.82] tracking-[-0.07em]'>
            Stok rapi,
            <br />
            kerja tenang.
          </h1>
          <p className='mt-7 max-w-xl text-base leading-7 text-muted md:text-lg'>
            Portal operasional untuk memantau produk, transaksi, dan restock
            dengan tampilan yang mengikuti theme HeroUI aktif.
          </p>
          <div className='mt-8 grid max-w-lg grid-cols-3 overflow-hidden rounded-[1.75rem] border border-border bg-surface/65 text-center shadow-[var(--shadow-soft)] backdrop-blur-xl'>
            {['Produk', 'Stok', 'Kasir'].map((item) => (
              <div
                key={item}
                className='border-r border-border px-4 py-5 last:border-r-0'
              >
                <div className='text-[10px] font-bold uppercase tracking-[0.22em] text-muted'>
                  {item}
                </div>
                <div className='mt-2 font-[var(--font-display)] text-2xl font-bold text-accent'>
                  ✓
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='login-panel rounded-[2rem] p-6 md:p-9'>
          <div className='mb-8 flex items-start justify-between gap-4'>
            <div>
              <div className='text-[11px] font-bold uppercase tracking-[0.24em] text-muted'>
                Private Workspace
              </div>
              <h2 className='mt-3 font-[var(--font-display)] text-4xl font-bold leading-none tracking-[-0.04em] md:text-5xl'>
                Masuk Dashboard
              </h2>
            </div>
            <div className='grid size-12 shrink-0 place-items-center rounded-2xl bg-accent text-accent-foreground shadow-[var(--shadow-accent)]'>
              <LockKeyholeIcon size={20} />
            </div>
          </div>

          <form className='space-y-5' onSubmit={handleLogin}>
            <label className='block'>
              <span className='mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-muted'>
                Email
              </span>
              <input
                type='email'
                placeholder='nama@warungbudami.id'
                value={state.email}
                onChange={(e) =>
                  dispatch({ type: 'SET_EMAIL', payload: e.target.value })
                }
                className='login-input'
                autoComplete='email'
                required
              />
            </label>

            <label className='block'>
              <span className='mb-2 block text-[11px] font-bold uppercase tracking-[0.22em] text-muted'>
                Password
              </span>
              <div className='relative'>
                <input
                  type={state.showPassword ? 'text' : 'password'}
                  placeholder='Masukkan password'
                  value={state.password}
                  onChange={(e) =>
                    dispatch({ type: 'SET_PASSWORD', payload: e.target.value })
                  }
                  className='login-input pr-12'
                  autoComplete='current-password'
                  required
                />
                <button
                  type='button'
                  className='absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted transition hover:text-foreground'
                  onClick={() =>
                    dispatch({
                      type: 'SET_SHOW_PASSWORD',
                      payload: !state.showPassword,
                    })
                  }
                  aria-label={
                    state.showPassword
                      ? 'Sembunyikan password'
                      : 'Tampilkan password'
                  }
                >
                  {state.showPassword ? (
                    <EyeOffIcon size={18} />
                  ) : (
                    <EyeIcon size={18} />
                  )}
                </button>
              </div>
            </label>

            {state.error ? (
              <p className='rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm font-medium text-danger'>
                {state.error}
              </p>
            ) : null}

            <button
              className='login-submit group w-full'
              type='submit'
              disabled={state.loading}
            >
              <span>
                {state.loading ? 'Memproses...' : 'Masuk ke dashboard'}
              </span>
              <span className='transition group-hover:translate-x-1'>→</span>
            </button>
          </form>
        </section>
      </main>

      <div className='login-marquee absolute bottom-0 left-0 right-0 z-10 border-t border-border bg-surface/60 py-4 text-[11px] font-bold uppercase tracking-[0.35em] text-muted backdrop-blur-xl'>
        <span>
          STOCK CONTROL · RESTOCK SIGNAL · DAILY OPERATIONS · STOCK CONTROL ·
          RESTOCK SIGNAL · DAILY OPERATIONS ·{' '}
        </span>
      </div>
    </div>
  );
}
