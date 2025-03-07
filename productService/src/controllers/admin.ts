import { Router } from "express";
import { GetProductsQueryDto } from "../dtos/getProductDto";
import { errorResponse, successResponse } from "../utils/responseHelper";
import { productService } from "../services/product.service";
import { ParamsTypeEnum } from "../types/request";
import { validateRequestMiddleware } from "../middlewares/validateRequest";


export const setupAdminProductsRoutes = (): Router => {
  const router = Router();

  router.get("/", validateRequestMiddleware(GetProductsQueryDto, ParamsTypeEnum.QUERY), async (req, res) => {
    const { limit, offset, isInStock } = req.query as GetProductsQueryDto;
    
    try {
      const products = await productService.getProducts(true, limit, offset, isInStock);
    
      res.json(successResponse(products));
    } catch (error: any) {
      res.status(500).json(errorResponse(error?.message || "Internal Server Error", 500));
    }
  });

  return router;
};
