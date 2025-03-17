import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator"

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    password: string;
}