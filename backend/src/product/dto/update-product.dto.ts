import { IsString, IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';

export class UpdateProductDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsOptional()
    image?: string;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => {
            const parsed = parseFloat(value);
            if (isNaN(parsed)) {
                throw new BadRequestException('Incorrect format of the number by "price"')
            }
        })
    price?: number;

    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10))
    sellerId?: number;
}