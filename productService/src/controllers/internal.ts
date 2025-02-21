import { Router } from "express";
import { errorResponse, successResponse } from "../utils/responseHelper";
import { productService } from "../services/product.service";
import { UpdateProductsStockBodyDto } from "../dtos/updateProductsStock";
import { validateRequestMiddleware } from "../middlewares/validateRequest";
import { ParamsTypeEnum } from "../types/request";


export const setupInternalProductsRoutes = (): Router => {
  const router = Router();

  router.put("/stocks", validateRequestMiddleware(UpdateProductsStockBodyDto, ParamsTypeEnum.BODY), async (req, res) => {
    const { updateDetails } = req.body as UpdateProductsStockBodyDto;
    
    try {
      await productService.updateProductStock(updateDetails);

      res.json(successResponse());
    } catch (error: any) {
        const { message, status, mkts } = error || {};
      res.status(status || 500).json(errorResponse(message || "Internal Server Error", status || 500, { WrongMkts: mkts || []}));
    }
  });

  return router;
};
