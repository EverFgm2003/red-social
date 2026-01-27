import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService';
import './RegisterView.css';
import { useNotificationStore } from '../store/notificationStore';

const RegisterView: React.FC = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const addNotification = useNotificationStore((state) => state.addNotification);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    console.log(error);
    
    errorAlert(error);
  },[error])

  const errorAlert=(mensaje:string)=>{
    if (!mensaje || mensaje == '') return;
    addNotification(
      'error', 
      mensaje
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (!phone.match(/^\+?[0-9]{7,15}$/)) {
      setError('El teléfono debe tener un formato válido (ejemplo: 3001234567)');
      return;
    }

    setLoading(true);

    try {
      await register({
        username: firstName + " " + lastName,
        password,
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
      });
 
      addNotification(
        'success', 
        'Usuario registrado correctamente'
      );
      navigate('/login');   
      
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
    <div className="register-container">
      <div className="register-box">
        <h2>Registro</h2>
        <form onSubmit={handleRegister} className="register-form">

          <label htmlFor="firstName">Nombre</label>
          <input
            type="text"
            id="firstName"
            placeholder="Juan"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            minLength={2}
          />

          <label htmlFor="lastName">Apellido</label>
          <input
            type="text"
            id="lastName"
            placeholder="Pérez"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            minLength={2}
          />

          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            placeholder="tucorreo@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="phone">Teléfono</label>
          <input
            type="tel"
            id="phone"
            placeholder="3001234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <label htmlFor="confirmPassword">Confirmar contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            placeholder="********"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <button 
            type="submit" 
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>
        
        <div className="login-redirect">
          ¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;