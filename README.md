# 6ix QR Forms

Production-quality MVP for dynamic QR form creation, QR sharing, public submissions, and private response management.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- `qrcode`
- `zod`

## Core Flow

Create Form -> Generate Link -> Generate QR Code -> Scan QR -> Fill Form -> Submit Response -> View Responses.

QR codes contain only the public form URL, for example `/f/customer-feedback-ab12cd34`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` from `.env.example` and set:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

3. Apply the database schema:

```bash
npm run prisma:migrate
```

4. Start the app:

```bash
npm run dev
```

## Scripts

- `npm test` runs validation tests.
- `npm run build` runs a production Next.js build.
- `npm run prisma:generate` regenerates Prisma Client.
- `npm run prisma:migrate` applies local database migrations.

## MVP Notes

- Public forms live at `/f/[slug]`.
- Private manage pages live at `/manage/[manageToken]`.
- `manageToken` is a simple MVP access method, not authentication.
- Form fields and responses are stored as JSON for fast iteration.
- Role-based access, payments, teams, uploads, and drag-and-drop are intentionally out of scope.
