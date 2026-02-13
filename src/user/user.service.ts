import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                posts: true,
            },
        });
    }

    async findOne(id: number) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                posts: true,
            },
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        return user;
    }

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        return this.prisma.user.create({
            data: {
                email: createUserDto.email,
                password: hashedPassword,
            },
            select: {
                id: true,
                email: true,
            },
        });
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        await this.findOne(id);

        const data: {
            email?: string;
            password?: string;
        } = {};

        if (updateUserDto.email) {
            data.email = updateUserDto.email;
        }

        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }

        return this.prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
            },
        });
    }

    async delete(id: number) {
        await this.findOne(id);

        await this.prisma.user.delete({
            where: { id },
        });

        return { message: 'User deleted successfully' };
    }
}
