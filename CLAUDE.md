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

## Architecture

### Multi-Tenancy Model
- **Critical**: All entities use `id_empresa` for tenant isolation
- Every request includes `x-empresa-id` header (added by axios interceptor)
- User authentication returns `id_empresa` which is stored in localStorage
- The backend filters queries by `id_empresa` to ensure data isolation

### Backend Structure

**Module Organization**: Each business domain has its own module (galpones, tipos-huevo, canastas, inventario, etc.)

**Key Modules**:
- `auth`: JWT authentication with Passport Local strategy
- `users`: User management with company (empresa) association
- `database`: TypeORM configuration with PostgreSQL (synchronize: false)
- `galpones`: Chicken coop management
- `tipos-huevo`: Egg type definitions
- `canastas`: Basket management
- `inventario`: Main inventory system with three controllers:
  - `inventario-stock.controller`: Stock management
  - `ajustes-inventario.controller`: Inventory adjustments (with lote support)
  - `resumen.controller`: Summary reports (integrated with terceros)
- `entradas-produccion`: Production entries (eggs produced)
- `salidas`: Inventory exits/sales
- `finanzas`: Financial module (gastos/ingresos/rendimiento)
- `terceros`: Third-party vendor/client management with master data (ciudad, estrato, tipo-regimen, etc.)
- `compras-terceros`: Purchase tracking from third parties
- `ventas-terceros`: Sales tracking to third parties
- `inventario-terceros`: Separate inventory for third-party products
- `notifications`: Notification system

**Entity Registration**: All entities MUST be registered in `backend/src/database/database.module.ts` in the entities array, otherwise TypeORM won't recognize them and endpoints will return 404.

**Port Management**: Backend runs on port 3012. The `prestart:dev` script automatically kills any process on this port using `src/scripts/kill-port.js`.

### Frontend Structure

**Framework**: Quasar (Vue 3) with TypeScript, Pinia for state management, Vue Router (hash mode)

**Key Directories**:
- `src/pages`: Page components (one per route)
- `src/stores`: Pinia stores (auth, inventario, terceros, compras-terceros, ventas-terceros, etc.)
- `src/config`: API configuration with environment detection
- `src/boot`: Boot files (axios, pinia, i18n)
- `src/layouts`: MainLayout and AuthLayout
- `src/components`: Reusable components
- `src/utils`: Utility functions including localStorage helpers

**API Configuration**: `src/config/api.ts` auto-detects environment:
- Capacitor (mobile): Uses production URL (2.58.80.90:3012)
- Development: localhost:3012
- Production web: 2.58.80.90:3012

**Axios Interceptors** (`src/boot/axios.ts`):
- Adds `Authorization: Bearer <token>` header
- Adds `x-empresa-id` header from localStorage
- Adds `id_usuario_inserta` for POST requests
- Adds `id_usuario_actualiza` for PUT/PATCH requests
- Handles 401 errors by redirecting to login

### Authentication Flow

1. User logs in via `/auth/login` with email/password
2. Backend validates credentials and returns JWT + user data (including `id_empresa`)
3. Frontend stores token, id_usuario, and id_empresa in localStorage
4. Frontend sets `Authorization` header and forces page reload to clear state
5. On app init, authStore.initializeAuth() calls `/auth/profile` to restore user session
6. JWT payload includes: `{ email, sub (user id), rol, id_empresa }`

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

### Inventory System

**Three-layer inventory tracking**:
1. **Production Inventory**: Eggs produced in-house (managed via entradas-produccion/salidas)
2. **Third-party Inventory**: Products bought from vendors (inventario-terceros)
3. **Adjustments**: Manual corrections (ajuste-inventario with ajuste-lote grouping)

**Resumen Controller**: Provides consolidated inventory view combining all three sources, filterable by `id_empresa`.

### Terceros (Third-Party) Module

Comprehensive vendor/client management with:
- Master data controllers: `maestros.controller.ts` serves catalogues (ciudad, estrato, tipo-regimen, tipo-ident, tipo-impuesto)
- CRUD operations for terceros with full audit trail
- Integration with compras-terceros and ventas-terceros
- Decorators for empresa isolation (`@EmpresaId()` in guards)

## Important Patterns

### Adding New Entities
1. Create entity in appropriate module's `entities/` folder
2. Register in `backend/src/database/database.module.ts` entities array
3. Create DTOs in module's `dto/` folder
4. Implement service and controller
5. Add to module's imports/providers/controllers
6. Restart backend to apply schema changes

### Adding New Routes
1. Backend: Add endpoint in controller with appropriate guards
2. Frontend: Add route in `src/router/routes.ts`
3. Create page component in `src/pages/`
4. Create Pinia store if state management needed
5. Add navigation link in `src/layouts/MainLayout.vue`

### Multi-Company Queries
Always filter by `id_empresa`:
```typescript
// Backend
await repository.find({ where: { id_empresa } });

// Frontend (automatic via interceptor)
// Just ensure localStorage has correct id_empresa
```

## CORS Configuration

Backend allows origins from:
- localhost:3011 (frontend dev)
- 2.58.80.90:3011, 2.58.80.90:3012 (production)
- capacitor://localhost, capacitor:// (mobile apps)
- null origin (for mobile native requests)

Required headers: Content-Type, Authorization, Accept, Cache-Control, x-empresa-id

## Environment Variables

### Backend (.env)
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

### Frontend (.env)
```
VITE_DEV_PORT=3011
VITE_API_URL_DEV=http://localhost:3012
VITE_API_URL_PROD=http://2.58.80.90:3012
VITE_API_TIMEOUT=15000
VITE_APP_NAME=Galpones
VITE_APP_VERSION=1.0.0
```

## Deployment Notes

- Backend uses TypeScript with `synchronize: false` (manual migrations required)
- Frontend builds to `dist/spa` directory
- See `DEPLOYMENT_INSTRUCTIONS.md` for detailed deployment steps
- Mobile builds require Capacitor sync after frontend build

## Common Gotchas

1. **404 on new endpoints**: Verify entity is registered in database.module.ts
2. **Data not filtering by company**: Ensure id_empresa is passed and used in queries
3. **Mobile CORS issues**: Check backend CORS allows capacitor:// origin
4. **Session persistence issues**: Verify localStorage contains token, id_usuario, id_empresa
5. **Port conflicts**: prestart:dev kills port 3012, but verify manually if needed
