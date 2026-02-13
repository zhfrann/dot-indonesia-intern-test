import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';

@Injectable()
export class PostService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.post.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    async findOne(id: number) {
        const post = await this.prisma.post.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });

        if (!post) {
            throw new NotFoundException(`Post with ID ${id} not found`);
        }

        return post;
    }

    async findByUser(userId: number) {
        return this.prisma.post.findMany({
            where: { userId },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    async create(createPostDto: CreatePostDto, userId: number) {
        return this.prisma.post.create({
            data: {
                title: createPostDto.title,
                content: createPostDto.content,
                userId,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    async update(id: number, updatePostDto: UpdatePostDto, userId: number) {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only update your own posts');
        }

        return this.prisma.post.update({
            where: { id },
            data: updatePostDto,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    },
                },
            },
        });
    }

    async delete(id: number, userId: number) {
        const post = await this.findOne(id);

        if (post.userId !== userId) {
            throw new ForbiddenException('You can only delete your own posts');
        }

        await this.prisma.post.delete({
            where: { id },
        });

        return { message: 'Post deleted successfully' };
    }
}
