import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards, Request } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto, UpdatePostDto } from './dto/post.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Get()
    findAll() {
        return this.postService.findAll();
    }

    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.postService.findOne(id);
    }

    @Get('user/:userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.postService.findByUser(userId);
    }

    @Post()
    create(@Body() createPostDto: CreatePostDto, @Request() req) {
        return this.postService.create(createPostDto, req.user.userId);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: UpdatePostDto, @Request() req) {
        return this.postService.update(id, updatePostDto, req.user.userId);
    }

    @Delete(':id')
    delete(@Param('id', ParseIntPipe) id: number, @Request() req) {
        return this.postService.delete(id, req.user.userId);
    }
}
