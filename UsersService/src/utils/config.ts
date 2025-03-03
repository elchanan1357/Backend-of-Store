import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  access_token: process.env.ACCESS_TOKEN_SECRET,
  token_expiration: process.env.TOKEN_EXPIRATION,
  auth_token_key: process.env.AUTH_TOKEN_KEY,
};
