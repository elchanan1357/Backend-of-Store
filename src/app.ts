import { config } from "./config/env";
import server from "./server";

server.listen(config.port, () =>
  console.log("Server start in port: ", config.port)
);
