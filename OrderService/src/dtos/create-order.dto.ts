import { IsArray, IsInt, IsNotEmpty, IsObject, IsString, Min, ValidateNested, Matches } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty({ message: 'Product ID (mkt) is required' })
  @IsString({ message: 'Product ID (mkt) must be a string' })
  mkt!: string;

  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  name!: string;

  @IsNotEmpty({ message: 'Price is required' })
  @IsString({ message: 'Price must be a string' })
  @Matches(/^₪\d+(\.\d+)?$/, { message: 'Price must be in format ₪XXX' }) 
  price!: `₪${number}`; // string as support ₪ format;

  @IsNotEmpty({ message: 'Quantity is required' })
  @IsInt({ message: 'Quantity must be an integer' })
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}

export class ShippingAddressDto {
  @IsNotEmpty({ message: 'Address is required' })
  @IsString({ message: 'Address must be a string' })
  address!: string;
}

export class CreateOrderDto {
  @IsArray({ message: 'Items must be an array' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];

  @IsObject({ message: 'Shipping address must be an object' })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;
}