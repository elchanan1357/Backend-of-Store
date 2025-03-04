import { config } from "./utils/config";
import server from "./server";

server.listen(config.port, () =>
  console.log("Server start in port: ", config.port)
);
