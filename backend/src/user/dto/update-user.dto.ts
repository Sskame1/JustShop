import { IsEmail, IsString, MaxLength, MinLength, IsOptional, IsInt, Min, Max } from "class-validator";
import { UserRole } from "src/auth/roles.enum";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @MaxLength(20)
    name: string;

    @IsEmail()
    @IsOptional()
    email: string;

    @IsString()
    @IsOptional()
    @MinLength(6)
    @MaxLength(20)
    password: string;

    @IsOptional()
    @IsInt()
    @Min(UserRole.USER)
    @Max(UserRole.SELLER)
    role?: number;
}