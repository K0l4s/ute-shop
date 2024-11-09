import React, { useEffect, useRef, useState } from 'react';
import { FiPackage, FiTag } from 'react-icons/fi'; // Icons for order update and promotion
import { formatDistanceToNow } from 'date-fns';
import { format, toZonedTime } from 'date-fns-tz';
import { useWebSocket } from '../../context/WebSocketContext';

const Notification: React.FC = () => {
  const { notifications, fetchNotifications } = useWebSocket();

  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState<number>(() => {
    const savedOffset = localStorage.getItem('notificationOffset');
    return savedOffset ? parseInt(savedOffset, 10) : 0;
  });
  const [hasMore, setHasMore] = useState(true);
  const limit = 10;
  const containerRef = useRef<HTMLUListElement | null>(null);

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

  const handleScroll = () => {
    if (containerRef.current && hasMore) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        setOffset((prevOffset) => prevOffset + limit);
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    if (offset > 0 && hasMore) {
      fetchNotifications(limit, offset).then(({ hasMore: hasMoreNotifications }) => {
        if (!hasMoreNotifications) {
          setHasMore(false); // Ngừng gọi API khi hết dữ liệu
        }
      }).catch((err) => {
        setError('Có lỗi xảy ra khi tải thông báo: ' + err.message);
      });
    }
  }, [offset, hasMore]);

  useEffect(() => {
    localStorage.setItem('notificationOffset', offset.toString());
  }, [offset]);

  const formatNotificationTime = (createdAt: string) => {
    if (!createdAt) {
      return '';
    }
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
    <div className="w-full md:w-128 p-4 bg-white rounded-lg shadow-lg flex flex-col justify-center items-center gap-2">
      <h2 className="text-lg font-semibold mb-2">Thông báo</h2>
      {error && <p className="text-red-500">{error}</p>}
      <ul ref={containerRef} className="space-y-2 max-h-128 overflow-y-auto">
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
      <span className='text-violet-700'>Cuộn xuống để xem nhiều hơn</span>
    </div>
  );
};

export default Notification;
