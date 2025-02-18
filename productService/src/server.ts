import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { config } from "./utils/config";
import { notFoundMiddleware } from "./middlewares/notFound";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";


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
  
  // must be after all routes for catch all unmatched routes
  app.use(notFoundMiddleware);
  
  // must be after all routes for catch errors
  app.use(errorHandlerMiddleware);
  
  return app;
}
