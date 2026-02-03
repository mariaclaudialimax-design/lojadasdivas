# Loja das Divas - Admin System Documentation

## Overview

This document describes the complete admin system implementation for Loja das Divas e-commerce platform. The system is built in 5 phases, providing a comprehensive management interface for products, categories, pages, orders, inventory, and coupons.

## System Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend**: Netlify Functions (Serverless)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth + JWT tokens
- **State Management**: React Context API

### Security Measures
- **JWT Token Authentication**: All admin operations require valid JWT tokens
- **Role-based Access Control**: Admin role verification at database level
- **Row-Level Security (RLS)**: Database-level policies enforce data access
- **Service Role Key Isolation**: Separate key for server-side operations
- **Session Storage**: Tokens stored in sessionStorage (session-scoped)

## FASE 1: Authentication & Foundation ✅

### Components Created
- **`contexts/AuthContext.tsx`**: Centralized auth state management
- **`pages/AdminLogin.tsx`**: Login UI with email/password form
- **`pages/AdminDashboard.tsx`**: Main admin interface with sidebar navigation
- **`components/PrivateRoute.tsx`**: Route protection wrapper

### Features
- ✅ Login with Supabase Auth
- ✅ JWT token management
- ✅ Session-scoped storage
- ✅ Admin role verification
- ✅ Auto-logout on invalid token
- ✅ Beautiful dark-themed UI

### Flow
1. User enters email/password in AdminLogin
2. AuthContext calls `/.netlify/functions/auth-login`
3. Backend validates credentials and checks admin_users table
4. JWT token returned and stored in sessionStorage
5. PrivateRoute wraps authenticated pages
6. useAuth hook provides token for all API requests

### Testing
```bash
# Login with test admin user
Email: admin@example.com
Password: (set in Supabase Auth)

# Create admin user in Supabase
INSERT INTO admin_users (id, email, role) 
VALUES (uuid_generate_v4(), 'admin@example.com', 'admin');
```

---

## FASE 2: Admin CRUD Functions ✅

### Netlify Functions Created

#### 1. **Products Management**
- `/.netlify/functions/products-list` (GET, POST)
  - GET: Fetch all products (public)
  - POST: Create product (admin only)
  
- `/.netlify/functions/products-detail` (GET, PUT, DELETE)
  - GET: Fetch single product (public)
  - PUT: Update product (admin only)
  - DELETE: Delete product (admin only)

#### 2. **Categories Management**
- `/.netlify/functions/categories` (GET, POST)
  - GET: Fetch active categories (public)
  - POST: Create category (admin only)

#### 3. **Pages Management**
- `/.netlify/functions/pages` (GET, POST)
  - GET: Fetch published pages (public)
  - POST: Create page (admin only)

#### 4. **Home Sections**
- `/.netlify/functions/home-sections` (GET, PUT)
  - GET: Fetch active sections (public)
  - PUT: Update section (admin only)

#### 5. **Orders Read-Only**
- `/.netlify/functions/orders` (GET)
  - GET: Fetch orders with filtering and pagination (admin only)

### API Hook
- **`hooks/useAdminAPI.ts`**: Centralized API client with all CRUD methods
  - Automatic token injection from sessionStorage
  - Error handling and loading states
  - Type-safe method signatures

### Response Format
```typescript
{
  "data": [...],      // Created/Updated resource
  "error": "message", // Error message if failed
  "total": 100,       // For paginated responses
  "limit": 50,        // Pagination limit
  "offset": 0         // Pagination offset
}
```

---

## FASE 3: Admin UI Components ✅

### Reusable Components

#### **AdminTable**
```tsx
<AdminTable<T>
  columns={TableColumn<T>[]}
  data={T[]}
  loading={boolean}
  onRowClick={(row: T) => void}
  sortColumn={keyof T}
  sortOrder={'asc' | 'desc'}
  onSort={(column: keyof T) => void}
/>
```
Features:
- Column-based rendering
- Sorting support
- Loading state
- Empty state message
- Responsive design

