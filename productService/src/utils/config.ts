import { getNumberEnv, getStringEnv } from "./env"

export const config = {
    port: getNumberEnv('PORT', 3000),
    db: {
        connectionString: getStringEnv('DB_CONNECTION_URL', ''),
    },
    middelwareloggerFormat: getStringEnv('LOGGER_MIDDLEWARE_FORMAT', 'dev'),
    corsOrigin: getStringEnv('CORS_ORIGIN', '*'),
    internalAccessToken: getStringEnv('INTERNAL_ACCESS_TOKEN'),
    authToken: {
        tokenKey: getStringEnv('AUTH_TOKEN_KEY', 'auth-token'),
        expiresInMs: getNumberEnv('AUTH_TOKEN_EXPIRES_IN_MS', 1000 * 60 * 60),
        sessionSecret: getStringEnv('SESSION_SECRET'),
    }
};
