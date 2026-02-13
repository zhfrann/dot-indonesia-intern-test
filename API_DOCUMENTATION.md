# API Documentation

## Base URL
```
http://localhost:3000
```

## Authentication

This API uses JWT (JSON Web Token) for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### 1. Authentication

#### 1.1 Register New User

**Endpoint:** `POST /auth/register`

**Description:** Create a new user account

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Must be a valid email format
- `password`: Minimum 6 characters

**Success Response (201):**
```json
{
  "id": 1,
  "email": "user@example.com"
}
```

**Error Responses:**

400 Bad Request - Invalid input:
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "password must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

500 Internal Server Error - Duplicate email:
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

#### 1.2 Login

**Endpoint:** `POST /auth/login`

**Description:** Login with existing credentials and receive JWT token

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

---

### 2. Users

All user endpoints require JWT authentication.

#### 2.1 Get All Users

**Endpoint:** `GET /users`

**Description:** Retrieve all users

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "email": "user1@example.com",
    "posts": [
      {
        "id": 1,
        "title": "First Post",
        "content": "Content here",
        "userId": 1
      }
    ]
  },
  {
    "id": 2,
    "email": "user2@example.com",
    "posts": []
  }
]
```

**Error Response (401):**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 2.2 Get User by ID

**Endpoint:** `GET /users/:id`

**Description:** Retrieve a specific user by ID

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): User ID

**Success Response (200):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "posts": [
    {
      "id": 1,
      "title": "Post Title",
      "content": "Post Content",
      "userId": 1
    }
  ]
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "User with ID 999 not found",
  "error": "Not Found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 2.3 Create User

**Endpoint:** `POST /users`

**Description:** Create a new user (requires authentication)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "securepass123"
}
```

**Success Response (201):**
```json
{
  "id": 3,
  "email": "newuser@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "securepass123"
  }'
```

---

#### 2.4 Update User

**Endpoint:** `PUT /users/:id`

**Description:** Update user information

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): User ID

**Request Body (all fields optional):**
```json
{
  "email": "updated@example.com",
  "password": "newpassword123"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "email": "updated@example.com"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "updated@example.com"
  }'
```

---

#### 2.5 Delete User

**Endpoint:** `DELETE /users/:id`

**Description:** Delete a user

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): User ID

**Success Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/users/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 3. Posts

All post endpoints require JWT authentication.

#### 3.1 Get All Posts

**Endpoint:** `GET /posts`

**Description:** Retrieve all posts with user information

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "First Post",
    "content": "This is the content",
    "userId": 1,
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  },
  {
    "id": 2,
    "title": "Second Post",
    "content": "Another content",
    "userId": 2,
    "user": {
      "id": 2,
      "email": "another@example.com"
    }
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 3.2 Get Post by ID

**Endpoint:** `GET /posts/:id`

**Description:** Retrieve a specific post by ID

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): Post ID

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Post Title",
  "content": "Post content here",
  "userId": 1,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Response (404):**
```json
{
  "statusCode": 404,
  "message": "Post with ID 999 not found",
  "error": "Not Found"
}
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/posts/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 3.3 Get Posts by User ID

**Endpoint:** `GET /posts/user/:userId`

**Description:** Retrieve all posts created by a specific user

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `userId` (integer): User ID

**Success Response (200):**
```json
[
  {
    "id": 1,
    "title": "User's First Post",
    "content": "Content",
    "userId": 1,
    "user": {
      "id": 1,
      "email": "user@example.com"
    }
  }
]
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/posts/user/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

#### 3.4 Create Post

**Endpoint:** `POST /posts`

**Description:** Create a new post (automatically associated with authenticated user)

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "My New Post",
  "content": "This is the content of my post"
}
```

**Validation Rules:**
- `title`: Required, max 100 characters
- `content`: Required, max 100 characters

**Success Response (201):**
```json
{
  "id": 5,
  "title": "My New Post",
  "content": "This is the content of my post",
  "userId": 1,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "title must be shorter than or equal to 100 characters"
  ],
  "error": "Bad Request"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/posts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My New Post",
    "content": "This is the content of my post"
  }'
```

---

#### 3.5 Update Post

**Endpoint:** `PUT /posts/:id`

**Description:** Update a post (only the post owner can update)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): Post ID

**Request Body (all fields optional):**
```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "content": "Updated content",
  "userId": 1,
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "message": "You can only update your own posts",
  "error": "Forbidden"
}
```

**cURL Example:**
```bash
curl -X PUT http://localhost:3000/posts/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title"
  }'
```

---

#### 3.6 Delete Post

**Endpoint:** `DELETE /posts/:id`

**Description:** Delete a post (only the post owner can delete)

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` (integer): Post ID

**Success Response (200):**
```json
{
  "message": "Post deleted successfully"
}
```

**Error Response (403):**
```json
{
  "statusCode": 403,
  "message": "You can only delete your own posts",
  "error": "Forbidden"
}
```

**cURL Example:**
```bash
curl -X DELETE http://localhost:3000/posts/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid JWT token |
| 403 | Forbidden - Not allowed to access resource |
| 404 | Not Found - Resource not found |
| 500 | Internal Server Error - Server error |

---

## Postman Collection

You can import this collection to Postman for easier testing:

### Sample Workflow

1. **Register a new user**
   ```
   POST /auth/register
   ```

2. **Login to get JWT token**
   ```
   POST /auth/login
   ```

3. **Copy the access_token from response**

4. **Create a post using the token**
   ```
   POST /posts
   Header: Authorization: Bearer <token>
   ```

5. **Get all posts**
   ```
   GET /posts
   Header: Authorization: Bearer <token>
   ```

---

## Notes

- All timestamps are in ISO 8601 format
- JWT tokens expire after 1 hour
- Passwords are hashed using bcrypt (10 rounds)
- Email addresses must be unique
- Users can only update/delete their own posts
- Maximum field lengths are enforced at database level

---

## Database Schema

### User Table
```sql
CREATE TABLE User (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL
);
```

### Post Table
```sql
CREATE TABLE Post (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(100) NOT NULL,
  content VARCHAR(100) NOT NULL,
  userId INT NOT NULL,
  FOREIGN KEY (userId) REFERENCES User(id)
);
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production use.

## CORS

CORS is not configured. Configure based on your frontend requirements.
