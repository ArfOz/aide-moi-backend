# Aide Moi Backend Template

A modern Node.js backend API template built with Fastify framework and TypeORM with PostgreSQL database.

> **Note**: This is a reference template repository. The actual backend will be created as part of a frontend project using NX monorepo architecture for better type safety and code sharing.

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
- 🔗 **Monorepo Ready**: Template designed for integration with frontend projects
- 🎯 **Type Safety**: Shared TypeScript types for full-stack type safety

## Architecture Philosophy

This template demonstrates backend API patterns that will be integrated into a frontend project using **NX monorepo** or similar monorepo architecture. The actual implementation will provide:

- **Shared Types**: Common TypeScript interfaces and types shared between frontend and backend
- **Type Safety**: End-to-end type checking from API to UI
- **Code Reuse**: Shared utilities, validators, and constants
- **Consistent Development**: Unified tooling and configuration across the stack
- **Single Repository**: Easier version control and deployment

## Recommended Integration Structure

When integrating this backend into your frontend project:

```
your-frontend-project/
├── apps/
│   ├── frontend/          # Your existing frontend app
│   └── backend/           # New backend app (based on this template)
├── libs/
│   └── shared/
│       ├── types/         # Shared TypeScript interfaces
│       ├── utils/         # Shared utilities
│       └── constants/     # Shared constants
├── tools/
├── workspace.json
└── package.json
```

## Template Usage

### For Reference and Learning
This repository serves as a reference for:
- API design patterns
- Fastify configuration
- TypeORM setup
- Authentication implementation
- Error handling patterns
- Testing strategies

### For New Backend Creation
Use this template as a foundation when creating your backend within your frontend project structure.

## Quick Start (For Template Testing)

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
| `JWT_SECRET` | JWT secret key | your-secret-key |
| `JWT_EXPIRES_IN` | JWT expiration time | 24h |
| `REFRESH_TOKEN_EXPIRES_IN` | Refresh token expiration | 7d |

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:3000/docs`
- Health Check: `http://localhost:3000/health`
- API Root: `http://localhost:3000/api/v1`

## Template Structure

```
src/
├── app.js              # Fastify app configuration
├── server.js           # Server entry point
├── config/             # Configuration files
│   └── database.js     # TypeORM configuration
├── entities/           # TypeORM entities
│   └── User.js         # User entity definition
├── services/           # Business logic services
│   ├── UserService.js  # User service with database operations
│   ├── JwtService.js   # JWT token management
│   └── PasswordService.js # Password hashing utilities
├── middleware/         # Custom middleware
│   └── auth.js         # Authentication middleware
├── plugins/            # Fastify plugins
│   ├── cors.js
│   ├── database.js     # Database connection plugin
│   ├── helmet.js
│   ├── rateLimit.js
│   └── swagger.js
└── routes/             # Route handlers
    ├── api.js
    ├── health.js
    ├── auth.js         # Authentication routes
    └── users.js        # User CRUD operations with TypeORM
tests/                  # Test files
├── health.test.js
└── users.test.js
ormconfig.js           # TypeORM CLI configuration
```

## API Endpoints Reference

### Health Checks
- `GET /health` - Basic health check
- `GET /health/detailed` - Detailed health information

### Authentication API
- `POST /api/auth/register` - User registration with JWT tokens
- `POST /api/auth/login` - User login with JWT tokens
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get current user profile (protected)
- `POST /api/auth/logout` - User logout

### Users API (with TypeORM)
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `POST /api/v1/users` - Create new user
- `PUT /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

All API responses follow a consistent format with `success` field for better frontend integration.

## Shared Types Example

When integrating with your frontend project, you can create shared types like:

```typescript
// libs/shared/types/auth.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  tokens: {
    token: string;
    refreshToken: string;
    expiresIn: string;
    expiresAt: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
    roles: string[];
  };
}
```

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

## Integration Guidelines

When creating your backend within your frontend project:

1. **Copy relevant files** from this template
2. **Adapt file paths** to your project structure
3. **Update package.json** with shared dependencies
4. **Create shared types** in a common library
5. **Configure build scripts** for monorepo structure
6. **Set up development workflow** with concurrent frontend/backend development

## Contributing

This template is designed to be a reference and starting point. When you create your actual backend implementation:

1. Fork or reference this template
2. Adapt the code to your specific needs
3. Integrate with your frontend project structure
4. Share improvements back to this template if applicable

## License

This project is licensed under the MIT License - see the LICENSE file for details.
