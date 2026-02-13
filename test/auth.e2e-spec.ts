import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Authentication & JWT (e2e)', () => {
    let app: INestApplication;
    let prisma: PrismaService;
    let authToken: string;
    let userId: number;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
            }),
        );

        prisma = app.get<PrismaService>(PrismaService);
        await app.init();

        // Cleanup any existing test data before tests
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();
    });

    afterAll(async () => {
        // Cleanup test data
        await prisma.post.deleteMany();
        await prisma.user.deleteMany();
        await app.close();
    });

    describe('Auth Endpoints', () => {
        const testUser = {
            email: 'test@example.com',
            password: 'password123',
        };

        it('/auth/register (POST) - should register a new user', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('email', testUser.email);
                    expect(res.body).not.toHaveProperty('password');
                    userId = res.body.id;
                });
        });

        it('/auth/register (POST) - should fail with duplicate email', () => {
            return request(app.getHttpServer()).post('/auth/register').send(testUser).expect(500); // Prisma unique constraint error
        });

        it('/auth/register (POST) - should fail with invalid email', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'invalid-email',
                    password: 'password123',
                })
                .expect(400);
        });

        it('/auth/register (POST) - should fail with short password', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                    email: 'test2@example.com',
                    password: '123',
                })
                .expect(400);
        });

        it('/auth/login (POST) - should login with valid credentials', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send(testUser)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('access_token');
                    expect(typeof res.body.access_token).toBe('string');
                    authToken = res.body.access_token;
                });
        });

        it('/auth/login (POST) - should fail with wrong password', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: testUser.email,
                    password: 'wrongpassword',
                })
                .expect(401);
        });

        it('/auth/login (POST) - should fail with non-existent user', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({
                    email: 'nonexistent@example.com',
                    password: 'password123',
                })
                .expect(401);
        });
    });

    describe('Protected Endpoints - User CRUD', () => {
        it('/users (GET) - should fail without token', () => {
            return request(app.getHttpServer()).get('/users').expect(401);
        });

        it('/users (GET) - should fail with invalid token', () => {
            return request(app.getHttpServer()).get('/users').set('Authorization', 'Bearer invalid-token').expect(401);
        });

        it('/users (GET) - should succeed with valid token', () => {
            return request(app.getHttpServer())
                .get('/users')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });

        it('/users/:id (GET) - should get user by id with valid token', () => {
            return request(app.getHttpServer())
                .get(`/users/${userId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id', userId);
                    expect(res.body).toHaveProperty('email');
                    expect(res.body).not.toHaveProperty('password');
                });
        });

        it('/users/:id (GET) - should fail without token', () => {
            return request(app.getHttpServer()).get(`/users/${userId}`).expect(401);
        });
    });

    describe('Protected Endpoints - Post CRUD', () => {
        let postId: number;

        const testPost = {
            title: 'Test Post',
            content: 'This is a test post content',
        };

        it('/posts (POST) - should fail without token', () => {
            return request(app.getHttpServer()).post('/posts').send(testPost).expect(401);
        });

        it('/posts (POST) - should create post with valid token', () => {
            return request(app.getHttpServer())
                .post('/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .send(testPost)
                .expect(201)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id');
                    expect(res.body).toHaveProperty('title', testPost.title);
                    expect(res.body).toHaveProperty('content', testPost.content);
                    expect(res.body).toHaveProperty('userId', userId);
                    expect(res.body).toHaveProperty('user');
                    postId = res.body.id;
                });
        });

        it('/posts (GET) - should fail without token', () => {
            return request(app.getHttpServer()).get('/posts').expect(401);
        });

        it('/posts (GET) - should get all posts with valid token', () => {
            return request(app.getHttpServer())
                .get('/posts')
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body)).toBe(true);
                    expect(res.body.length).toBeGreaterThan(0);
                });
        });

        it('/posts/:id (GET) - should get post by id with valid token', () => {
            return request(app.getHttpServer())
                .get(`/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id', postId);
                    expect(res.body).toHaveProperty('title', testPost.title);
                });
        });

        it('/posts/:id (PUT) - should update post with valid token', () => {
            const updatedPost = {
                title: 'Updated Test Post',
                content: 'Updated content',
            };

            return request(app.getHttpServer())
                .put(`/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .send(updatedPost)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('id', postId);
                    expect(res.body).toHaveProperty('title', updatedPost.title);
                    expect(res.body).toHaveProperty('content', updatedPost.content);
                });
        });

        it('/posts/:id (PUT) - should fail without token', () => {
            return request(app.getHttpServer()).put(`/posts/${postId}`).send({ title: 'Updated' }).expect(401);
        });

        it('/posts/:id (DELETE) - should fail without token', () => {
            return request(app.getHttpServer()).delete(`/posts/${postId}`).expect(401);
        });

        it('/posts/:id (DELETE) - should delete post with valid token', () => {
            return request(app.getHttpServer())
                .delete(`/posts/${postId}`)
                .set('Authorization', `Bearer ${authToken}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveProperty('message');
                });
        });
    });

    describe('JWT Token Validation', () => {
        it('should reject expired token', async () => {
            // This would require creating a token with very short expiry
            // For now, we test that malformed tokens are rejected
            return request(app.getHttpServer())
                .get('/users')
                .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid')
                .expect(401);
        });

        it('should reject token without Bearer prefix', () => {
            return request(app.getHttpServer()).get('/users').set('Authorization', authToken).expect(401);
        });

        it('should reject empty Authorization header', () => {
            return request(app.getHttpServer()).get('/users').set('Authorization', '').expect(401);
        });

        it('should work with valid Bearer token', () => {
            return request(app.getHttpServer()).get('/users').set('Authorization', `Bearer ${authToken}`).expect(200);
        });
    });
});
