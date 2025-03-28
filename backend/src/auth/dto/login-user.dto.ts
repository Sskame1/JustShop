import { IsEmail, IsEmpty, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}