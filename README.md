# AutomationHub SaaS

AutomationHub is a commercial SaaS foundation for subscription-based automation services. Customers buy managed automation products, complete setup from a dashboard, and deploy isolated Docker services without receiving source code or VPS access.

## Stack

- Next.js 15 + TypeScript + Tailwind CSS for the customer-facing web app
- NestJS + TypeScript for the API and deployment engine
- PostgreSQL + Prisma ORM for multi-tenant billing, service, and audit data
- Docker Engine for per-service runtime orchestration
- Paydisini and Pakasir payment gateway integration points

## Included products

- Bot Auto Order Telegram
- Bot Forward / Promosi Telegram
- Website Digital Product
- Website Physical Product
- Website Email OTP
- Bot Telegram OTP Email Domain

## Workspace layout

```text
apps/
  api/        NestJS API, billing flows, deployment engine
  web/        Next.js landing page, auth flows, dashboard UI
docs/
  architecture.md
prisma/
  schema.prisma
  seed.ts
docker/
  runtime/
```

## Quick start

```bash
npm install
copy .env.example .env
npm run prisma:push
npm run prisma:seed
npm run dev
```

Development services:

- Web app: `http://localhost:3000`
- API: `http://localhost:4000/api/v1`
- Swagger: `http://localhost:4000/docs`

## Included in this foundation

- Multi-tenant user, tenant, role, catalog, billing, subscription, service-instance, deployment, support, tutorial, and audit models
- JWT auth with email/password, email verification scaffolding, reset password flow, and Google OAuth hooks
- Product catalog and checkout endpoints
- Service dashboard and setup wizard UI
- Docker deployment engine for config generation, env generation, container creation, and deployment logging
- Admin overview and deployment monitoring endpoints
- Local Docker Compose stack for web, api, postgres, and MinIO-compatible storage

Detailed folder structure, database design, API design, Docker architecture, and deployment flow are documented in [docs/architecture.md](/C:/Users/Billion/Downloads/avabot/docs/architecture.md).
