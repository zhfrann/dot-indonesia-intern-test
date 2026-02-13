import { Global, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(private readonly configService: ConfigService) {
        super({
            adapter: new PrismaMariaDb({
                host: configService.get<string>('DATABASE_HOST', 'localhost'),
                user: configService.get<string>('DATABASE_USER', 'root'),
                password: configService.get<string>('DATABASE_PASSWORD', ''),
                database: configService.get<string>('DATABASE_NAME', ''),
                connectionLimit: 5,
            }),
        });
    }

    async onModuleInit() {
        await this.$connect();
        console.log('Prisma Service Initialized');
    }

    async onModuleDestroy() {
        await this.$disconnect();
        console.log('Prisma Service Destroyed');
    }
}
