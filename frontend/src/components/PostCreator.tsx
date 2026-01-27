import React, { useState, useRef } from 'react';
import { createPost } from '../services/postService';
import { useAuthStore } from '../store/authStore';
import { usePostStore } from '../store/postStore';
import { useNotificationStore } from '../store/notificationStore';
import './PostCreator.css';

const PostCreator: React.FC = () => {
    const [message, setMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const user = useAuthStore((state) => state.user);
    const addPost = usePostStore((state) => state.addPost);
    const addNotification = useNotificationStore((state) => state.addNotification);

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        setError('');
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
        fileInputRef.current.value = '';
        }
    };

    const handlePublish = async () => {
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
            const newPost = await createPost(message.trim(), selectedImage);
            addPost(newPost);
            addNotification(
                'success', 
                '¡Publicación creada exitosamente!'
            );            
            setMessage('');
            setSelectedImage(null);
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (err) {
            addNotification(
                'error', 
                'Error al crear la publicación'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="post-creator">
        {error && (
            <div className="error-message">
            {error}
            </div>
        )}

        <textarea 
            placeholder={`¿Qué estás pensando, ${user?.first_name || 'Usuario'}?`}
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
            <button 
            onClick={handleImageClick}
            disabled={loading}
            type="button"
            >
            📷 Foto
            </button>
            
            <button 
            className="publish-btn"
            onClick={handlePublish}
            disabled={loading || (!message.trim() && !selectedImage)}
            >
            {loading ? 'Publicando...' : 'Publicar'}
            </button>
        </div>
        </div>
    );
};

export default PostCreator;