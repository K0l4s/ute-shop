import { useState } from "react";
import { BiAddToQueue } from "react-icons/bi";


const AdminEvent = () => {
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // Tăng hoặc giảm tháng
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

    return (
        <>
            <button className="bg-white p-5 m-2 rounded-xl flex gap-2 items-center"><BiAddToQueue/> Thêm sự kiện mới</button>
            <div className="max-w-full mx-auto bg-white shadow-lg rounded-lg overflow-hidden">

                <div className="p-4 border-b flex justify-between items-center">
                    <button onClick={() => handleMonthChange(-1)} className="text-blue-600">Previous</button>
                    <h2 className="text-xl font-semibold">
                        {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
                    </h2>
                    <button onClick={() => handleMonthChange(1)} className="text-blue-600">Next</button>
                </div>
                <div className="p-4">
                    <div className="grid grid-cols-7 gap-2">
                        {/* Render ngày trong tuần */}
                        {["Thứ hai", "Thứ ba", "Thứ tư", "Thứ năm", "Thứ sáu", "Thứ bảy", "Chủ nhật"].map((day) => (
                            <div key={day} className="text-gray-600 text-sm font-medium">
                                {day}
                            </div>
                        ))}

                        {/* Render các ô ngày */}
                        {[...Array(daysInMonth)].map((_, index) => (
                            <div key={index} className="h-20 border rounded-lg border-gray-200 relative">
                                <div className="absolute top-1 left-1 text-sm font-medium p-2">
                                    {index + 1}
                                </div>
                                {/* Ví dụ sự kiện */}
                                {index === 2 && (
                                    <div className="absolute bottom-1 left-1 right-1 bg-pink-500 text-white text-xs rounded px-1">
                                        Product Launch
                                    </div>
                                )}
                                {index === 14 && (
                                    <div className="absolute bottom-1 left-1 right-1 bg-yellow-500 text-white text-xs rounded px-1">
                                        Project Update
                                    </div>
                                )}
                                {index === 25 && (
                                    <div className="absolute bottom-1 left-1 right-1 bg-purple-500 text-white text-xs rounded px-1">
                                        Workshop 1
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
export default AdminEvent