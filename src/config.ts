require("dotenv").config();
const env = process.env;

const config = {
  database: {
    DB_USER: env.POSTGRES_USER || "postgres",
    DB_HOST: env.POSTGRES_HOST || "localhost",
    DB_NAME: env.POSTGRES_DB || "pafin",
    DB_PASSWORD: env.POSTGRES_PASSWORD || "postgres",
    DB_PORT: 5432,
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
