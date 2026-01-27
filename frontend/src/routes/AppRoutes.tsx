import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginView from '../views/LoginView';
import RegisterView from '../views/RegisterView';
import HomeView from '../views/HomeView';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/registro" element={<RegisterView />} />
        <Route path="/home" element={<HomeView />} />
    </Routes>
  );
};

export default AppRoutes;
