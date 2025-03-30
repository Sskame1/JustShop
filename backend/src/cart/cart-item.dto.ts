import { IsInt, Max, Min } from "class-validator";

export class CartItemDto {
    @IsInt()
    productId: number;

    @IsInt()
    @Min(1)
    @Max(99)
    quantity: number;
}