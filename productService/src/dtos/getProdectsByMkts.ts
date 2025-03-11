import { Transform } from 'class-transformer';
import { IsArray, ArrayNotEmpty, IsString, IsDefined } from 'class-validator';
import { Product } from '../types/product';

export class ProdectsByMktsQueryDto {
  @Transform(({ value }) => (value as string).split(",").map((value) => value.trim()))
  @IsArray()
  @ArrayNotEmpty()
  @IsDefined()
  @IsString({ each: true })
  mkts!: string[];
}

export class ProdectsByMktsResponseDto {
  [key: string]: Omit<Product, "stock" | "mkt">;
}
  