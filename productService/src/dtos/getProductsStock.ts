import { Transform } from 'class-transformer';
import { IsArray, ArrayNotEmpty, IsString, IsDefined } from 'class-validator';

export class ProductStocksQueryDto {
  @Transform(({ value }) => (value as string).split(",").map((value) => value.trim()))
  @IsArray()
  @ArrayNotEmpty()
  @IsDefined()
  @IsString({ each: true })
  mkts!: string[];
}

export class ProductStocksResponseDto {
    [key: string]: number;
  }
  
