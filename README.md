# Aide Moi Backend

A modern Node.js backend API built with Fastify framework and TypeORM for database management.

## Features

- 🚀 **Fast & Lightweight**: Built with Fastify for high performance
- 🗄️ **Database Integration**: TypeORM with support for PostgreSQL, MySQL, and SQLite
- 📚 **API Documentation**: Auto-generated Swagger/OpenAPI docs
- 🔒 **Security**: Helmet for security headers, CORS, and rate limiting
- 🧪 **Testing**: Jest testing framework with database integration
- 📝 **Code Quality**: ESLint and Prettier for consistent code style
- 🔄 **Hot Reload**: Nodemon for development
- 🐳 **Docker Ready**: Includes Dockerfile for containerization
- 📊 **Health Checks**: Built-in health monitoring endpoints
- 🎯 **Environment Config**: Dotenv for environment management
- 🔄 **Database Migrations**: TypeORM migration support

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Database (PostgreSQL, MySQL, or SQLite for development)

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

4. Configure your database in `.env` file:
```bash
# For SQLite (default - good for development)
DB_TYPE=sqlite
DB_SQLITE_PATH=./database.sqlite

# For PostgreSQL
# DB_TYPE=postgres
# DB_HOST=localhost
# DB_PORT=5432
# DB_USERNAME=postgres
# DB_PASSWORD=password
# DB_DATABASE=aide_moi_db

# For MySQL
# DB_TYPE=mysql
# DB_HOST=localhost
# DB_PORT=3306
# DB_USERNAME=root
# DB_PASSWORD=password
# DB_DATABASE=aide_moi_db
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

## Database Configuration

### Supported Databases

- **SQLite** (default for development)
- **PostgreSQL** (recommended for production)
- **MySQL/MariaDB**

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment (development/production) | development |
| `PORT` | Server port | 3000 |
| `HOST` | Server host | 0.0.0.0 |
| `DB_TYPE` | Database type (sqlite/postgres/mysql) | sqlite |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_USERNAME` | Database username | - |
| `DB_PASSWORD` | Database password | - |
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
