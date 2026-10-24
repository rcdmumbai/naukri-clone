# Naukri Clone

A full-stack replica of [naukri.com](https://www.naukri.com) — job search, applications and employer
hiring — built with Next.js 14 (App Router), TypeScript, Tailwind CSS and Prisma/SQLite.

> Educational project. Not affiliated with Naukri.com or Info Edge (India) Ltd.

## Features

**Jobseekers**
- Register / login (JWT session in an httpOnly cookie)
- Homepage with hero search, popular categories, top companies and latest jobs
- Job search with keyword, location and experience search plus filters for work mode, department,
  salary band, employment type, company and freshness; sorting and pagination
- Job detail page with company info and similar jobs
- Apply with an optional message, save/unsave jobs
- Profile editor, application tracker and saved job list

**Employers**
- Register as an employer (company is created automatically)
- Dashboard with job/application counts
- Post jobs, open/close them, view applicants and move them through
  Applied → Shortlisted → Rejected → Hired

## Getting started

```bash
npm install
cp .env.example .env      # DATABASE_URL + JWT_SECRET
npx prisma migrate deploy
npm run db:seed
npm run dev               # http://localhost:3000
```

### Demo accounts

| Role      | Email                   | Password     |
| --------- | ----------------------- | ------------ |
| Jobseeker | jobseeker@example.com   | Password@123 |
| Employer  | employer@example.com    | Password@123 |

## Scripts

| Script              | Purpose                            |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the dev server               |
| `npm run build`     | Production build                   |
| `npm run lint`      | ESLint                             |
| `npm run typecheck` | TypeScript, no emit                |
| `npm run db:seed`   | Reseed companies, jobs and users   |
| `npm run db:reset`  | Drop, re-migrate and reseed the DB |

## Project structure

```
prisma/          schema, migrations, seed data
src/app/         routes (pages + /api route handlers)
src/components/  shared UI (header, job card, filters, forms)
src/lib/         prisma client, auth/session, search query builder, formatting
```

## Data model

`User` (jobseeker or employer) · `Company` · `Job` · `Application` · `SavedJob`. Jobs store locations
and skills as comma separated strings so SQLite can be used without extra join tables; swap the
Prisma datasource to PostgreSQL and switch these to arrays for a production deployment.
