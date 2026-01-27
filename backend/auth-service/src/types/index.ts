export interface User {
  id: number;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: Date;
}

export interface UserResponse {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  created_at: Date;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

export interface LoginResponse {
  token: string;
  user: UserResponse;
}

export interface JWTPayload {
  id: number;
  username: string;
}