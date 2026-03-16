# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a full-stack poultry farm management system ("Galpones Avícola") built with:
- **Backend**: NestJS with TypeORM, PostgreSQL
- **Frontend**: Vue 3 + Quasar Framework
- **Mobile**: Capacitor (Android/iOS support)

The application manages egg production, inventory, sales, purchases, and financial tracking for poultry farms. It supports multi-company operations through the `id_empresa` field.

## Development Commands

### Backend (NestJS)
```bash
cd backend
npm install

# Development (kills port 3012 first, then starts with nodemon)
npm run start:dev

# Debug mode
npm run start:debug

# Build
npm run build

# Production
npm run start
```

### Frontend (Quasar)
```bash
cd frontend
npm install

# Development (default port: 3011, configurable via VITE_DEV_PORT)
npm run dev

# Build for production
npm run build

# Lint
npm run lint

# Format
npm run format
```

### Mobile Build (Capacitor)
```bash
cd frontend
npm run build
npx cap sync android
npx cap open android
```

See `MOBILE_BUILD.md` for detailed mobile compilation instructions.

**No tests are configured** — both `backend` and `frontend` package.json have placeholder test scripts that exit immediately.

## Architecture

### Multi-Tenancy Model
- **Critical**: All entities use `id_empresa` for tenant isolation
- The backend extracts `id_empresa` from the **JWT token payload** (primary) or query param `id_empresa` (fallback) via `EmpresaMiddleware`
- The frontend axios interceptor adds the `x-empresa-id` header from localStorage, but the backend authoritative source is the JWT payload
- All queries must filter by `id_empresa`

### Backend Structure

**Module Organization**: Each business domain has its own NestJS module. All modules are registered in `backend/src/app.module.ts`.

**Key Modules**:
- `auth`: JWT authentication with Passport Local strategy; `JwtAuthGuard` protects endpoints; `EmpresaMiddleware` extracts `id_empresa` from JWT
- `users`: User management with company (empresa) association
- `database`: TypeORM configuration (`synchronize: false`); **all entities must be registered here** or TypeORM won't find them
- `galpones`: Chicken coop management (includes `DetalleGalpon` sub-entity)
- `tipos-huevo`: Egg type definitions
- `canastas`: Basket management
- `inventario`: Main inventory system with three controllers:
  - `inventario-stock.controller`: Stock management
  - `ajustes-inventario.controller`: Inventory adjustments (with lote grouping via `AjusteLote`)
  - `resumen.controller`: Consolidated inventory view combining all three inventory sources
- `entradas-produccion`: Production entries (eggs produced)
- `salidas`: Inventory exits/sales
- `finanzas`: Financial module (gastos/ingresos/rendimiento/categorias-gasto)
- `terceros`: Vendor/client management; `maestros.controller.ts` serves catalogues (ciudad, estrato, tipo-regimen, tipo-ident, tipo-impuesto)
- `compras-terceros`: Purchase tracking (header `Compra` + line items `DetalleCompra`)
- `ventas-terceros`: Sales tracking (header `Venta` + line items `DetalleVenta`)
- `notifications`: Notification system

> **Note**: `InventarioTerceros` entity exists and is registered in `database.module.ts`, but there is **no dedicated module** for it in `app.module.ts`. Its CRUD is handled within `compras-terceros` and `ventas-terceros`.

**Global NestJS config** (set in `main.ts`):
- Timezone: `America/Bogota`
- `ValidationPipe` with `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true` — DTOs must use class-validator decorators; extra fields are stripped and unknown fields throw
- Global exception filter logs full request details on errors

**No database migrations folder** — `synchronize: false`, so schema changes must be applied manually via SQL.

**`@nestjs/swagger` is installed** but not configured in `main.ts` (no Swagger UI exposed).

### Frontend Structure

**Framework**: Quasar (Vue 3) with TypeScript, Pinia for state management, Vue Router (hash mode)

**Key Directories**:
- `src/pages`: Page components (one per route)
- `src/stores`: Pinia stores per domain (auth, inventario, galpones, terceros, compras-terceros, ventas-terceros, salidas, ajustesInventario, tutorial, historialFinanciero, etc.)
- `src/config`: API configuration with environment detection
- `src/boot`: Boot files (axios, pinia, i18n)
- `src/layouts`: `MainLayout.vue` (authenticated) and `AuthLayout.vue` (login/register)

**API Configuration** (`src/config/api.ts`) auto-detects environment:
- Capacitor (mobile): production URL (`2.58.80.90:3012`)
- Development: `localhost:3012`
- Production web: `2.58.80.90:3012`

**Axios Interceptors** (`src/boot/axios.ts`):
- Adds `Authorization: Bearer <token>` header
- Adds `x-empresa-id` header from localStorage
- Adds `id_usuario_inserta` for POST requests
- Adds `id_usuario_actualiza` for PUT/PATCH requests
- Handles 401 errors by redirecting to login

