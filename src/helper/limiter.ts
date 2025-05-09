import rateLimit, {
  RateLimitRequestHandler,
  Options as RateLimitOptions,
} from "express-rate-limit";
import { Request, Response, NextFunction } from "express";
import CustomError from "../exceptions/custom-error";

// Rate limiter to avoid misuse of the service and avoid cost spikes
const limiter: RateLimitRequestHandler = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers

  keyGenerator: (req: Request): string => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (req as any).clientIp; // If you're using request-ip middleware
  },

  handler: (
    _req: Request,
    _res: Response,
    _next: NextFunction,
    options: RateLimitOptions
  ): void => {
    throw new CustomError(
      `There are too many requests. You are only allowed ${
        options.limit
      } requests per ${options.windowMs / 60000} minutes`,
      500
    );
  },
});

export default limiter;
