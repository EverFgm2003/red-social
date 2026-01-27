import { getToken,logout } from './authService';

const POSTS_SERVICE_URL = process.env.REACT_APP_API_URL2;

interface CreatePostResponse {
  status: string;
  data: {
    id: number;
    user_id: number;
    username: string;
    message: string;
    image_url: string | null;
    created_at: string;
  };
}

interface ErrorResponse {
  status: string;
  message: string;
}


export const createPost = async (
  message: string,
  image: File | null
): Promise<CreatePostResponse['data']> => {
  try {
    const token = getToken();
    if (!token) {
      logout();
      throw new Error('No estás autenticado. Por favor inicia sesión.');
    }

    const formData = new FormData();
    formData.append('message', message);
    
    if (image) {
      formData.append('image', image);
    }

    const response = await fetch(`${POSTS_SERVICE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data: CreatePostResponse | ErrorResponse = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).message || 'Error al crear publicación');
    }

    return (data as CreatePostResponse).data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};


export const getAllPosts = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${POSTS_SERVICE_URL}/posts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener publicaciones');
    }

    return data.data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Error de conexión con el servidor');
  }
};