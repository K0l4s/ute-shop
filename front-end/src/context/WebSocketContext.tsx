import React, { createContext, useContext, useEffect, useState } from 'react';
import { NotificationMessage } from '../models/type';
import { getNotifications, readAllNotifications } from '../apis/notification';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';

interface WebSocketContextType {
  socket: WebSocket | null;
  notifications: NotificationMessage[];
  unreadCount: number;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationMessage[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: (limit: number, offset: number) => Promise<{ hasMore: boolean; unreadCount: number }>;
  clearNotifications: () => void;
  markAllAsRead: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    if (!user?.id) {
      console.error('No userId provided');
      return;
    }

    const newSocket = new WebSocket(`ws://localhost:8080?userId=${user?.id}`);
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connected!");
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onmessage = (event: MessageEvent) => {
      // console.log('Received message from WebSocket:', event.data);
      const newNotification: NotificationMessage = JSON.parse(event.data);
      const notification: NotificationMessage = typeof newNotification.message === 'object' ? newNotification.message : newNotification;
      
      // Log dữ liệu nhận được từ WebSocket
      // console.log('New notification from WebSocket:', notification);
      setNotifications((prevNotifications) => {
        const updatedNotifications = [notification, ...prevNotifications];
        const unreadCountFromLocalStorage = parseInt(localStorage.getItem('unreadCount') ?? '0') + 1;
        setUnreadCount(unreadCountFromLocalStorage);
        return updatedNotifications;
      });

      // const unreadCount = [newNotification, ...notifications].filter(n => !n.is_read).length;
      // setUnreadCount(unreadCount);
    };

    return () => {
      newSocket.close();
    };
  }, [user?.id]);

  const fetchNotifications = async (limit: number, offset: number) => {
    try {
      const { notifications, unreadCount }  = await getNotifications(limit, offset);
      localStorage.setItem('unreadCount', unreadCount.toString());

      if (notifications.length === 0) {
        return { hasMore: false, unreadCount: 0 };
      }

      setNotifications((prevNotifications) => {
        const newNotifications = notifications.filter((newNotification: any) => 
          !prevNotifications.some(notification => notification.id === newNotification.id)
        );
        
        const updatedNotifications = [...prevNotifications, ...newNotifications];
        // Log danh sách thông báo sau khi gọi API
        // console.log('Updated notifications from API:', updatedNotifications);
        return updatedNotifications;
      });

      // const unreadCount = data.filter((notification: NotificationMessage) => !notification.is_read).length;
      setUnreadCount(unreadCount);

      return { hasMore: true, unreadCount: unreadCount };
    } catch (error) {
      console.error("Failed to get notifications", error);
      return { hasMore: false, unreadCount: 0 };
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const markAllAsRead = async () => {
    try {
      await readAllNotifications();
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, notifications, unreadCount, setNotifications, setUnreadCount, fetchNotifications, clearNotifications, markAllAsRead }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};