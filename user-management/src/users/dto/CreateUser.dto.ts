import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from "class-validator";


export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[0-9])/, { message: 'Password must contain at least one number.' })
    password?: string;
}


