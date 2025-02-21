import { getNumberEnv, getStringEnv } from "./env"

export const config = {
    port: getNumberEnv('PORT', 3000),
    sessionSecret: getStringEnv('SESSION_SECRET'),
    db: {
        connectionString: getStringEnv('DB_CONNECTION_URL', ''),
    },
    middelwareloggerFormat: getStringEnv('LOGGER_MIDDLEWARE_FORMAT', 'dev'),
    corsOrigin: getStringEnv('CORS_ORIGIN', '*'),
    authTokenKey: getStringEnv('AUTH_TOKEN_KEY', 'auth-token'),
    internalAccessToken: getStringEnv('INTERNAL_ACCESS_TOKEN'),
};
