# Aide Moi Backend

A modern Node.js backend API built with Fastify framework and TypeORM with PostgreSQL database.

## Features

- 🚀 **Fast & Lightweight**: Built with Fastify for high performance
- 🗄️ **PostgreSQL Database**: TypeORM with PostgreSQL (SQLite and MySQL also supported)
- 📚 **API Documentation**: Auto-generated Swagger/OpenAPI docs
- 🔒 **Security**: Helmet for security headers, CORS, and rate limiting
- 🧪 **Testing**: Jest testing framework with database integration
- 📝 **Code Quality**: ESLint and Prettier for consistent code style
- 🔄 **Hot Reload**: Nodemon for development
- 🐳 **Docker Ready**: Includes Docker Compose with PostgreSQL
- 📊 **Health Checks**: Built-in health monitoring endpoints
- 🎯 **Environment Config**: Dotenv for environment management
- 🔄 **Database Migrations**: TypeORM migration support

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Docker and Docker Compose (for database)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aide-moi-backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Start PostgreSQL database:
```bash
npm run db:start
```

5. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000` and automatically create the database tables.

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run migration:generate <name>` - Generate new migration
- `npm run migration:run` - Run pending migrations
- `npm run migration:revert` - Revert last migration
- `npm run db:start` - Start PostgreSQL database (Docker)
- `npm run db:stop` - Stop PostgreSQL database
- `npm run db:logs` - View database logs

## Database Configuration

### PostgreSQL (Default)

The template is configured to use PostgreSQL by default. You can start a PostgreSQL instance using Docker:

```bash
# Start PostgreSQL database
npm run db:start

# View database logs
npm run db:logs

# Stop database when done
npm run db:stop
```

### Supported Databases

- **PostgreSQL** (default and recommended)
- **SQLite** (for simple development)
- **MySQL/MariaDB**

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `HOST` | Server host | 0.0.0.0 |
| `DB_TYPE` | Database type (postgres/sqlite/mysql) | postgres |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | postgres |
| `DB_PASSWORD` | Database password | password |
| `DB_DATABASE` | Database name | aide_moi_db |
| `DB_SQLITE_PATH` | SQLite file path | ./database.sqlite |
| `DB_SYNCHRONIZE` | Auto-sync database schema | true |
| `DB_LOGGING` | Enable query logging | true |

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/health`
- API Root: `http://localhost:3000/api/v1`

## Project Structure

```
src/
├── app.js              # Fastify app configuration
├── server.js           # Server entry point
├── config/             # Configuration files
│   └── database.js     # TypeORM configuration
├── entities/           # TypeORM entities
│   └── User.js         # User entity definition
├── services/           # Business logic services
│   └── UserService.js  # User service with database operations
├── plugins/            # Fastify plugins
│   ├── cors.js
│   ├── database.js     # Database connection plugin
│   ├── helmet.js
│   ├── rateLimit.js
│   └── swagger.js
└── routes/             # Route handlers
    ├── api.js
    ├── health.js
    └── users.js        # User CRUD operations with TypeORM
tests/                  # Test files
├── health.test.js
└── users.test.js
ormconfig.js           # TypeORM CLI configuration
```

## API Endpoints

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information

### Users API (with TypeORM)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

All user operations are persisted to the database using TypeORM.

## Database Management

### Initial Setup
The database tables are automatically created when you start the application (when `DB_SYNCHRONIZE=true`).

### Migrations
For production deployments, use migrations instead of auto-synchronization:

1. Set `DB_SYNCHRONIZE=false` in production
2. Generate migrations: `npm run migration:generate AddUserTable`
3. Run migrations: `npm run migration:run`

## Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

The tests use an in-memory SQLite database for fast execution.

## Docker

Build and run with Docker:
```bash
docker build -t aide-moi-backend .
docker run -p 3000:3000 aide-moi-backend
```

For production with PostgreSQL:
```bash
docker-compose up
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