#### **AdminForm**
```tsx
<AdminForm
  title="Form Title"
  fields={FormField[]}
  initialData={Record<string, any>}
  onSubmit={(data: Record<string, any>) => Promise<void>}
  onCancel={() => void}
  submitLabel="Save"
  loading={boolean}
  error={string | null}
/>
```
Features:
- Multiple field types (text, textarea, number, email, select, checkbox, image)
- Form validation
- Loading state
- Error display
- Modal overlay
- Image preview

### Admin Pages Created

#### **AdminProductsPage**
- List all products with search and filters
- Add new products
- Edit existing products
- Delete products
- Display: title, price, stock, active status

#### **AdminCategoriesPage**
- List all categories
- Add new categories
- Edit existing categories
- Display: name, slug, position, active status

#### **AdminPagesPage**
- List all pages
- Add new pages
- Edit existing pages
- Support meta tags for SEO
- Display: title, slug, published status

---

## FASE 4: Orders Read-Only Interface ✅

### AdminOrdersPage Features
- **List Orders**: Display all orders in paginated table
- **Filter by Status**: pending, paid, shipped, refunded, canceled
- **Order Details**: Click row to view full order details
  - Customer info (name, email, phone)
  - Order items with quantities
  - Total price and payment status
  - Tracking code (if available)
  - Special notes
- **Export CSV**: Download orders as CSV file
- **Status Badges**: Color-coded status indicators

### Data Structure
```typescript
interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  totalPrice: number;
  status: 'pending' | 'paid' | 'shipped' | 'refunded' | 'canceled';
  items: OrderItem[];
  trackingCode?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

---

## FASE 5: Inventory & Coupons System ✅

### Inventory Management

#### **AdminInventoryPage**
- **Log Creation**: Record stock adjustments with reasons
- **Reasons**: addition, removal, damaged, lost, return, adjustment
- **History**: View all inventory changes with timestamps
- **Admin Tracking**: Record who made each adjustment
- **Automatic Calculation**: Shows current product quantities

#### **Inventory Function** (`/.netlify/functions/inventory`)
- GET: Fetch inventory logs (with optional product filter)
- POST: Create new inventory log
- Features:
  - Reason-based tracking
  - Admin email recording
  - Timestamped entries
  - Product association

### Coupons Management

#### **AdminCouponsPage**
- **Create Coupons**: 
  - Percentage or fixed amount discounts
  - Maximum usage limits
  - Expiration dates
- **Edit Coupons**: Update discount details and status
- **Delete Coupons**: Remove expired/unused coupons
- **Filter**: View all, active, or expired coupons
- **Tracking**: See usage count vs. limit

#### **Coupons Function** (`/.netlify/functions/coupons`)
- GET: Fetch coupons with optional filtering
- POST: Create new coupon
- PUT: Update existing coupon
- DELETE: Remove coupon
- Features:
  - Code validation (auto-uppercase)
  - Usage tracking
  - Expiration date handling
  - Active/inactive toggle

### Data Structures
```typescript
interface InventoryLog {
  id: string;
  product_id: string;
  quantity_change: number;
  reason: string;
  admin_email: string;
  created_at: string;
}

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  max_uses?: number;
  used_count?: number;
  expires_at?: string;
  active: boolean;
  created_at: string;
}
```

---

## Complete Admin Dashboard Navigation

```
Admin Dashboard
├── Dashboard (Stats & Overview)
├── Produtos (FASE 3)
│   ├── List
│   ├── Create
│   ├── Edit
│   └── Delete
├── Categorias (FASE 3)
│   ├── List
│   └── Create
├── Home (CMS) - Future Enhancement
├── Páginas (FASE 3)
│   ├── List
│   ├── Create
│   └── Edit
├── Pedidos (FASE 4)
│   ├── List with Filters
│   ├── View Details
│   └── Export CSV
├── Inventário (FASE 5)
│   ├── Log Adjustments
│   └── View History
├── Cupons (FASE 5)
│   ├── List
│   ├── Create
│   ├── Edit
│   └── Delete
└── Configurações - Future Enhancement
```

---

## Deployment & Environment

### Environment Variables (Required)
```
REACT_APP_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Set in Netlify Dashboard
1. Go to Netlify project settings
2. Build & deploy → Environment
3. Add the variables above
4. Redeploy

### Local Development
```bash
# Install dependencies
npm install

# Start dev server
netlify dev

# This runs:
# - Frontend on localhost:3000
# - Functions on localhost:8888
```

