import mongoose from 'mongoose';
import { GetProductsByCategoryResponseDto } from '../dtos/getProductsByCategories';
import { ProductStocksResponseDto } from '../dtos/getProductsStock';
import { ProductModel, ProductSelect } from '../models/product.model';
import { ProductCategory, Product } from '../types/product';
import { UpdateDetail } from '../dtos/updateProductsStock';
import { ProductsNotExistError, ProductsNotInStockError } from '../utils/errors';
import { ProdectsByMktsResponseDto } from '../dtos/getProdectsByMkts';

class ProductService {
  async getProductsByCategories(categories: ProductCategory[], offset: number = 0, limit?: number, isInStock?: boolean) {
    const productsByCategory = await ProductModel.aggregate<{ category: ProductCategory, products: Product[]}>([
        {
          $match: { 
            category: { $in: categories },
            ...(isInStock ? { stock: { $gt: 0 } } : {})
          },
        },
        {
          $group: {
            _id: "$category",
            products: {
              $push: {
                name: "$name",
                price: "$price",
                description: "$description",
                img: "$img",
                mkt: "$mkt",
                logo: "$logo",
                company: "$company",
                color: "$color",
              }
            }
          }
        },
        {
          $project: {
            _id: 0,
            category: "$_id",
            products: {
              $slice: ["$products", offset, limit || { $size: "$products" }]
            }
          }
        }
    ]);
      
    return productsByCategory.reduce((acc: GetProductsByCategoryResponseDto, currProduct) => {
        const { category, products } = currProduct;
        acc[category] = products;

        return acc;
    }, {} as GetProductsByCategoryResponseDto);
  }

  private getProductsSelect(isAdmin: boolean) {
    let select: ProductSelect = { 
        img: 1,
        price: 1,
        name: 1,
        description: 1,
        mkt: 1,
        _id: 1,
        logo: 1,
        company: 1,
        color: 1,
    };

    if (isAdmin) {
      select.stock = 1;
    }

    return select;
  }

  async getProducts(isAdmin: boolean, limit?: number, offset?: number, isInStock?: boolean) {
    const select = this.getProductsSelect(isAdmin);

    let query = ProductModel.find().select(select);

    if (isInStock) {
      query = query.where("stock").gt(0)
    }

    if (offset) {
      query = query.skip(offset);
    }

    if (limit) {
      query = query.limit(limit);
    }

    return await query;;
  }
   
  async getProductStocksByMkt(mktValues: string[]) {
    const products = await ProductModel.find({ mkt: { $in: mktValues } })

    return products.reduce((acc: ProductStocksResponseDto, currProdect) => {
        acc[currProdect.mkt] = currProdect.stock;
        return acc;
    }, {} as ProductStocksResponseDto);
  }

  async updateProductStock(updateDetails: UpdateDetail[]) {
    const session = await mongoose.startSession();
    session.startTransaction();
  
    try {
      const updateDetailsObj = this.convertUpdateDetailsToObject(updateDetails);
      const mktValues = Object.keys(updateDetailsObj);
      const foundProducts = await ProductModel.find({ mkt: { $in: mktValues } }).session(session);
  
      this.validateStocks(foundProducts, updateDetailsObj, mktValues);
      
      const bulkUpdates = foundProducts.map((product) => ({
        updateOne: {
          filter: { mkt: product?.mkt },
          update: { 
            $inc: { stock: -updateDetailsObj[product?.mkt] }
          }
        }
      }));
  
      await ProductModel.bulkWrite(bulkUpdates, { session });
  
      await session.commitTransaction();
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
  }

  private convertUpdateDetailsToObject(updateDetails: UpdateDetail[]) {
    return updateDetails.reduce((acc, curr) => {
      acc[curr.mkt] = curr.quantity;
      return acc;
    }, {} as Record<string, number>);
  }

  private validateStocks(products: Product[], updateDetailsObj: Record<string, number>, mktValues: string[]) {
    if (products.length !== mktValues.length) {
      const notFoundMkts = mktValues.filter((mkt) => !products.some((product) => product.mkt === mkt));
      throw new ProductsNotExistError(notFoundMkts);
    }

    let notInStockMkts = products.filter((product) => {
      const requestedQuantity = updateDetailsObj[product.mkt];

      return product.stock < requestedQuantity;
    }).map((product) => product.mkt);

    if (notInStockMkts.length) {
      throw new ProductsNotInStockError(notInStockMkts);
    }
  }

  async getProductsByMkts(mkts: string[]): Promise<ProdectsByMktsResponseDto> {
    const products = await ProductModel.find({ mkt: { $in: mkts } })
      .select("-_id -stock")
      .lean();

    return products.reduce((acc: ProdectsByMktsResponseDto, product) => {
      const { mkt, ...rest } = product;
      acc[mkt] = rest;
      return acc;
    }, {} as ProdectsByMktsResponseDto);
  }
}

export const productService = new ProductService();