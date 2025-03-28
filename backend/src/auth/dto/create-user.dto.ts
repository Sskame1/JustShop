import { IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, MinLength } from "class-validator"
import { UserRole } from "../roles.enum";

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

    @IsInt()
    @IsOptional()
    @Min(UserRole.USER)
    @Max(UserRole.SELLER)
    role?: number;
}