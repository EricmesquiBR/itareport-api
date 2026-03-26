# Itareport API

REST API backend for [Itareport](../itareport) — a community-driven platform for reporting urban issues in the city of Itapaje.

## Tech Stack

- [Node.js](https://nodejs.org/) with [Express](https://expressjs.com/)
- [Prisma](https://www.prisma.io/) ORM
- [PostgreSQL](https://www.postgresql.org/)
- JavaScript

## Prerequisites

- [Node.js](https://nodejs.org/) >= 16
- [npm](https://www.npmjs.com/)
- [PostgreSQL](https://www.postgresql.org/) database running locally or remotely

## Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-org>/itareport-api.git
   cd itareport-api
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your database credentials:

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   DATABASE_URL=postgres://user:password@localhost:5432/itareport?schema=public
   ```

4. **Run database migrations**

   ```bash
   npx prisma migrate dev
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The API will be available at [http://localhost:3030](http://localhost:3030).

## API Endpoints

### Users

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/users`        | List all users       |
| GET    | `/user/:id`     | Get user by ID       |
| POST   | `/user`         | Create a new user    |
| PUT    | `/user/:id`     | Update a user        |
| DELETE | `/user/:id`     | Delete a user        |

### Reports (Denuncias)

| Method | Endpoint        | Description          |
| ------ | --------------- | -------------------- |
| GET    | `/reports`      | List all reports     |
| GET    | `/report/:id`   | Get report by ID     |
| POST   | `/report`       | Create a new report  |
| PUT    | `/report/:id`   | Update a report      |
| DELETE | `/report/:id`   | Delete a report      |

### Categories

| Method | Endpoint          | Description            |
| ------ | ----------------- | ---------------------- |
| GET    | `/category`       | List all categories    |
| GET    | `/category/:id`   | Get category by ID     |
| POST   | `/category/:id`   | Create a new category  |

## Database Schema

The API uses three main models managed by Prisma:

- **Usuario** — User accounts (email, name, CPF, password)
- **Denuncia** — Reports with geolocation, category, and content
- **Categoria** — Report categories

See [`prisma/schema.prisma`](prisma/schema.prisma) for the full schema definition.

## Project Structure

```
src/
  api/            # Route definitions
  config/         # Server configuration
  controllers/    # Request handlers
  db/             # Database client setup
  middleware/     # Express middleware
  models/         # Data models
  services/       # Business logic
  server.js       # App entry point
prisma/
  schema.prisma   # Database schema
  migrations/     # Migration history
```

## Related

- [itareport](../itareport) — Frontend application for this project

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
