import React, { useState, useRef, useEffect } from 'react';
import { createPost, updatePost } from '../services/postService';
import { useAuthStore } from '../store/authStore';
import { usePostStore } from '../store/postStore';
import { useNotificationStore } from '../store/notificationStore';
import './PostCreator.css';

interface PostCreatorProps {
  mode?: 'create' | 'edit';
  postToEdit?: {
    id: number;
    message: string;
    image_url?: string;
  };
  onFinish?: () => void;
}

const PostCreator: React.FC<PostCreatorProps> = ({
  mode = 'create',
  postToEdit,
  onFinish
}) => {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const user = useAuthStore((state) => state.user);
  const addPost = usePostStore((state) => state.addPost);
  const updatePostInStore = usePostStore((state) => state.updatePost);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (mode === 'edit' && postToEdit) {
      setMessage(postToEdit.message);
      setImagePreview(postToEdit.image_url || null);
    }
  }, [mode, postToEdit]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona solo imágenes');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB');
      return;
    }

    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setError('');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!message.trim() && !selectedImage) {
      setError('Escribe algo o selecciona una imagen');
      return;
    }

    if (message.trim().length > 5000) {
      setError('El mensaje es muy largo (máximo 5000 caracteres)');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (mode === 'edit' && postToEdit) {
        console.log(postToEdit);
        
        const updatedPost = await updatePost(
          postToEdit.id,
          message.trim(),
          selectedImage
        );
        updatePostInStore(updatedPost);
        addNotification('success', 'Publicación actualizada');
      } else {
        const newPost = await createPost(message.trim(), selectedImage);
        addPost(newPost);
        addNotification('success', 'Publicación creada');
      }

      setMessage('');
      setSelectedImage(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      onFinish?.();
    } catch {
      addNotification('error', 'Error al guardar la publicación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-creator">
      {error && <div className="error-message">{error}</div>}

      <textarea
        placeholder={
          mode === 'edit'
            ? 'Edita tu publicación...'
            : `¿Qué estás pensando, ${user?.first_name || 'Usuario'}?`
        }
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={loading}
        rows={3}
      />

      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
          <button
            className="remove-image-btn"
            onClick={handleRemoveImage}
            type="button"
          >
            ✕
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />

      <div className="post-actions">
        <button onClick={handleImageClick} disabled={loading} type="button">
          📷 Foto
        </button>

        <button
          className="publish-btn"
          onClick={handleSubmit}
          disabled={loading || (!message.trim() && !selectedImage)}
        >
          {loading
            ? 'Guardando...'
            : mode === 'edit'
            ? 'Guardar cambios'
            : 'Publicar'}
        </button>
      </div>
    </div>
  );
};

export default PostCreator;
