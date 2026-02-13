# Architecture Documentation

## Overview

This NestJS application follows a **Layered Architecture Pattern** with modular design principles. The architecture is designed to be maintainable, scalable, and testable.

## Architecture Pattern: Layered + Module-Based

### Why This Pattern?

#### 1. **Separation of Concerns**
Each layer has a single, well-defined responsibility:
- **Presentation Layer (Controllers)**: Handle HTTP requests/responses
- **Business Logic Layer (Services)**: Implement business rules
- **Data Access Layer (Prisma)**: Manage database operations
- **Cross-cutting Concerns (Guards, Pipes, Interceptors)**: Handle authentication, validation, etc.

#### 2. **Maintainability**
- Clear structure makes it easy to locate and modify code
- Changes in one layer don't affect others
- New features can be added without modifying existing code
- Follows SOLID principles

#### 3. **Testability**
- Each layer can be tested independently
- Dependency Injection makes mocking easy
- Clear boundaries facilitate unit and integration testing

#### 4. **Scalability**
- Easy to add new modules
- Can be split into microservices if needed
- Supports lazy loading
- Database queries are optimized through Prisma

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser/API)                 │
└─────────────────────┬───────────────────────────────────┘
                      │ HTTP Request
                      ↓
┌─────────────────────────────────────────────────────────┐
│                  NestJS Application                     │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Middleware Layer                        │  │
│  │  - Global Validation Pipe                         │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                  │
│                      ↓                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Controller Layer                        │  │
│  │  - AuthController                                 │  │
│  │  - UserController                                 │  │
│  │  - PostController                                 │  │
│  │                                                   │  │
│  │  Responsibilities:                                │  │
│  │  • Receive HTTP requests                          │  │
│  │  • Validate DTOs                                  │  │
│  │  • Apply Guards (JWT Auth)                        │  │
│  │  • Call Service methods                           │  │
│  │  • Return HTTP responses                          │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                  │
│                      ↓                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Service Layer                           │  │
│  │  - AuthService                                    │  │
│  │  - UserService                                    │  │
│  │  - PostService                                    │  │
│  │                                                   │  │
│  │  Responsibilities:                                │  │
│  │  • Implement business logic                       │  │
│  │  • Validate business rules                        │  │
│  │  • Handle transactions                            │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                  │
│                      ↓                                  │
│  ┌───────────────────────────────────────────────────┐  │
│  │           Data Access Layer                       │  │
│  │  - PrismaService                                  │  │
│  │                                                   │  │
│  │  Responsibilities:                                │  │
│  │  • Database connections                           │  │
│  │  • CRUD operations                                │  │
│  └───────────────────┬───────────────────────────────┘  │
│                      │                                  │
└──────────────────────┼──────────────────────────────────┘
                       │
                       ↓
              ┌────────────────┐
              │  MySQL/MariaDB │
              └────────────────┘
```

## Module Structure

### 1. Auth Module
```
auth/
├── dto/
│   └── auth.dto.ts          # RegisterDto, LoginDto
├── auth.controller.ts        # /auth/register, /auth/login
├── auth.service.ts           # Registration & Login logic
├── auth.module.ts            # Module configuration
├── jwt.guard.ts              # JWT Authentication Guard
└── jwt.strategy.ts           # Passport JWT Strategy
```

**Responsibilities:**
- User registration with password hashing
- User authentication
- JWT token generation
- Token validation

**Design Decisions:**
- Used Passport.js for authentication (industry standard)
- JWT tokens expire in 1 hour (configurable)
- Passwords hashed with bcrypt (10 rounds)
- Separation of registration and login endpoints

### 2. User Module
```
user/
├── dto/
│   └── user.dto.ts           # CreateUserDto, UpdateUserDto
├── user.controller.ts        # CRUD endpoints
├── user.service.ts           # User business logic
└── user.module.ts            # Module configuration
```

**Responsibilities:**
- User CRUD operations
- User profile management
- Password updates with re-hashing
- User-Post relationships

**Design Decisions:**
- All endpoints protected by JWT
- Passwords never returned in responses
- Soft validation with DTOs
- Related posts included in responses

### 3. Post Module
```
post/
├── dto/
│   └── post.dto.ts           # CreatePostDto, UpdatePostDto
├── post.controller.ts        # CRUD endpoints
├── post.service.ts           # Post business logic
└── post.module.ts            # Module configuration
```

**Responsibilities:**
- Post CRUD operations
- Authorization checks (users can only modify their own posts)
- User-Post relationship management
- Post filtering by user

**Design Decisions:**
- Authorization at service level (not just authentication)
- Automatic userId assignment from JWT payload
- Forbidden error if user tries to modify others' posts
- Includes user information in responses

### 4. Prisma Module
```
prisma/
├── prisma.service.ts         # Prisma Client wrapper
└── prisma.module.ts          # Module configuration
```

**Responsibilities:**
- Database connection management
- Lifecycle hooks (connect/disconnect)
- Singleton pattern for Prisma Client
- Type-safe database access

**Design Decisions:**
- Global module (imported once, used everywhere)
- Connection pooling configured
- Graceful shutdown handling
- Adapter pattern for MariaDB compatibility

## Data Flow

### Example: Create Post Flow

```
1. Client Request
   POST /posts
   Authorization: Bearer <token>
   Body: { title: "...", content: "..." }
   
