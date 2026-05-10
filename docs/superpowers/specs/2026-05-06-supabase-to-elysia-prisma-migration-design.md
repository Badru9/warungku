# Supabase to ElysiaJS + Prisma Migration Design

**Date:** 2026-05-06
**Status:** Approved

## Overview

Replace all Supabase usage in Next.js frontend with a service adapter layer that communicates to an existing ElysiaJS + Prisma backend via JWT-authenticated HTTP requests using axios and TanStack Query.

---

## Section 1 — Architecture

Use **service adapter layer**.

**Structure:**
- `src/lib/api/client.ts` → shared axios instance (via `axios.create`)
- `src/lib/api/auth.ts` → token storage + login/logout helpers
- `src/services/products.ts`
- `src/services/categories.ts`
- `src/services/dashboard.ts`
- `src/services/transactions.ts`
- `src/services/staff.ts`
- `src/types/api.ts` or per-service types

**Flow:**
1. Login page calls `POST ${NEXT_PUBLIC_API_URL}/auth/login`.
2. Backend returns JWT + user/profile data.
3. Frontend stores JWT.
4. Every service call sends: `Authorization: Bearer <token>`
5. Pages call service functions, not `/api/*` routes.
6. Delete:
   - `src/lib/supabase/*`
   - `src/app/api/*`
   - `supabase/`
   - Supabase env vars
   - `@supabase/ssr`
   - `@supabase/supabase-js`
7. Replace middleware Supabase auth with JWT-based route guard.

**Main rule:**
- Pages do not use raw `fetch`.
- Pages call services only.
- Services own endpoint paths, query params, error handling, and response typing.

---

## Section 2 — Request Layer (axios)

Use single shared axios client:

- `src/lib/api/client.ts`
  - `axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL, timeout })`
  - Request interceptor injects header: `Authorization: Bearer <token>`
  - Response interceptor normalizes error to shape: `{ message, statusCode, details? }`

**Service pattern:**
- `src/services/*.ts` uses this client.
- Each service exposes typed functions: `getProducts(params)`, `createProduct(payload)`, etc.
- All endpoint paths stay in service, not in page/component.

**Page/component rule:**
- **No direct axios/fetch call** in `src/app/**`.
- UI only calls service function + handles loading/error state.

---

## Section 3 — Data Fetching (TanStack Query)

Use `@tanstack/react-query`.

**Why:**
- Eliminates manual loading/error state boilerplate in each page.
- Built-in cache, dedup, background refetch.
- Mutations (`useMutation`) handle POST/PUT/DELETE + invalidate cache automatically.
- Fits pattern: service fetcher → `useQuery`.

**Structure:**
- `src/lib/query-client.ts` → `QueryClient` config (staleTime, retry, etc.).
- `src/app/layout.tsx` → wrap with `<QueryClientProvider>`.
- `src/services/*.ts` → export:
  - **Query keys**: `queryKeys.products.all`, `queryKeys.products.detail(id)`
  - **Query functions**: `() => apiClient.get('/products')` — pure fetcher.
- Page/component uses:
  - `useQuery({ queryKey, queryFn })` → data, isLoading, error.
  - `useMutation({ mutationFn, onSuccess })` → mutate, invalidate cache.

**Service shape example:**

```
products.ts:
  - queryKeys
  - getProducts(params) → axios call
  - getProductById(id)
  - createProduct(payload)
  - updateProduct(id, payload)
  - deleteProduct(id)
```

**Benefits page-level:**
- No `useState` for data/loading/error.
- No `useEffect` manual fetch.
- Auto cache across pages.

---

## Section 4 — Auth & Middleware

**JWT flow:**

1. **Login**
   - Page calls `POST ${NEXT_PUBLIC_API_URL}/auth/login` with `{ email, password }`.
   - Backend returns `{ token, user, profile }`.
   - Store token:
     - `localStorage` → for axios interceptor.
     - `document.cookie` → for middleware read (non-httpOnly, client-accessible).
   - Redirect `/dashboard`.

