# Fastify API with Redis Caching and Rate Limiting

This is a high-performance REST API built using Fastify, PostgreSQL, Prisma, Redis for caching, and Rate Limiting for security.

## Features
- **Fastify Framework**: Lightweight and high-performance Node.js framework.
- **PostgreSQL & Prisma**: Database management with an ORM.
- **JWT Authentication**: Secure authentication system.
- **Redis Caching**: Improve API performance by caching user data.
- **Rate Limiting**: Prevent abuse by limiting requests per user.

## Installation
### Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (>=16)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [WSL (For Windows)](https://learn.microsoft.com/en-us/windows/wsl/install)

### Clone the Repository
```sh
git clone https://github.com/your-username/fastify-api.git
cd fastify-api
```

### Install Dependencies
```sh
npm install
```

### Configure Environment Variables
Create a `.env` file in the root directory and set the required values:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/fastify_db"
JWT_SECRET="your_secret_key"
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=60000
```

## Database Setup
Run the following Prisma commands to initialize the database:
```sh
npx prisma migrate dev --name init
npx prisma generate
```

## Running the API Server
Start the Fastify server:
```sh
npm start
```

Or in development mode with auto-reload:
```sh
npm run dev
```

## API Endpoints

### Authentication
| Method | Endpoint      | Description        |
|--------|-------------|--------------------|
| POST   | `/register` | Register a new user |
| POST   | `/login`    | User login         |

### User Management
| Method | Endpoint   | Description  |
|--------|-----------|--------------|
| GET    | `/users`  | Get all users (cached with Redis) |
| GET    | `/users/:id` | Get user by ID (cached with Redis) |
| POST   | `/users`  | Create a new user |

## Redis Caching
The API caches user data in Redis to reduce database queries.
- **Users List (`/users`)**: Cached for 1 minute.
- **Single User (`/users/:id`)**: Cached for 1 minute.
- Cache is **automatically cleared** when a user is created or updated.

## Rate Limiting
To prevent API abuse, rate limiting is applied:
- **Max Requests:** 100 requests per minute.
- If exceeded, a `429 Too Many Requests` response is returned.

## Testing
Run the tests using:
```sh
npm test
```

## Deployment
To deploy this API, ensure Redis and PostgreSQL are properly configured in your production environment.

## License
This project is licensed under the MIT License.

## Author
[Your Name](https://github.com/your-username)

