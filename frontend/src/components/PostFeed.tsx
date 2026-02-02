import React, { useEffect, useState } from 'react';
import { usePostStore } from '../store/postStore';
import { useAuthStore } from '../store/authStore';
import PostCard from './PostCard';
import PostCreator from './PostCreator';

interface Post {
  id: number;
  user_id: number;
  username: string;
  message: string;
  image_url: string | null;
  created_at: string;
}

const PostFeed: React.FC = () => {
  const { posts, loading, error, fetchPosts } = usePostStore();
  const user = useAuthStore((state) => state.user);
  const [postEditing, setPostEditing] = useState<Post | null>(null);
  const POSTS_SERVICE_URL = process.env.REACT_APP_API_URL2;

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diff = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diff < 60) return 'Hace un momento';
    if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`;
    if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
    if (diff < 604800) return `Hace ${Math.floor(diff / 86400)} días`;

    return postDate.toLocaleDateString();
  };

  if (loading && posts.length === 0) return <p>Cargando publicaciones...</p>;

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button onClick={fetchPosts}>Intentar de nuevo</button>
      </div>
    );
  }

  return (
    <>
      {postEditing && (
        <PostCreator
          mode="edit"
          postToEdit={{
            id: postEditing.id,
            message: postEditing.message,
            image_url: postEditing.image_url || undefined
          }}
          onFinish={() => setPostEditing(null)}
        />
      )}

      {posts.map((post) => {
        const canEdit = user?.id === post.user_id;

        return (
          <PostCard
            key={post.id}
            user={post.username.toUpperCase()}
            content={post.message}
            image={post.image_url ? `${POSTS_SERVICE_URL}${post.image_url}` : ''}
            time={getTimeAgo(post.created_at)}
            canEdit={canEdit}
            onEdit={() => setPostEditing(post)}
          />
        );
      })}
    </>
  );
};

export default PostFeed;
