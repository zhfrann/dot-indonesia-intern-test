import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';

@Module({
    imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, PrismaModule, UserModule, PostModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
