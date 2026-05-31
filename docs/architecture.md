# AutomationHub Architecture

## Folder structure

```text
apps/
  api/
    src/
      common/
      modules/
      prisma/
  web/
    app/
    components/
    lib/
docs/
prisma/
docker/
  runtime/
```

## Database design

Core entities:

- `roles`: global platform roles such as `USER`, `ADMIN`, `OWNER`
- `users`: auth identities, profile, email verification, password reset, default tenant
- `tenants`: logical customer workspaces for multi-tenant isolation
- `tenant_members`: user access within a tenant
- `products`: sellable automation services
- `packages`: duration-based pricing for each product
- `orders`: pending or paid checkout records
- `payments`: gateway transactions for Paydisini or Pakasir
- `subscriptions`: active billing windows and lifecycle state
- `services`: customer-owned deployable service instances
- `deployments`: every deployment or redeployment attempt
- `deployment_logs`: step-level logs from the Docker engine
- `support_tickets` and `support_messages`: customer support workflow
- `announcements`: broadcast content for users, admins, or owners
- `tutorials`: setup guides and video-linked documentation
- `activity_logs`: audit trail across the platform

## API design

Public and authenticated routes live under `/api/v1`.

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`
- `POST /auth/verify-email`
- `GET /auth/google`
- `GET /auth/google/callback`
- `GET /products`
- `GET /products/:slug`
- `POST /billing/checkout`
- `GET /billing/invoices`
- `POST /billing/webhooks/paydisini`
- `POST /billing/webhooks/pakasir`
- `GET /dashboard/summary`
- `GET /services`
- `GET /services/:id`
- `PATCH /services/:id/config`
- `POST /services/:id/deploy`
- `POST /services/:id/suspend`
- `POST /services/:id/restart`
- `GET /admin/overview`
- `GET /admin/deployments`
- `POST /admin/products`
- `PATCH /admin/products/:id`

## Docker architecture

Local development runs four core containers:

- `web`: Next.js application
- `api`: NestJS API and deployment engine
- `postgres`: primary relational database
- `minio`: S3-compatible object storage for optional media uploads

Customer services are not deployed through Pterodactyl. The API talks directly to Docker Engine and creates one container per service instance using product-specific runtime templates.

## Deployment architecture

Deployment lifecycle:

1. User buys a package.
2. Payment webhook marks the order paid.
3. Subscription is activated or extended.
4. A service instance is created in `DRAFT` state if one does not already exist.
5. User fills the setup wizard and clicks deploy.
6. API generates service config JSON and `.env`.
7. API pulls the runtime image.
8. API creates or recreates the Docker container on the host.
9. API stores metadata and writes deployment logs.
10. Service status changes to `RUNNING`, `ERROR`, `SUSPENDED`, or `EXPIRED`.

Automatic lifecycle jobs:

- Suspend expired subscriptions
- Stop containers for suspended services
- Resume eligible services after renewal
- Retain deployment logs for audits
