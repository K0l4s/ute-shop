import React, { createContext, useContext, useEffect, useState } from 'react';
import { NotificationMessage } from '../models/type';
import { getNotifications } from '../apis/notification';

interface WebSocketContextType {
  socket: WebSocket | null;
  notifications: NotificationMessage[];
  unreadCount: number;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationMessage[]>>;
  setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
  fetchNotifications: (limit: number, offset: number) => Promise<{ hasMore: boolean; unreadCount: number }>;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const newSocket = new WebSocket('ws://localhost:8080');
    setSocket(newSocket);

    newSocket.onopen = () => {
      console.log("WebSocket connected!");
    };

    newSocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    newSocket.onmessage = (event: MessageEvent) => {
      console.log('Received message from WebSocket:', event.data);
      const newNotification: NotificationMessage = JSON.parse(event.data);

      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);

      const unreadCount = [newNotification, ...notifications].filter(n => !n.is_read).length;
      setUnreadCount(unreadCount);
    };

    return () => {
      newSocket.close();
    };
  }, []);

  const fetchNotifications = async (limit: number, offset: number) => {
    try {
      const { notifications, unreadCount }  = await getNotifications(limit, offset);

      if (notifications.length === 0) {
        return { hasMore: false, unreadCount: 0 };
      }

      setNotifications((prevNotifications) => {
        const newNotifications = notifications.filter((newNotification: any) => 
          !prevNotifications.some(notification => notification.id === newNotification.id)
        );
        return [...prevNotifications, ...newNotifications];
      });

      // const unreadCount = data.filter((notification: NotificationMessage) => !notification.is_read).length;
      setUnreadCount(unreadCount);

      return { hasMore: true, unreadCount: unreadCount };
    } catch (error) {
      console.error("Failed to get notifications", error);
      return { hasMore: false, unreadCount: 0 };
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, notifications, unreadCount, setNotifications, setUnreadCount, fetchNotifications }}>
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