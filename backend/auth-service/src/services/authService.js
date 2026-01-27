"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const errors_1 = require("../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
class AuthService {
    async register(data) {
        const { username, password, first_name, last_name, email, phone } = data;
        if (!username || !password || !first_name || !last_name || !email || !phone) {
            throw new errors_1.ValidationError("Todos los campos son requeridos");
        }
        if (username.length < 3) {
            throw new errors_1.ValidationError("El username debe tener al menos 3 caracteres");
        }
        if (password.length < 6) {
            throw new errors_1.ValidationError("El password debe tener al menos 6 caracteres");
        }
        if (first_name.trim().length < 2) {
            throw new errors_1.ValidationError("El nombre debe tener al menos 2 caracteres");
        }
        if (last_name.trim().length < 2) {
            throw new errors_1.ValidationError("El apellido debe tener al menos 2 caracteres");
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            throw new errors_1.ValidationError("El email no tiene un formato válido");
        }
        const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
        const phoneRegex = /^\+?[0-9]{7,15}$/;
        if (!phoneRegex.test(cleanPhone)) {
            throw new errors_1.ValidationError("El teléfono no tiene un formato válido");
        }
        try {
            const hash = await bcrypt_1.default.hash(password, 10);
            const result = await db_1.pool.query(`INSERT INTO users (username, password, first_name, last_name, email, phone) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, username, first_name, last_name, email, phone, created_at`, [username, hash, first_name.trim(), last_name.trim(), email.toLowerCase(), cleanPhone]);
            return result.rows[0];
        }
        catch (error) {
            if (error.code === "23505") {
                if (error.constraint === "users_username_key") {
                    throw new errors_1.ConflictError("El username ya está registrado");
                }
                else if (error.constraint === "users_email_key") {
                    throw new errors_1.ConflictError("El email ya está registrado");
                }
                else if (error.constraint === "users_phone_key") {
                    throw new errors_1.ConflictError("El teléfono ya está registrado");
                }
                else {
                    throw new errors_1.ConflictError("El usuario ya existe");
                }
            }
            throw error;
        }
    }
    async login(data) {
        const { identifier, password } = data;
        if (!identifier || !password) {
            throw new errors_1.ValidationError("Email/teléfono y password son requeridos");
        }
        const cleanIdentifier = identifier.trim().toLowerCase();
        const cleanPhone = identifier.replace(/[\s\-\(\)]/g, '');
        const result = await db_1.pool.query("SELECT * FROM users WHERE email = $1 OR phone = $2", [cleanIdentifier, cleanPhone]);
        if (result.rows.length === 0) {
            throw new errors_1.NotFoundError("Usuario no encontrado");
        }
        const user = result.rows[0];
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            throw new errors_1.UnauthorizedError("Password incorrecta");
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });
        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                created_at: user.created_at,
            },
        };
    }
    async verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            const result = await db_1.pool.query("SELECT id, username, first_name, last_name, email, phone, created_at FROM users WHERE id = $1", [decoded.id]);
            if (result.rows.length === 0) {
                throw new errors_1.NotFoundError("Usuario no encontrado");
            }
            return result.rows[0];
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.UnauthorizedError("Token inválido");
            }
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.UnauthorizedError("Token expirado");
            }
            throw error;
        }
    }
}
exports.AuthService = AuthService;
