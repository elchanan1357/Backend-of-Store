import { Transform } from "class-transformer";
import { IsOptional, Min, IsInt, IsPositive, IsBoolean } from "class-validator";

export class GetProductsQueryDto {
    @Transform(({ value }) => Number(value))
    @IsOptional()
    @IsPositive()
    @IsInt()
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
