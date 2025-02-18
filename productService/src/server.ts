import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

export const createHttpServer = () => {
  const app = express();

  app.use(cookieParser());
  app.use(express.json());
  app.use(cors({ 
      origin: "*"
    })
  );
  app.use(morgan("dev"));
  app.use(express.urlencoded({ extended: true }));

  return app;
}



