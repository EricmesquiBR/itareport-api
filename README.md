# Itareport API

REST API backend for [Itareport](../itareport) — a community-driven platform for reporting urban issues in the city of Itapaje.

## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/) (v24+)
- **Framework**: [Hono](https://hono.dev/) with [@hono/node-server](https://github.com/honojs/node-server)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **Validation**: [Zod](https://zod.dev/)
- **Logging**: [Pino](https://getpino.io/)
- **Build Tool**: [tsdown](https://github.com/egoist/tsdown)
- **Formatting & Linting**: [oxlint](https://oxc-project.github.io/docs/guide/usage/linter/oxlint.html) & [oxfmt](https://oxc-project.github.io/docs/guide/usage/formatter/oxfmt.html)

## Prerequisites

- [Node.js](https://nodejs.org/) >= 24 (Recommended to use [mise](https://mise.jdx.dev/) or [nvm](https://github.com/nvm-sh/nvm) for versioning)
- [pnpm](https://pnpm.io/) (Recommended to use mise)
- [PostgreSQL](https://www.postgresql.org/) & [Redis](https://redis.io/) (via [Docker](https://www.docker.com/))
- [GitHub CLI](https://cli.github.com/) (recommended)

## Getting Started

1. **Clone the repository**

   ```bash
   # Using GitHub CLI (recommended)
   gh repo clone EricmesquiBR/itareport-api

   # Or using Git
   git clone https://github.com/EricmesquiBR/itareport-api.git

   cd itareport-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your database credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   HOST=0.0.0.0
   PORT=3000
   POSTGRES_HOST=localhost
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=itareport
   POSTGRES_PORT=5432
   ```

4. **Start the database (via Docker)**

   The project uses Docker Compose to run PostgreSQL and Redis:

   ```bash
   docker compose -f infra/compose.yaml up -d
   ```

5. **Database Setup**

   Generate and push the schema to the database:

   ```bash
   pnpm run db:generate
   pnpm run db:migrate
   ```

6. **Start the development server**

   ```bash
   pnpm run dev
   ```

   The API will be available at [http://localhost:3000/v1](http://localhost:3000/v1).

## Available Scripts

- `pnpm run dev`: Start the development server with `tsx watch`.
- `pnpm run build`: Build the project using `tsdown`.
- `pnpm run start`: Run the built project.
- `pnpm run type-check`: Run TypeScript type checking.
- `pnpm run db:generate`: Generate Drizzle migrations.
- `pnpm run db:migrate`: Run Drizzle migrations.
- `pnpm run db:push`: Push the schema changes directly to the database.
- `pnpm run db:studio`: Open Drizzle Studio to explore the database.
- `pnpm run lint`: Run `oxlint` for linting.
- `pnpm run fmt`: Run `oxfmt` for formatting.

## Project Structure

```text
src/
├── db/             # Drizzle configuration and schema
├── features/       # Feature-based capsules
│   ├── categories/ # Category routes, service, and schema
│   ├── reports/    # Report routes, service, and schema
│   └── users/      # User routes, service, and schema
├── lib/            # Shared libraries (logger, etc.)
├── utils/          # Utility functions
├── env.ts          # Environment variable validation (Zod)
└── server.ts       # Application entry point and middleware
```

## API Reference (v1)

### Users

| Method | Endpoint          | Description                    |
| ------ | ----------------- | ------------------------------ |
| POST   | `/v1/users`       | Create a new user              |
| POST   | `/v1/users/login` | User login (returns user data) |
| GET    | `/v1/users/:id`   | Get user by ID                 |
| PUT    | `/v1/users/:id`   | Update a user                  |
| DELETE | `/v1/users/:id`   | Delete a user                  |

### Reports

| Method | Endpoint          | Description         |
| ------ | ----------------- | ------------------- |
| GET    | `/v1/reports`     | List all reports    |
| GET    | `/v1/reports/:id` | Get report by ID    |
| POST   | `/v1/reports`     | Create a new report |
| PUT    | `/v1/reports/:id` | Update a report     |
| DELETE | `/v1/reports/:id` | Delete a report     |

### Categories

| Method | Endpoint                     | Description              |
| ------ | ---------------------------- | ------------------------ |
| GET    | `/v1/categories`             | List all categories      |
| POST   | `/v1/categories`             | Create a new category    |
| GET    | `/v1/categories/:id/reports` | List reports by category |

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE).
