import { IsNotEmpty, IsString, IsOptional, MaxLength } from 'class-validator';

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

export class UpdatePostDto {
    @IsString()
    @IsOptional()
    @MaxLength(100)
    title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    content?: string;
}
