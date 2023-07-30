require("dotenv").config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { userRoutes, authenticationRoutes } from "./routes/v1";
import { User } from "./models";
import { errorHandler } from "./middlewares";

// Make user information accessible request life cycle
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

const PORT = process.env.PORT || 8080;
const API_VERSION = 1;
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(`/api/v${API_VERSION}/auth`, authenticationRoutes);
app.use(`/api/v${API_VERSION}/users`, userRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

export default app;
