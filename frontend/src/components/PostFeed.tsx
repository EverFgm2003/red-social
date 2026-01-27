import React, { useEffect } from 'react';
import { usePostStore } from '../store/postStore';
import PostCard from './PostCard';

const PostFeed: React.FC = () => {
  const { posts, loading, error, fetchPosts } = usePostStore();
  const POSTS_SERVICE_URL = process.env.REACT_APP_API_URL2;

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now.getTime() - postDate.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Hace un momento';
    if (diffInSeconds < 3600) return `Hace ${Math.floor(diffInSeconds / 60)} minutos`;
    if (diffInSeconds < 86400) return `Hace ${Math.floor(diffInSeconds / 3600)} horas`;
    if (diffInSeconds < 604800) return `Hace ${Math.floor(diffInSeconds / 86400)} días`;
    
    return postDate.toLocaleDateString();
  };

  if (loading && posts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>Cargando publicaciones...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '18px', color: '#ff4444' }}>❌ {error}</p>
        <button 
          onClick={fetchPosts}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            background: '#2575fc',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Intentar de nuevo
        </button>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <p style={{ fontSize: '18px', color: '#666' }}>
          📝 No hay publicaciones aún.<br/>
          ¡Sé el primero en compartir algo!
        </p>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          user={post.username.toUpperCase()}
          content={post.message}
          location=""
          likes={0}
          comments={0}
          image={post.image_url ? `${POSTS_SERVICE_URL}${post.image_url}` : ''}
          time={getTimeAgo(post.created_at)}
        />
      ))}
    </>
  );
};

export default PostFeed;