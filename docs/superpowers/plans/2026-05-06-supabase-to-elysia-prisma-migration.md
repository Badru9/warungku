# Supabase to ElysiaJS + Prisma Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all Supabase usage in Next.js frontend with a service adapter layer that communicates to an existing ElysiaJS + Prisma backend via JWT-authenticated HTTP requests using axios and TanStack Query.

**Architecture:** Create a service layer with typed functions that wrap axios calls to the ElysiaJS backend. Use TanStack Query for data fetching and state management. Replace Supabase auth with JWT-based authentication stored in localStorage and cookies.

**Tech Stack:** Next.js, React, Axios, TanStack Query, TypeScript

---

### File Structure Overview

**New files to create:**

- `src/lib/api/client.ts` - Axios instance with interceptors
- `src/lib/api/auth.ts` - Token storage helpers
- `src/lib/query-client.ts` - TanStack Query client setup
- `src/services/auth.ts` - Auth service functions
- `src/services/products.ts` - Product service functions
- `src/services/categories.ts` - Category service functions
- `src/services/dashboard.ts` - Dashboard service functions
- `src/services/transactions.ts` - Transaction service functions
- `src/services/staff.ts` - Staff service functions
- `src/types/api.ts` - Shared API types

**Files to modify:**

- `src/app/layout.tsx` - Add QueryClientProvider
- `src/middleware.ts` - Replace with JWT-based auth guard
- `src/app/(auth)/login/page.tsx` - Use auth service
- `src/app/(dashboard)/layout.tsx` - Use auth service for profile
- All dashboard pages - Replace data fetching with service calls + TanStack Query

**Files to delete:**

- `src/lib/supabase/*` (3 files)
- `src/app/api/*` (all API routes)
- `supabase/` directory
- Remove Supabase dependencies from package.json

---

## Task 1: Setup Axios Client and Auth Helpers

**Files:**

- Create: `src/lib/api/client.ts`
- Create: `src/lib/api/auth.ts`

- [ ] **Step 1: Create axios client with request/response interceptors**

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10000,
});

// Request interceptor to inject auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to normalize errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Normalize error response
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    return Promise.reject({
      message,
      statusCode: error.response?.status,
      details: error.response?.data,
    });
  },
);