**Chart.js** is used for financial/inventory visualizations.

### Authentication Flow

1. User logs in via `POST /auth/login` with email/password
2. Backend validates credentials and returns JWT + user data (including `id_empresa`)
3. Frontend stores token, id_usuario, and id_empresa in localStorage
4. Frontend sets `Authorization` header and forces page reload to clear state
5. On app init, `authStore.initializeAuth()` calls `GET /auth/profile` to restore session
6. JWT payload: `{ email, sub (user id), rol, id_empresa }`

### Database Entity Pattern

All entities follow a consistent pattern with audit fields:
```typescript
@Column({ type: 'uuid', nullable: true })
id_usuario_inserta: string;

@CreateDateColumn()
fecha_inserta: Date;

@Column({ type: 'uuid', nullable: true })
id_usuario_actualiza: string;

@UpdateDateColumn()
fecha_actualiza: Date;

@Column({ type: 'int' })
id_empresa: number;
```

> Exception: `InventarioTerceros` uses camelCase column naming (`idEmpresa`, `createdAt`/`updatedAt`) instead of snake_case — inconsistent with the rest of the codebase.

### Inventory System

**Three-layer inventory tracking**:
1. **Production Inventory**: Eggs produced in-house (managed via `entradas-produccion` / `salidas`)
2. **Third-party Inventory**: Products bought from vendors (`inventario-terceros` table)
3. **Adjustments**: Manual corrections (`ajuste-inventario` with `ajuste-lote` grouping)

**Resumen Controller**: Combines all three sources into a single consolidated view, filterable by `id_empresa`.

### Terceros (Third-Party) Module

- Master data served by `maestros.controller.ts`: ciudad, estrato, tipo-regimen, tipo-ident, tipo-impuesto
- Full CRUD for terceros with audit trail
- `id_empresa` isolation enforced via `EmpresaMiddleware`

## Important Patterns

### Adding New Entities
1. Create entity in appropriate module's `entities/` folder
2. **Register in `backend/src/database/database.module.ts` entities array** (required — omitting causes 404)
3. Create DTOs in module's `dto/` folder (class-validator decorators required due to global ValidationPipe)
4. Implement service and controller
5. Add to module's `imports` (TypeOrmModule.forFeature), `providers`, and `controllers`
6. Restart backend to apply schema changes

### Adding New Routes
1. Backend: Add endpoint in controller with `@UseGuards(JwtAuthGuard)`
2. Frontend: Add route in `src/router/routes.ts` under the `MainLayout` parent
3. Create page component in `src/pages/`
4. Create Pinia store if state management needed
5. Add navigation link in `src/layouts/MainLayout.vue`

### Multi-Company Queries
Always filter by `id_empresa`:
```typescript
// Backend — extract from JWT via middleware
await repository.find({ where: { id_empresa } });

// Frontend — automatic via axios interceptor
```

## CORS Configuration

Allowed origins (configured in `main.ts`):
- `http://localhost:3011`, `http://localhost`
- `http://2.58.80.90:3011`, `http://2.58.80.90:3012`, `http://2.58.80.90`
- `capacitor://localhost`, `capacitor://`
- `null` / no-origin (mobile native requests)
- `https://bolt.new`

Required headers: `Content-Type`, `Authorization`, `Accept`, `Cache-Control`, `x-empresa-id`

## Environment Variables

### Backend (`backend/.env`)
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=galpones_db
PORT=3012
NODE_ENV=development
JWT_SECRET=<your-secret>
```

### Frontend (`frontend/.env`)
```
VITE_DEV_PORT=3011
VITE_API_URL_DEV=http://localhost:3012
VITE_API_URL_PROD=http://2.58.80.90:3012
VITE_API_TIMEOUT=15000
VITE_APP_NAME=Galpones
VITE_APP_VERSION=1.0.0
```

## Deployment Notes

- Backend uses TypeScript with `synchronize: false` (manual schema changes required)
- Frontend builds to `dist/spa` directory
- See `DEPLOYMENT_INSTRUCTIONS.md` for detailed deployment steps
- Mobile builds require Capacitor sync after frontend build

## Common Gotchas

1. **404 on new endpoints**: Entity not registered in `database.module.ts` entities array
2. **Data not filtering by company**: Missing `id_empresa` in repository query `where` clause
3. **DTO validation errors**: `ValidationPipe` has `forbidNonWhitelisted: true` — all fields must be declared in the DTO with class-validator decorators
4. **Mobile CORS issues**: Check backend CORS allows `capacitor://` origin
5. **Session persistence issues**: Verify localStorage contains `token`, `id_usuario`, `id_empresa`
6. **Port conflicts**: `prestart:dev` kills port 3012 automatically, but verify manually if needed
7. **Date/time issues**: Server timezone is fixed to `America/Bogota` in `main.ts`
