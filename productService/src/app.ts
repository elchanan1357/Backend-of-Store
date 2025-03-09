import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();

import { config } from "./utils/config";
import { mongoProvider } from "./providers/mongo.provider";
import { createHttpServer } from "./server";

const { port } = config;

const main = async () => {
  try {
    await mongoProvider.connect();

    createHttpServer().listen(port, () => {
      console.log(`Server running on ${port}`);
    });
  } catch (error) {
      console.error('Failed to start:', error);
  }       
}

const cleanup = async (exitCode: number = 0) => {
  try {
    await mongoProvider.disconnect();
  } catch (error) {
    console.error('Failed to disconnect from Mongo: ', error);
  } finally {
    process.exit(exitCode);
  }
}

process.on('SIGINT', () => {
    cleanup(0);
});

process.on('SIGTERM', () => {
    cleanup(0);
})

main();
