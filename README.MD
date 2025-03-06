# NodeJs Starter Pack

## RestAPI using Fastify with PostgreSQL, Prisma, JWT Authentication, and Redis Caching

## Project Overview
This project is a Fastify-based REST API with the following features:
- User authentication with JWT
- PostgreSQL database using Prisma ORM
- Redis caching for optimized performance
- API rate limiting for security

## Installation & Setup
### 1. Clone the repository
```sh
git clone https://github.com/dedyfuadi/fastify-api.git
cd fastify-api
```

### 2. Install dependencies
```sh
npm install
```

### 3. Setup environment variables
Create a `.env` file and configure it with your database and Redis settings:
```env
DATABASE_URL="postgresql://user:password@localhost:5433/fastify_db"
```

### 4. Run database migrations
On development :
```sh
npx prisma migrate dev
```

On production (if any tables and data already stored) :
```sh
npx prisma migrate deploy
```

### 5. Start Redis server (if not running)
```sh
redis-server
```

### 6. Start the API server
```sh
npm run dev
```

## API Endpoints
### Authentication
#### Register a new user
```http
POST /register
```
Request body:
```json
{
  "success":true,
  "message":"User registered"
}
```

#### Login
```http
POST /login
```
Request body:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```
Response:
```json
{
  "success": true,
  "token": "jwt_token_here"
}
```

### User Management
#### Get all users (cached with Redis)
```http
GET /users
Authorization: Bearer <token>
```
**Redis Caching**: If users exist in Redis, the cached data is returned. If not, data is fetched from the database and cached for 60 seconds.

#### Get a user by ID (cached with Redis)
```http
GET /users/:id
Authorization: Bearer <token>
```
**Redis Caching**: If the user exists in Redis, cached data is returned; otherwise, data is fetched from the database and cached for 60 seconds.

#### Update a user
```http
PUT /users/:id
Authorization: Bearer <token>
```
Request body:
```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "Maimunah Baru",
    "email": "maimunahbaru@example.com",
    "password": "your_pwd_bcrypt_here",
    "createdAt": "2025-03-06T04:12:10.971Z"
  }
}
```
**Cache Handling**: The specific user's cache (`user:{id}`) is deleted, and the `users` cache is also cleared.

#### Delete a user
```http
DELETE /users/:id
Authorization: Bearer <token>
```
**Cache Handling**: When a user is deleted, `user:{id}` is removed from Redis, and `users` cache is cleared.

## Redis Cache Handling
### When to Delete Cache:
- **After register a new user** → `redis.del("users")`
- **After updating a user** → `redis.del("users")` and `redis.del("user:{id}")`
- **After deleting a user** → `redis.del("users")` and `redis.del("user:{id}")`

## License
This project is licensed under the MIT License.

## Author
**Dedy Fuadi**

