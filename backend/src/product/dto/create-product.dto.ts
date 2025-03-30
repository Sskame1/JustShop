import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    image?: string; 

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => {
        const parsed = parseFloat(value);
        if (isNaN(parsed)) {
            throw new BadRequestException('Incorrect format of the number by price')
        }
        return parsed;
    })
    price: number;

    @IsNumber()
    @IsNotEmpty()
    @Transform(({ value }) => parseInt(value, 10))
    sellerId: number;
}