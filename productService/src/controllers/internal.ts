import { Router } from "express";
import { errorResponse, successResponse } from "../utils/responseHelper";
import { UpdateProductsStockBodyDto } from "../dtos/updateProductsStock";
import { validateRequestMiddleware } from "../middlewares/validateRequest";
import { ParamsTypeEnum } from "../types/request";


export const setupInternalProductsRoutes = (): Router => {
  const router = Router();

  router.put("/stocks", validateRequestMiddleware(UpdateProductsStockBodyDto, ParamsTypeEnum.BODY), async (req, res) => {    
    try {
      // async fun 
      res.json(successResponse());
    } catch (error: any) {
        const { message, status, mkts } = error || {};
      res.status(status || 500).json(errorResponse(message || "Internal Server Error", status || 500, { WrongMkts: mkts || []}));
    }
  });

  return router;
};
