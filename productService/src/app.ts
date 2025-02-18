import dotenv from "dotenv";
dotenv.config();

const main = async () => {
   
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