export default apiClient;
```

- [ ] **Step 2: Create auth helpers for token storage**

```typescript
export const AUTH_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const setAuthToken = (token: string) => {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  // Also set as cookie for middleware access (non-httpOnly)
  document.cookie = `${AUTH_TOKEN_KEY}=${token}; path=/; max-age=${60 * 60 * 24}`; // 24 hours
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  document.cookie = `${AUTH_TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
```

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint src/lib/api/ --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/api/client.ts src/lib/api/auth.ts
git commit -m "feat: setup axios client and auth helpers"
```

---

## Task 2: Setup TanStack Query Client

**Files:**

- Create: `src/lib/query-client.ts`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create QueryClient with default options**

```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

- [ ] **Step 2: Read existing layout.tsx to understand current structure**

Run: `cat src/app/layout.tsx`
Expected: Show current layout structure

- [ ] **Step 3: Modify layout.tsx to add QueryClientProvider**

```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
// ... other imports

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 4: Run lint to verify no syntax errors**

Run: `npx eslint src/app/layout.tsx --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/query-client.ts src/app/layout.tsx
git commit -m "feat: setup TanStack Query client and provider"
```

---

## Task 3: Install TanStack Query dependency

**Files:**

- Modify: `package.json`

- [ ] **Step 1: Install @tanstack/react-query**

Run: `npm install @tanstack/react-query`
Expected: Package installed successfully

- [ ] **Step 2: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install @tanstack/react-query"
```

---

## Task 4: Create Auth Service

**Files:**

- Create: `src/services/auth.ts`

- [ ] **Step 1: Create auth service with login, logout, getProfile**

```typescript
import apiClient from '@/lib/api/client';
import { setAuthToken, removeAuthToken, AUTH_TOKEN_KEY } from '@/lib/api/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
  profile: {
    id: string;
    full_name: string;
    role: string;
    is_active: boolean;
  };
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>(
      '/auth/login',
      payload,
    );
    setAuthToken(response.token);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      removeAuthToken();
    }
  },

  getProfile: async (): Promise<Profile> => {
    return apiClient.get('/auth/profile');
  },

  // For checking if token exists (synchronous)
  isLoggedIn: (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  },
};
```

- [ ] **Step 2: Run lint to verify no syntax errors**

Run: `npx eslint src/services/auth.ts --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/services/auth.ts
git commit -m "feat: create auth service"
```

---

## Task 5: Create Products, Categories, Dashboard Services

**Files:**

- Create: `src/services/products.ts`
- Create: `src/services/categories.ts`
- Create: `src/services/dashboard.ts`

- [ ] **Step 1: Create products service**

```typescript
import apiClient from '@/lib/api/client';

export interface Product {
  id: string;
  name: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  current_stock: number;
  min_stock: number;
  deleted_at?: string;
  created_by?: string;
  categories?: {
    name: string;
  };
}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  low_stock?: boolean;
}

export interface CreateProductPayload {
  name: string;
  sku?: string;
  barcode?: string;
  category_id?: string;
  unit: string;
  buy_price: number;
  sell_price: number;
  current_stock: number;
  min_stock: number;
}

export interface PriceHistory {
  id: string;
  product_id: string;
  old_buy_price: number;
  new_buy_price: number;
  old_sell_price: number;
  new_sell_price: number;
  changed_at: string;
  changed_by: string;
  profiles?: {
    full_name: string;
  };
}

export const productsService = {
  getProducts: async (filters?: ProductFilters): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.category_id) params.append('category_id', filters.category_id);
    if (filters?.low_stock) params.append('low_stock', 'true');

    const query = params.toString();
    return apiClient.get(`/products${query ? `?${query}` : ''}`);
  },

  getProductById: async (id: string): Promise<Product> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: async (payload: CreateProductPayload): Promise<Product> => {
    return apiClient.post('/products', payload);
  },

  updateProduct: async (
    id: string,
    payload: Partial<CreateProductPayload>,
  ): Promise<Product> => {
    return apiClient.patch(`/products/${id}`, payload);
  },

  deleteProduct: async (id: string): Promise<void> => {
    return apiClient.delete(`/products/${id}`);
  },

  getPriceHistory: async (id: string): Promise<PriceHistory[]> => {
    return apiClient.get(`/products/${id}/price-history`);
  },
};
```

- [ ] **Step 2: Create categories service**

```typescript
import apiClient from '@/lib/api/client';

export interface Category {
  id: string;
  name: string;
  created_at: string;
}

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    return apiClient.get('/categories');
  },

  createCategory: async (name: string): Promise<Category> => {
    return apiClient.post('/categories', { name });
  },
};
```

- [ ] **Step 3: Create dashboard service**

```typescript
import apiClient from '@/lib/api/client';

export interface DashboardSummary {
  totalProducts: number;
  lowStock: number;
  transactionsToday: number;
}

export interface ChartDataPoint {
  created_at: string;
  type: 'IN' | 'OUT';
  quantity: number;
}

export interface TransformedChartData {
  name: string;
  Masuk: number;
  Keluar: number;
}

export const dashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    return apiClient.get('/dashboard/summary');
  },

  getChartData: async (
    period: 'weekly' | 'monthly' = 'weekly',
  ): Promise<ChartDataPoint[]> => {
    return apiClient.get(`/dashboard/chart?period=${period}`);
  },
};
```

- [ ] **Step 4: Run lint to verify no syntax errors**

Run: `npx eslint src/services/products.ts src/services/categories.ts src/services/dashboard.ts --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/services/products.ts src/services/categories.ts src/services/dashboard.ts
git commit -m "feat: create products, categories, and dashboard services"
```

---

## Task 6: Create Transactions and Staff Services

**Files:**

- Create: `src/services/transactions.ts`
- Create: `src/services/staff.ts`

- [ ] **Step 1: Create transactions service**

```typescript
import apiClient from '@/lib/api/client';

export interface Transaction {
  id: string;
  product_id: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  stock_before: number;
  stock_after: number;
  price_at_time: number;
  note?: string;
  created_by: string;
  created_at: string;
  products?: {
    name: string;
    unit: string;
  };
  profiles?: {
    full_name: string;
  };
}

export interface CreateTransactionPayload {
  product_id: string;
  type: 'IN' | 'OUT' | 'ADJUST';
  quantity: number;
  note?: string;
}

export interface TransactionFilters {
  product_id?: string;
  type?: 'IN' | 'OUT' | 'ADJUST';
}

export const transactionsService = {
  getTransactions: async (
    filters?: TransactionFilters,
  ): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.product_id) params.append('product_id', filters.product_id);
    if (filters?.type) params.append('type', filters.type);

    const query = params.toString();
    return apiClient.get(`/transactions${query ? `?${query}` : ''}`);
  },

  createTransaction: async (
    payload: CreateTransactionPayload,
  ): Promise<Transaction> => {
    return apiClient.post('/transactions', payload);
  },
};
```

- [ ] **Step 2: Create staff service**

```typescript
import apiClient from '@/lib/api/client';

export interface Staff {
  id: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
}

export interface CreateStaffPayload {
  full_name: string;
  email: string;
  password: string;
}

export const staffService = {
  getStaff: async (): Promise<Staff[]> => {
    return apiClient.get('/staff');
  },

  createStaff: async (payload: CreateStaffPayload): Promise<Staff> => {
    return apiClient.post('/staff', payload);
  },
};
```

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint src/services/transactions.ts src/services/staff.ts --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/services/transactions.ts src/services/staff.ts
git commit -m "feat: create transactions and staff services"
```

---

## Task 7: Update Middleware with JWT Auth

**Files:**

- Modify: `src/middleware.ts`

- [ ] **Step 1: Read existing middleware.ts**

Run: `cat src/middleware.ts`
Expected: Show current Supabase-based middleware

- [ ] **Step 2: Replace with JWT-based middleware**

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value;
  const { pathname } = request.nextUrl;

  const isAuthRoute = pathname.startsWith('/login');
  const isProtectedRoute =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/products') ||
    pathname.startsWith('/transactions') ||
    pathname.startsWith('/staff');

  // No token and trying to access protected route -> redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Has token and trying to access login -> redirect to dashboard
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Staff route owner-only check: decode JWT to get role (simple base64 decode)
  if (token && pathname.startsWith('/staff')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.role !== 'owner') {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    } catch {
      // Invalid token, redirect to login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/products/:path*',
    '/transactions/:path*',
    '/staff/:path*',
    '/login',
  ],
};
```

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint src/middleware.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts
git commit -m "feat: update middleware with JWT auth"
```

---

## Task 8: Update Login Page

**Files:**

- Modify: `src/app/(auth)/login/page.tsx`

- [ ] **Step 1: Read existing login page**

Run: `cat src/app/\(auth\)/login/page.tsx`
Expected: Show current login implementation

- [ ] **Step 2: Replace with auth service login**

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({ email, password });
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... existing JSX structure (keep UI unchanged)
    <form onSubmit={handleSubmit}>
      {/* ... existing form fields */}
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}
```

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint "src/app/(auth)/login/page.tsx" --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add "src/app/(auth)/login/page.tsx"
git commit -m "feat: update login page with auth service"
```

---

## Task 9: Update Dashboard Layout with Profile Fetch

**Files:**

- Modify: `src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: Read existing dashboard layout**

Run: `cat "src/app/(dashboard)/layout.tsx"`
Expected: Show current layout with Supabase profile fetch

- [ ] **Step 2: Replace with auth service profile fetch**

```typescript
import { redirect } from 'next/navigation';
import { authService } from '@/services/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if token exists via cookie (client-side check first)
  const token = document?.cookie?.includes('access_token');

  if (!token) {
    redirect('/login');
  }

  // Verify token and get profile
  try {
    const profile = await authService.getProfile();
    // Pass profile to children via context or return it
    return (
      <div>
        {/* Keep existing layout structure, just use new auth */}
        {children}
      </div>
    );
  } catch {
    redirect('/login');
  }
}
```

**Note:** The layout is a Server Component. For proper JWT handling in Next.js App Router, the middleware handles the token check. The layout can just render the children. If profile data is needed, fetch it client-side or pass via a context provider.

Alternative (recommended - keep layout simple):

```typescript
import { redirect } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware already handles auth check
  // Just render children - profile data fetched in individual pages via useQuery
  return (
    <div>
      {/* Keep existing layout structure */}
      {children}
    </div>
  );
}
```

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint "src/app/(dashboard)/layout.tsx" --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add "src/app/(dashboard)/layout.tsx"
git commit -m "refactor: simplify dashboard layout (middleware handles auth)"
```

---

## Task 10: Update Dashboard Page with TanStack Query

**Files:**

- Modify: `src/app/(dashboard)/dashboard/page.tsx`

- [ ] **Step 1: Read existing dashboard page**

Run: `cat "src/app/(dashboard)/dashboard/page.tsx"`
Expected: Show current dashboard with API fetches

- [ ] **Step 2: Replace with useQuery hooks**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard';
import { productsService } from '@/services/products';

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
  });

  const { data: lowStockProducts, isLoading: lowStockLoading } = useQuery({
    queryKey: ['products', 'low-stock'],
    queryFn: () => productsService.getProducts({ low_stock: true }),
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard', 'chart', 'weekly'],
    queryFn: () => dashboardService.getChartData('weekly'),
  });

  if (summaryLoading || lowStockLoading || chartLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Keep existing UI, use summary?.totalProducts, etc. */}
      <div>Total Products: {summary?.totalProducts}</div>
      <div>Low Stock: {summary?.lowStock}</div>
      <div>Transactions Today: {summary?.transactionsToday}</div>
      {/* ... rest of UI */}
    </div>
  );
}
```

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint "src/app/(dashboard)/dashboard/page.tsx" --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add "src/app/(dashboard)/dashboard/page.tsx"
git commit -m "feat: update dashboard page with TanStack Query"
```

---

## Task 11: Update Products Pages

**Files:**

- Modify: `src/app/(dashboard)/products/page.tsx`
- Modify: `src/app/(dashboard)/products/[id]/page.tsx`
- Modify: `src/app/(dashboard)/products/new/page.tsx`
- Modify: `src/app/(dashboard)/products/[id]/edit/page.tsx`

- [ ] **Step 1: Update products list page**

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || undefined;
  const categoryId = searchParams.get('category_id') || undefined;

  const { data: products, isLoading } = useQuery({
    queryKey: ['products', { search, categoryId }],
    queryFn: () => productsService.getProducts({ search, category_id: categoryId }),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {/* Keep existing UI, use products data */}
    </div>
  );
}
```

- [ ] **Step 2: Update products detail, new, edit pages similarly**

Use same pattern: replace fetch calls with `useQuery`/`useMutation` from TanStack Query.

- [ ] **Step 3: Run lint to verify no syntax errors**

Run: `npx eslint "src/app/(dashboard)/products/" --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add "src/app/(dashboard)/products/"
git commit -m "feat: update products pages with TanStack Query"
```

---

## Task 12: Update Transactions Pages

**Files:**

- Modify: `src/app/(dashboard)/transactions/page.tsx`
- Modify: `src/app/(dashboard)/transactions/new/page.tsx`

- [ ] **Step 1: Update transactions list and new pages**

Replace fetch calls with `useQuery`/`useMutation` using `transactionsService`.

- [ ] **Step 2: Run lint to verify no syntax errors**

Run: `npx eslint "src/app/(dashboard)/transactions/" --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add "src/app/(dashboard)/transactions/"
git commit -m "feat: update transactions pages with TanStack Query"
```

---

## Task 13: Update Staff Pages

**Files:**

- Modify: `src/app/(dashboard)/staff/page.tsx`
- Modify: `src/app/(dashboard)/staff/new/page.tsx`

- [ ] **Step 1: Update staff list and new pages**

Replace fetch calls with `useQuery`/`useMutation` using `staffService`.

- [ ] **Step 2: Run lint to verify no syntax errors**

Run: `npx eslint "src/app/(dashboard)/staff/" --ext .ts,.tsx`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add "src/app/(dashboard)/staff/"
git commit -m "feat: update staff pages with TanStack Query"
```

---

## Task 14: Delete Supabase Files and Cleanup

**Files:**

- Delete: `src/lib/supabase/*`
- Delete: `src/app/api/*`
- Delete: `supabase/`
- Modify: `package.json`

- [ ] **Step 1: Delete Supabase lib files**

```bash
rm -rf src/lib/supabase
```

- [ ] **Step 2: Delete API routes**

```bash
rm -rf src/app/api
```

- [ ] **Step 3: Delete supabase directory**

```bash
rm -rf supabase
```

- [ ] **Step 4: Remove Supabase dependencies from package.json**

Remove from dependencies:

- `@supabase/ssr`
- `@supabase/supabase-js`

- [ ] **Step 5: Clean up .env.local**

Remove Supabase-related env vars:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove Supabase code and dependencies"
```

---

## Task 15: Build and Verify

**Files:**

- Run: Build verification

- [ ] **Step 1: Run type check**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 2: Run build**

Run: `npm run build`
Expected: Build successful

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: verify build passes"
```
