import { useState } from "react";
import { BiAddToQueue, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { FaCalendarAlt } from "react-icons/fa";

interface Event {
  id: number;
  title: string;
  date: Date;
  color: string;
  description: string;
}

const AdminEvent = () => {
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [showEventModal, setShowEventModal] = useState(false);

  // Mock events data
  const [events] = useState<Event[]>([
    {
      id: 1,
      title: "Khuyến mãi sách mới",
      date: new Date(2024, 0, 15),
      color: "bg-pink-500",
      description: "Giảm giá 20% cho tất cả sách mới"
    },
    {
      id: 2, 
      title: "Hội sách xuân",
      date: new Date(2024, 0, 20),
      color: "bg-blue-500",
      description: "Triển lãm và bán sách với nhiều ưu đãi"
    },
    {
      id: 3,
      title: "Workshop đọc sách",
      date: new Date(2024, 0, 25),
      color: "bg-purple-500", 
      description: "Chia sẻ về kỹ năng đọc sách hiệu quả"
    }
  ]);

  const handleMonthChange = (increment: number) => {
    const newMonth = currentMonth + increment;
    if (newMonth < 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else if (newMonth > 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(newMonth);
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const emptyDays = firstDay === 0 ? 6 : firstDay - 1;

  const getEventsForDate = (date: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.getDate() === date && 
             eventDate.getMonth() === currentMonth &&
             eventDate.getFullYear() === currentYear;
    });
  };

  return (
    <div className="p-6 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-2">
          <FaCalendarAlt className="text-blue-600"/>
          Quản lý sự kiện
        </h1>
        <button 
          onClick={() => setShowEventModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition duration-200"
        >
          <BiAddToQueue size={20}/> 
          Thêm sự kiện mới
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <button 
            onClick={() => handleMonthChange(-1)}
            className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
          >
            <BiChevronLeft size={24} className="text-gray-600"/>
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            Tháng {currentMonth + 1}, {currentYear}
          </h2>
          <button 
            onClick={() => handleMonthChange(1)}
            className="p-2 hover:bg-gray-200 rounded-full transition duration-200"
          >
            <BiChevronRight size={24} className="text-gray-600"/>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
              <div key={day} className="text-center font-semibold text-gray-600">
                {day}
              </div>
            ))}

            {[...Array(emptyDays)].map((_, index) => (
              <div key={`empty-${index}`} className="h-32 bg-gray-50 rounded-lg"/>
            ))}

            {[...Array(daysInMonth)].map((_, index) => {
              const dayEvents = getEventsForDate(index + 1);
              const isToday = index + 1 === new Date().getDate() && 
                             currentMonth === new Date().getMonth() &&
                             currentYear === new Date().getFullYear();

              return (
                <div 
                  key={index} 
                  className={`h-32 border rounded-lg relative hover:border-blue-500 transition duration-200 
                    ${isToday ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                >
                  <div className={`absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-full
                    ${isToday ? 'bg-blue-500 text-white' : 'text-gray-700'}`}>
                    {index + 1}
                  </div>
                  <div className="mt-10 p-1 space-y-1">
                    {dayEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`${event.color} text-white text-xs p-1 rounded truncate cursor-pointer
                          hover:opacity-90 transition duration-200`}
                        title={event.description}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* TODO: Add Event Modal Component */}
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          {/* Modal content */}
        </div>
      )}
    </div>
  );
};

export default AdminEvent;