# Project Summary - NestJS RESTful API

## Project Information

**Project Name:** NestJS RESTful API for Internship  
**Author:** Muhammad Zhafran Ilham  
**Purpose:** DOT Indonesia Internship Application  
**Framework:** NestJS 11 with TypeScript  
**Database:** MySQL with Prisma ORM v7

---

## Requirements Checklist

### a. Minimal 2 CRUD Operations (Relational)
- **User CRUD**: Create, Read, Update, Delete users
- **Post CRUD**: Create, Read, Update, Delete posts
- **Relationship**: User has many Posts (1:N relationship)

### b. SQL Database
- MySQL/MariaDB database
- Prisma ORM for type-safe queries
- Database migrations implemented
- Foreign key constraints

### c. JWT Authentication
- User registration with password hashing (bcrypt)
- User login with JWT token generation
- Token-based authentication on protected routes
- JWT Guard implementation
- Passport.js strategy

### d. E2E Testing for JWT Token
- Comprehensive E2E tests (auth.e2e-spec.ts)
- Tests registration & login
- Tests JWT token generation
- Tests protected endpoints (with/without token)
- Tests authorization (user ownership)

### e. Project Pattern
- **Layered Architecture Pattern** (Module-based)
- Clear separation of concerns
- Controller → Logic Service → Prisma Service -> Database
- DTOs for validation
- Guards for authentication

---

## Project Structure

```
project/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── dto/           # RegisterDto, LoginDto
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── jwt.guard.ts
│   │   └── jwt.strategy.ts
│   ├── user/              # User CRUD module
│   │   ├── dto/           # CreateUserDto, UpdateUserDto
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── post/              # Post CRUD module
│   │   ├── dto/           # CreatePostDto, UpdatePostDto
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   └── post.module.ts
│   ├── prisma/            # Database service
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── test/
│   ├── auth.e2e-spec.ts   # E2E tests for JWT
│   └── jest-e2e.json      # E2E test config
├── README.md              # Main documentation
├── API_DOCUMENTATION.md   # API endpoint documentation
├── ARCHITECTURE.md        # Architecture deep dive
├── QUICKSTART.md          # Quick start guide
└── test-api.sh            # Manual testing script
```

---

## Key Features Implemented

### 1. Authentication System
- User registration with email validation
- Password hashing using bcrypt (10 rounds)
- JWT token generation with 1-hour expiry
- Token validation on protected routes
- Secure password storage (never returned in responses)

### 2. User Management
- Create new users
- List all users with their posts
- Get single user by ID
- Update user information
- Delete users
- All endpoints protected by JWT

### 3. Post Management
- Create posts (automatically linked to authenticated user)
- List all posts with author information
- Get posts by user ID
- Update posts (owner only)
- Delete posts (owner only)
- Authorization checks implemented

### 4. Database Design
```sql
User (1) ────────< (Many) Post

User:
  - id (PK, Auto-increment)
  - email (UNIQUE)
  - password (Hashed)

Post:
  - id (PK, Auto-increment)
  - title (VARCHAR 100)
  - content (VARCHAR 100)
  - userId (FK → User.id)
```

### 5. Validation
- Input validation using class-validator
- DTO-based validation
- Email format validation
- Password minimum length (6 characters)
- Maximum field lengths enforced

### 6. Error Handling
- 400: Bad Request (validation errors)
- 401: Unauthorized (invalid/missing token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found (resource not found)
- 500: Internal Server Error

### Running Tests
```bash
# E2E Tests
npm run test:e2e

# Unit Tests
npm run test

# Test Coverage
npm run test:cov
```

---

## API Endpoints

### Public Endpoints
| Method | Endpoint        | Description          |
|--------|----------------|----------------------|
| POST   | /auth/register | Register new user    |
| POST   | /auth/login    | Login & get JWT      |

### Protected Endpoints (Require JWT)
| Method | Endpoint           | Description              |
|--------|--------------------|--------------------------|
| GET    | /users            | Get all users            |
| GET    | /users/:id        | Get user by ID           |
| POST   | /users            | Create new user (same with register user) |
| PUT    | /users/:id        | Update user              |
| DELETE | /users/:id        | Delete user              |
| GET    | /posts            | Get all posts            |
| GET    | /posts/:id        | Get post by ID           |
| GET    | /posts/user/:id   | Get posts by user        |
| POST   | /posts            | Create post              |
| PUT    | /posts/:id        | Update post (owner only) |
| DELETE | /posts/:id        | Delete post (owner only) |

---

## Architecture Pattern: Layered Architecture

### Why This Pattern?

1. **Separation of Concerns**
   - Controllers handle HTTP
   - Services handle business logic
   - Prisma handles database
   - Clear boundaries between layers

2. **Maintainability**
   - Easy to locate and modify code
   - New features don't break existing code
   - Follows SOLID principles
   - Self-documenting structure

3. **Testability**
   - Each layer tested independently
   - Easy mocking with DI
   - Comprehensive test coverage
   - Fast test execution

4. **Scalability**
   - Module system allows growth
   - Can split into microservices
   - Horizontal scaling ready
   - Stateless design

5. **Developer Experience**
   - Fast development
   - Clear code organization
   - TypeScript type safety
   - Industry standard pattern

### Layer Flow
```
Client Request
    ↓
Middleware (Validation, Auth)
    ↓
Controller (HTTP Handler)
    ↓
Service (Business Logic)
    ↓
Prisma (Database Access)
    ↓
MySQL
```

---

## Dependencies

### Production
- @nestjs/common, @nestjs/core - NestJS framework
- @nestjs/jwt - JWT authentication
- @nestjs/passport - Authentication strategies
- @prisma/client - Database ORM
- bcrypt - Password hashing
- passport-jwt - JWT strategy
- class-validator - Input validation

### Development
- @nestjs/testing - Testing utilities
- jest - Test framework
- supertest - HTTP testing
- typescript - Type safety
- prisma - Database CLI
- prettier, eslint - Code formatting

---

## Quick Start

```bash
# Install dependencies
npm install

# Setup database
CREATE DATABASE nestjs_internship;

# Configure .env
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npx prisma migrate dev
npx prisma generate

# Start application
npm run start:dev

# Run E2E tests
npm run test:e2e
```

Application runs at: http://localhost:3000

---

**Author:** Muhammad Zhafran Ilham  
**Date:** February 2026
**Purpose:** DOT Indonesia Internship Application  
**Framework:** NestJS 11 + TypeScript  
**Database:** MySQL + Prisma ORM v7
