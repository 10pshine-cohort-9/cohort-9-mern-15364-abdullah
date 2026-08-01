import pinoHttp from "pino-http";
import logger from "../config/logger.js";

const loggerMiddleware = pinoHttp({
  logger,
});

export default loggerMiddleware;