import React from 'react';
import { useNotificationStore } from '../store/notificationStore';
import './NotificationList.css';

const NotificationList: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications);
  const removeNotification = useNotificationStore((state) => state.removeNotification);

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.message}
          <button onClick={() => removeNotification(n.id)}>✕</button>
        </div>
      ))}
    </div>
  );
};

export default NotificationList;
