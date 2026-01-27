"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const authService_1 = require("../services/authService");
const authService = new authService_1.AuthService();
class AuthController {
    /**
     * POST /auth/register
     */
    async register(req, res, next) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                status: "success",
                data: user,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /auth/login
     */
    async login(req, res, next) {
        try {
            const result = await authService.login(req.body);
            res.json({
                status: "success",
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * GET /auth/verify
     * Verifica el token del usuario autenticado
     */
    async verify(req, res, next) {
        try {
            // El middleware authenticate ya validó el token y agregó req.user
            res.json({
                status: "success",
                data: {
                    user: req.user,
                },
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * POST /auth/verify-token
     * Endpoint para que otros microservicios verifiquen tokens
     */
    async verifyToken(req, res, next) {
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
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AuthController = AuthController;
