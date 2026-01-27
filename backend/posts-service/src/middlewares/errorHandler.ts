import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.message.includes("Solo se permiten imágenes")) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.message.includes("File too large")) {
    return res.status(400).json({
      status: "error",
      message: "La imagen es muy grande. Máximo 5MB",
    });
  }

  return res.status(500).json({
    status: "error",
    message: "Error interno del servidor",
  });
};