2. NestJS Middleware
   ↓ Global Validation Pipe validates DTO
   ↓ JWT Guard validates token
   ↓ JWT Strategy extracts user info
   
3. PostController.create()
   ↓ Receives CreatePostDto
   ↓ Gets userId from request object
   ↓ Calls PostService.create()
   
4. PostService.create()
   ↓ Validates business rules
   ↓ Calls Prisma to create post
   
5. PrismaService
   ↓ Executes SQL INSERT
   ↓ Returns created post
   
6. Response Flow (back up)
   PostService → PostController → Client
   Returns: Post with user information
```

## Security Architecture

### Authentication Flow

```
┌──────────┐                                  ┌──────────┐
│  Client  │                                  │  Server  │
└────┬─────┘                                  └────┬─────┘
     │                                             │
     │  1. POST /auth/register                     │
     │  { email, password }                        │
     ├────────────────────────────────────────────►
     │                                             │
     │                                    2. Hash password
     │                                    3. Save to DB
     │                                             │
     │  4. Return user (no password)               │
     ◄─────────────────────────────────────────────┤
     │                                             │
     │  5. POST /auth/login                        │
     │  { email, password }                        │
     ├────────────────────────────────────────────►
     │                                             │
     │                                    6. Find user
     │                                    7. Compare password
     │                                    8. Generate JWT
     │                                             │
     │  9. Return { access_token }                 │
     ◄─────────────────────────────────────────────┤
     │                                             │
     │  10. POST /posts                            │
     │  Authorization: Bearer <token>              │
     ├────────────────────────────────────────────►
     │                                             │
     │                                    11. Verify JWT
     │                                    12. Extract user
     │                                    13. Process request
     │                                             │
     │  14. Return response                        │
     ◄─────────────────────────────────────────────┤
     │                                             │
```

### Authorization Strategy

1. **Authentication**: JWT Guard verifies token
2. **Authorization**: Service layer checks ownership
   - Users can view all posts
   - Users can only create posts for themselves
   - Users can only update/delete their own posts

## Database Schema Design

### Relationships

```
User (1) ────────< (Many) Post

User:
- id (PK)
- email (UNIQUE)
- password (hashed)

Post:
- id (PK)
- title
- content
- userId (FK → User.id)
```

### Design Decisions

- **One-to-Many**: One user can have many posts
- **Indexes**: Auto-indexed on foreign keys
- **Constraints**: Email uniqueness enforced at DB level

## Dependency Injection

NestJS uses DI container for managing dependencies:

```typescript
// Example: PostService dependencies
@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService  // Injected by DI container
  ) {}
}

// PostModule configuration
@Module({
  imports: [PrismaModule],         // Import required modules
  providers: [PostService],        // Register providers
  controllers: [PostController],   // Register controllers
  exports: [PostService],          // Export for other modules
})
export class PostModule {}
```

**Benefits:**
- Loose coupling between components
- Easy to mock for testing
- Singleton pattern for services
- Clear dependency graph

## Error Handling Strategy

### Built-in Exception Filters

- `NotFoundException`: 404 - Resource not found
- `UnauthorizedException`: 401 - Invalid/missing token
- `ForbiddenException`: 403 - Insufficient permissions
- `BadRequestException`: 400 - Validation errors

### Example Flow

```typescript
// Service throws exception
throw new NotFoundException(`User with ID ${id} not found`);

// NestJS catches and formats
{
  "statusCode": 404,
  "message": "User with ID 123 not found",
  "error": "Not Found"
}
```

## Validation Strategy

### DTO-based Validation

```typescript
export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string;
}
```

**Process:**
1. Request received
2. Global ValidationPipe transforms and validates
3. If invalid: 400 error with details
4. If valid: Proceed to controller

## Testing Strategy

### E2E Tests (auth.e2e-spec.ts)

Tests the complete flow:
- User registration
- User login
- JWT token generation
- Protected endpoint access
- CRUD operations
- Authorization checks
