import { IsOptional } from "class-validator";

export class CreateOrderDto {
    @IsOptional()
    comment?: string;
}