import React, { useEffect, useState } from 'react';
import { getNotifications } from '../../apis/notification';
import { FiPackage, FiTag } from 'react-icons/fi'; // Icons for order update and promotion
import { formatDistanceToNow } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { Link } from 'react-router-dom';
import { NotificationMessage } from '../../models/type';

const Notification: React.FC<{ setUnreadCount: (count: number) => void }> = ({ setUnreadCount }) => {
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  const translations = {
    "less than a minute ago": "Vừa xong",
    "in about": "khoảng",
    about: "khoảng",
    less: "ít hơn",
    over: "hơn",
    almost: "gần",
    seconds: "giây",
    minute: "phút",
    minutes: "phút",
    hour: "giờ",
    hours: "giờ",
    day: "ngày",
    days: "ngày",
    month: "tháng",
    months: "tháng",
    year: "năm",
    years: "năm",
    ago: "trước",
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);

        // Count unread notifications
        const unreadCount = data.filter((notification: NotificationMessage) => !notification.is_read).length;
        setUnreadCount(unreadCount);
      } catch (error) {
        setError("Failed to get notifications");
      }
    }

    fetchNotifications();
  },[]);
  
  useEffect(() => {
    // Connect to websocket server
    const socket = new WebSocket('ws://localhost:8080');
    socket.onopen = () => {
      console.log("WebSocket connected!");
    }
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    // Lắng nghe sự kiện khi nhận được tin nhắn từ server
    socket.onmessage = (event: MessageEvent) => {
      console.log('Received message from WebSocket:', event.data);
      const newNotification: NotificationMessage = JSON.parse(event.data);

      // Cập nhật danh sách thông báo
      setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);

      // Update unread notification count
      const unreadCount = [newNotification, ...notifications].filter(n => !n.is_read).length;
      setUnreadCount(unreadCount);
    };

    // Đóng kết nối khi component unmount
    return () => {
      socket.close();
    };
  }, []);

  const formatNotificationTime = (createdAt: string) => {
    const timeZone = 'Asia/Bangkok';
    const zonedDate = toZonedTime(createdAt, timeZone);
    const timeDifference = Date.now() - zonedDate.getTime();
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000; // amount ms of 1 day
    let formattedTime = '';

    if (timeDifference > oneDayInMilliseconds) {
      // Format thành HH:mm ngày dd-MM-yyyy nếu lớn hơn 24 giờ
      formattedTime = format(zonedDate, 'HH:mm dd-MM-yyyy', { timeZone: timeZone });
      const [time, date] = formattedTime.split(" ");
      return time + " ngày " + date;
    }

    // formatDistanceToNow cho các khoảng thời gian nhỏ hơn 24 giờ
    formattedTime = formatDistanceToNow(zonedDate, { addSuffix: true });
    Object.keys(translations).forEach(englishWord => {
      const vietnameseWord = translations[englishWord as keyof typeof translations];
      formattedTime = formattedTime.replace(new RegExp(`\\b${englishWord}\\b`, 'g'), vietnameseWord);
    });

    return formattedTime;
  };

  return (
    <div className="w-full md:w-128 p-4 bg-white/30 backdrop-blur-md border-white/50 rounded-lg shadow-lg flex flex-col justify-center items-center gap-2">
      <h2 className="text-lg font-semibold mb-2">Thông báo</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-2 max-h-128 overflow-y-auto">
        {notifications?.map((notification) => (
          <li
            key={notification.id}
            className={`p-3 flex items-center space-x-4 rounded-lg shadow-sm ${
              notification.is_read ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {/* Icon based on notification type */}
            <div>
              {notification.type === 'ORDER_UPDATE' ? (
                <FiPackage size={24} className="text-blue-500" />
              ) : (
                <FiTag size={24} className="text-green-500" />
              )}
            </div>

            {/* Notification message and details */}
            <div className="flex-1">
              <p className="font-medium line-clamp-3">{notification.message}</p>
              {notification.order_id && (
                <p className="text-sm text-gray-700">Mã đơn hàng: {notification.order_id}</p>
              )}
              <p className="text-sm text-gray-700">
                {formatNotificationTime(notification.createdAt)}
              </p>
            </div>

            {/* Status indicator for unread */}
            {!notification.is_read && (
              <span className="h-3 w-3 rounded-full bg-red-500" title="Chưa đọc"></span>
            )}
          </li>
        ))}
      </ul>
      <Link to="/notifications/view">
        <span className='text-sm mt-2 hover:text-violet-700'>Xem tất cả</span>
      </Link>
    </div>
  );
};

export default Notification;
