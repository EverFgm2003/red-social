import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/authService";

const authService = new AuthService();

export class AuthController {
  /**
   * POST /auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);
      res.status(201).json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      res.json({
        status: "success",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /auth/verify
   * Verifica el token del usuario autenticado
   */
  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      // El middleware authenticate ya validó el token y agregó req.user
      res.json({
        status: "success",
        data: {
          user: req.user,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /auth/verify-token
   * Endpoint para que otros microservicios verifiquen tokens
   */
  async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({
          status: "error",
          message: "Token requerido",
        });
      }

      const user = await authService.verifyToken(token);
      res.json({
        status: "success",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}