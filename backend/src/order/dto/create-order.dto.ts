import { IsInt, IsPositive } from "class-validator";

export class CreateOrderDto {
    @IsInt()
    @IsPositive()
    userId: number;
}