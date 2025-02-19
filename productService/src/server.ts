import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { setupProductsRoutes } from "./controllers/products";
import { config } from "./utils/config";
import { notFoundMiddleware } from "./middlewares/notFound";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";
import { setupAdminProductsRoutes } from "./controllers/admin";
import { authMiddleware } from "./middlewares/auth";
import { rolesMiddleware } from "./middlewares/role";
import { Role } from "./types/user";

export const createHttpServer = () => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({ 
      origin: config.corsOrigin 
    })
  );
  app.use(morgan(config.middelwareloggerFormat));
  app.use(express.urlencoded({ extended: true }));
  
  app.use("/products", setupProductsRoutes());
  app.use("/admin/products", authMiddleware, rolesMiddleware([Role.Admin]), setupAdminProductsRoutes());
  
  // must be after all routes for catch all unmatched routes
  app.use(notFoundMiddleware);
  
  // must be after all routes for catch errors
  app.use(errorHandlerMiddleware);
  

  return app;
}
