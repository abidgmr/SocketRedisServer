import { Request, Response, NextFunction } from "express";
import UnauthorizedError from "../exceptions/unauthorized-error";

const clientIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientId = String(req.headers["clientid"] || "");
  const _clientId = process.env.CLIENT_ID;

  if (!clientId) {
    throw new UnauthorizedError("ClientId header is missing");
  }

  if (clientId !== _clientId) {
    throw new UnauthorizedError("Invalid Client Id");
  }

  req.clientId = clientId;
  next();
};

export default clientIdMiddleware;
