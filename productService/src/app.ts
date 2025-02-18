import dotenv from "dotenv";
dotenv.config();

import { createHttpServer } from "./server";

const port = 3000

const main = async () => {
  createHttpServer().listen(port, () => {
    console.log(`Server running on ${port}`);
  });    
}

const cleanup = async (exitCode: number = 0) => {
  process.exit(exitCode);
}

process.on('SIGINT', () => {
    cleanup(0);
});

process.on('SIGTERM', () => {
    cleanup(0);
})

main();

