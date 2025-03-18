import { IsEmail, IsString, MaxLength, MinLength, IsOptional} from "class-validator";

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
}