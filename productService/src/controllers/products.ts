import { Router } from "express";
import { errorResponse, successResponse } from "../utils/responseHelper";
import { productService } from "../services/product.service";
import { GetProductsByCategoriesQueryDto } from "../dtos/getProductsByCategories";
import { ProductStocksQueryDto } from "../dtos/getProductsStock";
import { GetProductsQueryDto } from "../dtos/getProductDto";
import { validateRequestMiddleware } from "../middlewares/validateRequest";
import { ParamsTypeEnum } from "../types/request";


export const setupProductsRoutes = (): Router => {
  const router = Router();

  router.get("/categories", validateRequestMiddleware(GetProductsByCategoriesQueryDto, ParamsTypeEnum.QUERY), async (req, res) => {
    const { categories, limit, offset } = req.query as unknown as GetProductsByCategoriesQueryDto;
    
    try {
      const productsByCategory = {}
    
      res.json(successResponse(productsByCategory));
    } catch (error: any) {
      res.status(500).json(errorResponse(error?.message || "Internal Server Error", 500));
    }
  });
  
  router.get("/", validateRequestMiddleware(GetProductsQueryDto, ParamsTypeEnum.QUERY), async (req, res) => {
    const { limit, offset } = req.query as GetProductsQueryDto;
    
    try {
      const products: any = [];
    
      res.json(successResponse(products));
    } catch (error: any) {
      res.status(500).json(errorResponse(error?.message || "Internal Server Error", 500));
    }
  });

  router.get("/stocks", validateRequestMiddleware(ProductStocksQueryDto, ParamsTypeEnum.QUERY), async (req, res) => {
    const { mkts } = req.query as unknown as ProductStocksQueryDto;

    try {
      const productStocks = await productService.getProductStocksByMkt(mkts);
      return res.json(productStocks);
    } catch (error: any) {
      return res.status(500).json(errorResponse(error?.message || "Internal Server Error", 500));
    }
  });

  return router;
};
