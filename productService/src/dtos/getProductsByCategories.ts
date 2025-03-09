import { Transform } from "class-transformer";
import { IsOptional, Min, IsArray, IsEnum, ArrayNotEmpty, IsInt, IsPositive, IsDefined, IsBoolean } from "class-validator";
import { Product, ProductCategory } from "../types/product";

export class GetProductsByCategoriesQueryDto {
    @Transform(({ value }) => (value as string).split(",").map((value) => value.trim()))
    @IsArray()
    @ArrayNotEmpty()
    @IsDefined()
    @IsEnum(ProductCategory, { each: true })
    categories!: ProductCategory[];

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    @IsPositive()
    limit?: number;

    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsInt()
    @Min(0)
    offset?: number;
    
    @Transform(({ value }) => value === 'true')
    @IsOptional()
    @IsBoolean()
    isInStock?: boolean;
}

export type GetProductsByCategoryResponseDto = {
    [key in ProductCategory]: Product[];
  };