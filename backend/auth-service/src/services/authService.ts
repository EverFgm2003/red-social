import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db";
import {
  User,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
} from "../types";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} from "../utils/errors";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

export class AuthService {

  async register(data: RegisterRequest): Promise<UserResponse> {
    const { username, password, first_name, last_name, email, phone } = data;

    if (!username || !password || !first_name || !last_name || !email || !phone) {
      throw new ValidationError("Todos los campos son requeridos");
    }

    if (username.length < 3) {
      throw new ValidationError("El username debe tener al menos 3 caracteres");
    }

    if (password.length < 6) {
      throw new ValidationError("El password debe tener al menos 6 caracteres");
    }

    if (first_name.trim().length < 2) {
      throw new ValidationError("El nombre debe tener al menos 2 caracteres");
    }

    if (last_name.trim().length < 2) {
      throw new ValidationError("El apellido debe tener al menos 2 caracteres");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ValidationError("El email no tiene un formato válido");
    }

    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      throw new ValidationError("El teléfono no tiene un formato válido");
    }

    try {
      const hash = await bcrypt.hash(password, 10);

      const result = await pool.query<User>(
        `INSERT INTO users (username, password, first_name, last_name, email, phone) 
         VALUES ($1, $2, $3, $4, $5, $6) 
         RETURNING id, username, first_name, last_name, email, phone, created_at`,
        [username, hash, first_name.trim(), last_name.trim(), email.toLowerCase(), cleanPhone]
      );

      return result.rows[0];
    } catch (error: any) {
      if (error.code === "23505") {
        if (error.constraint === "users_username_key") {
          throw new ConflictError("El username ya está registrado");
        } else if (error.constraint === "users_email_key") {
          throw new ConflictError("El email ya está registrado");
        } else if (error.constraint === "users_phone_key") {
          throw new ConflictError("El teléfono ya está registrado");
        } else {
          throw new ConflictError("El usuario ya existe");
        }
      }
      throw error;
    }
  }


  async login(data: LoginRequest): Promise<LoginResponse> {
    const { identifier, password } = data;

    if (!identifier || !password) {
      throw new ValidationError("Email/teléfono y password son requeridos");
    }

    const cleanIdentifier = identifier.trim().toLowerCase();

    const cleanPhone = identifier.replace(/[\s\-\(\)]/g, '');

    const result = await pool.query<User>(
      "SELECT * FROM users WHERE email = $1 OR phone = $2",
      [cleanIdentifier, cleanPhone]
    );

    if (result.rows.length === 0) {
      throw new NotFoundError("Usuario no encontrado");
    }

    const user = result.rows[0];

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedError("Password incorrecta");
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

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

  async verifyToken(token: string): Promise<UserResponse> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; username: string };

      const result = await pool.query<User>(
        "SELECT id, username, first_name, last_name, email, phone, created_at FROM users WHERE id = $1",
        [decoded.id]
      );

      if (result.rows.length === 0) {
        throw new NotFoundError("Usuario no encontrado");
      }

      return result.rows[0];
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError("Token inválido");
      }
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError("Token expirado");
      }
      throw error;
    }
  }
}