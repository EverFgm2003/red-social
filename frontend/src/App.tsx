import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import NotificationList from './components/NotificationList';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
      <NotificationList />
    </BrowserRouter>
  );
};

export default App;
