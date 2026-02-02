import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import './LoginView.css';
import { useNotificationStore } from '../store/notificationStore';

const LoginView: React.FC = () => {
  const navigate = useNavigate();
  
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(identifier, password);
      addNotification(
        'success', 
        'Inicio de sesión exitoso!'
      );
      navigate('/home');
    } catch (err) {
      let message = 'Ocurrió un error intente de nuevo más tarde';
      if (err instanceof Error) {        
        message = err.message ? err.message : message;
      }
      addNotification('error', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h2>¡Bienvenido de nuevo!</h2>
          <p>Inicia sesión en tu cuenta</p>
        </div>
        <form onSubmit={handleLogin} className="login-form">
          <label htmlFor="identifier">Correo electrónico o Celular</label>
          <input
            type="text"
            id="identifier"
            placeholder=""
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            disabled={loading}
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          
          <button type="button" className="btn-secondary">
            <a href="/registro">Registrarse</a>
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginView;