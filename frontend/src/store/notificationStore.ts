import { create } from 'zustand';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (type: Notification['type'], message: string) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  
  addNotification: (type, message) => {
    const id = Date.now().toString();
    set((state) => ({
      notifications: [...state.notifications, { id, type, message }]
    }));
    
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      }));
    }, 4000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
}));