---

## Database Schema

### Key Tables
```sql
-- Authentication
admin_users (id, email, role, created_at)

-- Content
categories (id, name, slug, order_position, active)
pages (id, slug, title, content, is_published)
products (id, title, handle, price, stock, active)
home_sections (id, title, subtitle, image_url, content, active)

-- Orders & Operations
orders (id, customer_name, email, phone, total_price, status)
coupons (id, code, discount_type, discount_value, max_uses, expires_at, active)
inventory_logs (id, product_id, quantity_change, reason, admin_email)

-- Audit
server_events (id, event_type, data, created_at)
```

### RLS Policies
- **Public Tables**: Anyone can read active/published content
- **Admin Operations**: Only authenticated admins can modify
- **Service Role**: Bypasses RLS for server-side operations

---

## API Authentication

### Request Headers
```typescript
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Token Lifecycle
1. User logs in → receives JWT token
2. Token stored in sessionStorage
3. Every API request includes Authorization header
4. Backend validates token with Supabase
5. Checks admin_users table for role
6. 401: Invalid/expired token → redirect to login
7. 403: Valid token but not admin → access denied

---

## Error Handling

### Frontend
```typescript
const { fetchProducts, error, loading } = useAdminAPI();

// useAdminAPI automatically sets:
// - loading: true during requests
// - error: error message if failed
// - Returns empty array on error (graceful degradation)
```

### Backend
```typescript
// Standard error responses
{
  statusCode: 401,
  body: JSON.stringify({ error: 'Unauthorized' })
}

// Validation errors
{
  statusCode: 400,
  body: JSON.stringify({ error: 'Missing required fields' })
}
```

---

## Best Practices Implemented

✅ **Security**
- JWT token authentication
- Role-based access control
- RLS at database level
- Service role key separation
- Session-scoped storage

✅ **Performance**
- Lazy loading of admin pages
- Pagination for large datasets
- CSV export for analytics
- Efficient database queries

✅ **UX**
- Consistent dark-themed interface
- Sidebar navigation
- Modal forms
- Loading states
- Error messages
- Confirmation dialogs

✅ **Code Quality**
- TypeScript for type safety
- Reusable components
- Centralized API client
- Separation of concerns
- Proper error handling

---

## Testing Checklist

### FASE 1: Authentication
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Token stored in sessionStorage
- [ ] Auto-logout on page refresh with invalid token
- [ ] PrivateRoute redirects unauthenticated users

### FASE 2: CRUD Operations
- [ ] Create product/category/page
- [ ] Read all items
- [ ] Update existing item
- [ ] Delete item
- [ ] Error handling for invalid data

### FASE 3: UI Components
- [ ] Tables sort and paginate correctly
- [ ] Forms validate required fields
- [ ] Image preview works
- [ ] Modal opens/closes properly

### FASE 4: Orders
- [ ] Orders list displays correctly
- [ ] Filtering by status works
- [ ] Order details modal shows all info
- [ ] CSV export includes all data

### FASE 5: Inventory & Coupons
- [ ] Inventory logs record correctly
- [ ] Coupon creation with all fields
- [ ] Coupon filtering works
- [ ] Usage tracking displays correctly

---

## Future Enhancements

🔄 **FASE 6: Advanced Features**
- Home page sections editor (WYSIWYG)
- Analytics dashboard
- User activity logs
- Bulk product import/export
- Email notifications
- Multi-language support

---

## Support & Documentation

For detailed API documentation, see:
- [`supabase_schema.sql`](supabase_schema.sql) - Complete database schema
- [`ADMIN_IMPLEMENTATION_PLAN.md`](ADMIN_IMPLEMENTATION_PLAN.md) - Original implementation plan
- Individual component files for JSDoc comments

---

## Deployment Status

✅ **GitHub**: All code synced and committed
✅ **Netlify**: Auto-deployment on git push
✅ **Supabase**: Database schema applied
✅ **Environment**: Variables configured in Netlify dashboard

**Live URL**: [lojafinal.netlify.app](https://lojafinal.netlify.app)
**Admin Panel**: [lojafinal.netlify.app/admin](https://lojafinal.netlify.app/admin)
