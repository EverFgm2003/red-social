import { useAuthStore } from '../store/authStore';

const API_URL = process.env.REACT_APP_API_URL;

interface LoginResponse {
  status: string;
  data: {
    token: string;
    user: {
      id: number;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
    };
  };
}

interface RegisterData {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
}

interface ErrorResponse {
  status: string;
  message: string;
}

export const login = async (identifier: string, password: string): Promise<LoginResponse['data']> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const data: LoginResponse | ErrorResponse = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Error al iniciar sesión');
    }

    const loginData = (data as LoginResponse).data;
    
    // Guardar en Zustand
    useAuthStore.getState().setAuth(loginData.token, loginData.user);

    return loginData;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

export const register = async (userData: RegisterData): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    const data: { status: string; data?: any } | ErrorResponse = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Error al registrarse');
    }
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};

export const logout = (): void => {
  useAuthStore.getState().logout();
};

export const getToken = (): string | null => {
  return useAuthStore.getState().token;
};

export const getUser = () => {
  return useAuthStore.getState().user;
};

export const isAuthenticated = (): boolean => {
  return useAuthStore.getState().isAuthenticated;
};