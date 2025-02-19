import { IsInt, IsPositive, ValidateNested, IsDefined, IsString, ArrayNotEmpty, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDetail {
  @IsDefined()
  @IsInt()
  @IsPositive()
  quantity!: number;

  @IsDefined()
  @IsString()
  mkt!: string;
}

export class UpdateProductsStockBodyDto {
  @IsDefined()
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => UpdateDetail)
  updateDetails!: UpdateDetail[];
}
