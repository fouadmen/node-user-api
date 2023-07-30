require("dotenv").config();
const env = process.env;

const config = {
  database: {
    DB_USER: env.PG_USER || "postgres",
    DB_HOST: env.PG_HOST || "localhost",
    DB_NAME: env.PG_DB || "pafin",
    DB_PASSWORD: env.PG_PWD || "postgres",
    DB_PORT: env.PG_PORT ? parseInt(env.PG_PORT) : 5432,
  },
  jwt: {
    JWT_SECRET_KEY: env.JWT_SECRET,
    JWT_TOKEN_DURATION: "6h",
  },
  pagination: {
    defaultLimit: 10,
  },
};

export default config;