2. **Middleware route guard**
   - Read token from cookie.
   - If no token → redirect `/login`.
   - If token exists → allow (actual verify done by backend per request).
   - If `/login` + token exists → redirect `/dashboard`.
   - Role check (`/staff` owner-only): decode JWT payload (base64) to get `role`, or fetch profile via service.

3. **Dashboard layout**
   - Call `getProfile()` service → backend verify JWT, return profile.
   - If 401 → redirect `/login`.
   - If role check needed → in page, not layout.

4. **Logout**
   - Clear localStorage + cookie.
   - Call `POST ${NEXT_PUBLIC_API_URL}/auth/logout` (optional, backend might blacklist token).
   - Redirect `/login`.

5. **Delete:**
   - `src/lib/supabase/*` → remove.
   - `src/app/api/auth/*` → remove.
   - Supabase cookies logic in middleware → replace with JWT cookie check.

---

## Section 5 — Service Definitions & Page Migration Map

**Services to create:**

| Service | Methods | Backend Endpoints |
|---|---|---|
| `src/services/auth.ts` | `login`, `logout`, `getProfile` | `/auth/login`, `/auth/logout`, `/auth/profile` |
| `src/services/products.ts` | `getProducts`, `getProductById`, `createProduct`, `updateProduct`, `deleteProduct`, `getPriceHistory` | `/products`, `/products/:id`, `/products/:id/price-history` |
| `src/services/categories.ts` | `getCategories`, `createCategory` | `/categories` |
| `src/services/dashboard.ts` | `getSummary`, `getChartData` | `/dashboard/summary`, `/dashboard/chart` |
| `src/services/transactions.ts` | `getTransactions`, `createTransaction` | `/transactions` |
| `src/services/staff.ts` | `getStaff`, `createStaff` | `/staff` |

**Types per service** (in same file or `src/types/api.ts`):
- Request payloads
- Response shapes
- Match existing frontend expectations (no UI changes needed)

**Page migration** (remove `/api/*` calls, use services):

| Page | Changes |
|---|---|
| `(auth)/login/page.tsx` | Use `authService.login()` + store token |
| `(dashboard)/layout.tsx` | Use `authService.getProfile()` for auth check |
| `(dashboard)/dashboard/page.tsx` | `useQuery` → `dashboardService.getSummary()`, `productsService.getProducts()`, `dashboardService.getChartData()` |
| `(dashboard)/products/page.tsx` | `useQuery` → `productsService.getProducts()` |
| `products/[id]/page.tsx` | `useQuery` → `productsService.getProductById()`, `getPriceHistory()` |
| `products/new/page.tsx` | `useQuery` → `categoriesService.getCategories()`, `useMutation` → `productsService.createProduct()` |
| `products/[id]/edit/page.tsx` | Query + mutation |
| `transactions/page.tsx` | `useQuery` → `transactionsService.getTransactions()` |
| `transactions/new/page.tsx` | `useQuery` → `productsService.getProducts()`, `useMutation` → `transactionsService.createTransaction()` |
| `staff/page.tsx` | `useQuery` → `staffService.getStaff()` |
| `staff/new/page.tsx` | `useMutation` → `staffService.createStaff()` |

**Files to delete:**
- `src/lib/supabase/*` (3 files)
- `src/app/api/*` (all routes)
- `src/middleware.ts` (rewrite JWT version)
- `supabase/` directory
- Remove from `package.json`: `@supabase/ssr`, `@supabase/supabase-js`

---

## Existing Data Shapes (To Preserve)

### Products
```ts
{
  id, name, sku, barcode,
  category_id, unit,
  buy_price, sell_price,
  current_stock, min_stock,
  deleted_at, created_by,
  categories: { name }
}
```

### Categories
```ts
{ id, name, created_at }
```

### Dashboard Summary
```ts
{ totalProducts: number, lowStock: number, transactionsToday: number }
```

### Transactions
```ts
{
  id, created_at, type, quantity,
  stock_before, stock_after, note,
  products: { name, unit },
  profiles: { full_name }
}
```

### Staff
```ts
{ id, full_name, role, is_active, created_at }
```

### Price History
```ts
{
  id, changed_at,
  old_buy_price, new_buy_price,
  old_sell_price, new_sell_price,
  profiles: { full_name }
}
```
