import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwt: JwtService,
    ) {}

    async register(dto: { email: string; password: string }) {
        const hash = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: { email: dto.email, password: hash },
            select: {
                id: true,
                email: true,
            },
        });
    }

    async login(dto: { email: string; password: string }) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user) throw new UnauthorizedException();

        const valid = await bcrypt.compare(dto.password, user.password);
        if (!valid) throw new UnauthorizedException();

        return {
            access_token: this.jwt.sign({ sub: user.id, email: user.email }),
        };
    }
}
