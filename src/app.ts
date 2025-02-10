import server from "./server";

server.listen(process.env.PORT, () =>
  console.log("Server start in port: ", process.env.PORT)
);
