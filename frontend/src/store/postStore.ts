import { create } from 'zustand';
import { getAllPosts } from '../services/postService';

interface Post {
  id: number;
  user_id: number;
  username: string;
  message: string;
  image_url: string | null;
  created_at: string;
}

interface PostStore {
  posts: Post[];
  loading: boolean;
  error: string;
  fetchPosts: () => Promise<void>;
  addPost: (post: Post) => void;
  clearError: () => void;
}

export const usePostStore = create<PostStore>((set) => ({
  posts: [],
  loading: false,
  error: '',

  fetchPosts: async () => {
    set({ loading: true, error: '' });
    try {
      const postsData = await getAllPosts();
      set({ posts: postsData, loading: false });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar publicaciones';
      set({ error: errorMessage, loading: false });
    }
  },

  addPost: (post) => {
    set((state) => ({ 
      posts: [post, ...state.posts] 
    }));
  },

  clearError: () => set({ error: '' }),
}));