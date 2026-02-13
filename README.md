# NestJS RESTful API - Internship Project

Simple RESTful API built with NestJS and TypeScript featuring JWT authentication, CRUD operations, and SQL database integration.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Pattern](#architecture-pattern)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Environment Variables](#environment-variables)

## Features

- JWT Authentication (Register & Login)
- Two related CRUD operations (Users & Posts)
- SQL Database (MySQL/MariaDB) with Prisma ORM
- Input validation with class-validator
- E2E testing for authentication
- Type-safe with TypeScript
- RESTful API design

## Tech Stack

- **Framework**: NestJS 11
- **Language**: TypeScript
- **Database**: MySQL/MariaDB
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Token)
- **Validation**: class-validator & class-transformer
- **Testing**: Jest & Supertest
- **Password Hashing**: bcrypt

## Architecture Pattern

### Layered Architecture Pattern (Module-Based)

Project ini menggunakan **Layered Architecture Pattern** yang diimplementasikan melalui sistem module NestJS. Pattern ini dipilih karena beberapa alasan:

#### 1. **Separation of Concerns**
Setiap layer memiliki tanggung jawab yang jelas:
- **Controllers**: Menangani HTTP requests/responses
- **Services**: Business logic dan interaksi dengan database
- **DTOs**: Data validation dan transformation
- **Guards**: Authorization & authentication
- **Modules**: Encapsulation dan dependency management

#### 2. **Maintainability**
- Kode terorganisir dengan baik dan mudah dipahami
- Setiap fitur memiliki folder sendiri (auth, user, post)
- Mudah untuk menambahkan fitur baru tanpa mengubah kode existing
- Clear dependency injection membuat testing lebih mudah

#### 3. **Scalability**
- Module system memungkinkan lazy loading
- Easy to split into microservices jika diperlukan
- Dapat menambahkan layer baru (caching, logging) tanpa merusak struktur existing

#### 4. **Testability**
- Setiap layer dapat di-test secara independen
- Dependency injection memudahkan mocking
- Clear boundaries memudahkan unit dan integration testing

#### 5. **Best Practices**
- Mengikuti SOLID principles
- Dependency Injection out of the box
- Decorators untuk metadata dan validation
- Type safety dengan TypeScript

#### Struktur Layer:

```
Request → Controller → Service → Database
                ↓
            DTO/Guard
```

1. **Controller Layer**: Menerima request, validate input via DTOs, memanggil service
2. **Service Layer**: Business logic, database operations via Prisma
3. **DTO Layer**: Input/output validation dan transformation
4. **Guard Layer**: Authentication & authorization checks
5. **Database Layer**: Prisma ORM untuk type-safe database access

## Project Structure

```
src/
├── auth/                    # Authentication module
│   ├── dto/                # Data Transfer Objects
│   ├── auth.controller.ts  # Auth endpoints (register, login)
│   ├── auth.service.ts     # Auth business logic
│   ├── auth.module.ts      # Auth module definition
│   ├── jwt.guard.ts        # JWT authentication guard
│   └── jwt.strategy.ts     # Passport JWT strategy
├── user/                    # User module
│   ├── dto/                # User DTOs
│   ├── user.controller.ts  # User CRUD endpoints
│   ├── user.service.ts     # User business logic
│   └── user.module.ts      # User module definition
├── post/                    # Post module
│   ├── dto/                # Post DTOs
│   ├── post.controller.ts  # Post CRUD endpoints
│   ├── post.service.ts     # Post business logic
│   └── post.module.ts      # Post module definition
├── prisma/                  # Prisma service
│   ├── prisma.service.ts   # Prisma client wrapper
│   └── prisma.module.ts    # Prisma module
├── common/                  # Shared utilities
├── app.module.ts           # Root module
└── main.ts                 # Application entry point

prisma/
├── schema.prisma           # Database schema
└── migrations/             # Database migrations

test/
├── auth.e2e-spec.ts       # E2E tests for authentication
└── jest-e2e.json          # E2E test configuration
```

## Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd project
```

2. **Install dependencies**

```bash
npm install
```

3. **Setup environment variables**

```bash
cp .env.example .env
```

Edit `.env` file dengan konfigurasi database Anda:

```env
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=nestjs_internship
JWT_SECRET=your-secret-key-change-this
PORT=3000
```

4. **Setup database**

Create database di MySQL/MariaDB:

```sql
CREATE DATABASE nestjs_internship;
```

5. **Run migrations**

```bash
npx prisma migrate dev
```

6. **Generate Prisma Client**

```bash
npx prisma generate
```

## Running the Application

### Development Mode

```bash
npm run start:dev
```

### Production Mode

```bash
npm run build
npm run start:prod
```

Application akan berjalan di `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint        | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| POST   | /auth/register | Register new user    | No            |
| POST   | /auth/login    | Login user           | No            |

### Users

| Method | Endpoint     | Description        | Auth Required |
|--------|-------------|--------------------|--------------| 
| GET    | /users      | Get all users      | Yes          |
| GET    | /users/:id  | Get user by ID     | Yes          |
| POST   | /users      | Create new user    | Yes          |
| PUT    | /users/:id  | Update user        | Yes          |
| DELETE | /users/:id  | Delete user        | Yes          |

### Posts

| Method | Endpoint           | Description              | Auth Required |
|--------|--------------------|--------------------------|---------------|
| GET    | /posts            | Get all posts            | Yes           |
| GET    | /posts/:id        | Get post by ID           | Yes           |
| GET    | /posts/user/:id   | Get posts by user ID     | Yes           |
| POST   | /posts            | Create new post          | Yes           |
| PUT    | /posts/:id        | Update post (own only)   | Yes           |
| DELETE | /posts/:id        | Delete post (own only)   | Yes           |

### Example Requests

**Register:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Create Post (with JWT):**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Post",
    "content": "This is my first post content"
  }'
```

**Get All Posts (with JWT):**
```bash
curl -X GET http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### E2E Test Coverage

E2E tests mencakup:
- User registration (valid & invalid cases)
- User login (valid & invalid credentials)
- JWT token generation
- Protected endpoints without token (401)
- Protected endpoints with invalid token (401)
- Protected endpoints with valid token (200)
- CRUD operations on Users
- CRUD operations on Posts
- Authorization checks (user can only modify own posts)

### Test Coverage

```bash
npm run test:cov
```

## Environment Variables

| Variable          | Description                    | Default          |
|-------------------|--------------------------------|------------------|
| DATABASE_HOST     | MySQL/MariaDB host            | localhost        |
| DATABASE_USER     | Database user                 | root             |
| DATABASE_PASSWORD | Database password             | -                |
| DATABASE_NAME     | Database name                 | -                |
| JWT_SECRET        | Secret key for JWT signing    | secretKey        |
| PORT              | Application port              | 3000             |
| NODE_ENV          | Environment mode              | development      |

## Database Schema

### User Model
```prisma
model User {
    id       Int    @id @default(autoincrement())
    email    String @unique
    password String @db.VarChar(100)
    posts    Post[]
}
```

### Post Model
```prisma
model Post {
    id      Int    @id @default(autoincrement())
    title   String @db.VarChar(100)
    content String @db.VarChar(100)
    userId  Int
    user    User   @relation(fields: [userId], references: [id])
}
```

## Authentication Flow

1. User registers via `/auth/register`
2. Password di-hash menggunakan bcrypt (10 rounds)
3. User login via `/auth/login`
4. JWT token di-generate dengan payload `{ sub: userId, email: userEmail }`
5. Token expired dalam 1 jam
6. Client menyimpan token dan mengirimkannya di header:
   ```
   Authorization: Bearer <token>
   ```
7. Protected routes menggunakan `JwtAuthGuard`
8. Guard validates token dan inject user data ke request object

## Future Improvements

Jika ada waktu, berikut improvement yang bisa ditambahkan:

- Refresh token mechanism
- Role-based access control (RBAC)
- Pagination untuk list endpoints
- Search & filtering
- Rate limiting
- Logging dengan Winston
- API documentation dengan Swagger
- Docker containerization
- CI/CD pipeline
- More comprehensive error handling
- File upload untuk user avatar

## Author

**Muhammad Zhafran Ilham**

## License

UNLICENSED - For internship purposes only.

---

**Note**: Project ini dibuat untuk keperluan pendaftaran magang di DOT Indonesia. Strukturnya dibuat simple namun scalable untuk memudahkan development dan maintenance di masa depan.
