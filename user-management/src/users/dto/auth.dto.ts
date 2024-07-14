import { IsNotEmpty, IsString } from "class-validator";

export class AuthPayLoadDto {
    
    @IsNotEmpty()
    @IsString()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}