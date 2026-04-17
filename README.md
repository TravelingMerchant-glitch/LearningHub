# LearningHub

A small web app to organize study notes with tagging and spaced-repetition reminders.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | [Next.js](https://nextjs.org/) (React, TypeScript) |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Database | [PostgreSQL](https://www.postgresql.org/) + [Prisma ORM](https://www.prisma.io/) |
| Auth | [NextAuth.js](https://next-auth.js.org/) (email provider — placeholder) |
| Deployment | [Vercel](https://vercel.com/) |

## Local Setup

### Prerequisites

- Node.js >= 18
- A running PostgreSQL instance (local or remote)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@localhost:5432/learninghub` |
| `NEXTAUTH_URL` | Your app URL, e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random secret string for NextAuth (generate with `openssl rand -base64 32`) |
| `NEXT_PUBLIC_VERCEL_URL` | (Optional) Set automatically by Vercel on deployment |

### 3. Run database migrations

```bash
npm run prisma:migrate
```

### 4. Seed the database with sample data

```bash
npm run prisma:seed
```

### 5. Start the development server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Jest tests |
| `npm run prisma:migrate` | Run Prisma migrations |
| `npm run prisma:seed` | Seed the database |

## Deployment (Vercel)

1. Push your code to GitHub.
2. Import the repository in [Vercel](https://vercel.com/new).
3. Add the required environment variables in the Vercel project settings:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (set to your Vercel deployment URL)
   - `NEXTAUTH_SECRET`
4. Vercel will automatically detect Next.js and deploy.

> **Note:** Ensure your PostgreSQL database is accessible from Vercel's servers (e.g., use a managed service like Supabase, Neon, or Railway).

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

[MIT](./LICENSE)
