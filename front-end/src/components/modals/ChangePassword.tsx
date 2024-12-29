import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import { changePasswordApi } from '../../apis/auth';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/reducers/authSlice';
import { useWebSocket } from '../../context/WebSocketContext';
import { showToast } from '../../utils/toastUtils';
import { BASE_URL } from '../../apis/base';

interface ChangePasswordProps {
  onClose: () => void;
};

const ChangePassword: React.FC<ChangePasswordProps> = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [counter, setCounter] = useState(10);
  const [loading, setLoading] = useState(false);

  const { clearNotifications } = useWebSocket()
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // Hàm xử lý thay đổi mật khẩu
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault(); // Ngăn chặn form submit trên Account.tsx

    setError('');
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và nhập lại không khớp.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return;
    }

    setLoading(true);
    try {
      await changePasswordApi(currentPassword, newPassword);
      setSuccess(true);
      showToast('Đổi mật khẩu thành công!', 'success');
    } catch (err) {
      setError('Có lỗi xảy ra khi đổi mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (success) {
      // Thiết lập bộ đếm thời gian sau khi đổi mật khẩu thành công
      const timer = setInterval(() => {
        setCounter((prev) => prev - 1);
      }, 1000);

      // Tự động logout và chuyển đến trang đăng nhập sau khi đếm ngược kết thúc
      if (counter === 0) {
        handleLogout();
      }

      return () => clearInterval(timer);
    }
  }, [success, counter]);

  const handleLogout = async () => {
    try {
      const response = await fetch(BASE_URL + '/auth/logout', {
        method: 'POST',
        credentials: 'include', // Gửi cookie kèm theo
      });

      if (response.ok) {
        dispatch(logout());
        localStorage.clear();
        clearNotifications();
        navigate('/login');
      } else {
        showToast('Đăng xuất thất bại!', 'error');
      }
    } catch (err) {
      console.error('Có lỗi xảy ra khi đăng xuất:', err);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="relative bg-white p-8 rounded shadow-lg w-96">
        
        {/* Form thay đổi mật khẩu */}
        {!success ? (
          <>
            {/* Nút đóng modal */}
            <button
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800"
              aria-label="Close"
            >
              <IoMdClose size={28} />
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center text-violet-700">Đổi mật khẩu</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Mật khẩu mới</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Nhập mật khẩu mới"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Nhập lại mật khẩu mới</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            {/* Hiển thị thông báo lỗi nếu có */}
            {error && <p className="text-red-600 mb-4">{error}</p>}

            {/* Nút xác nhận */}
            <button
              onClick={handleChangePassword}
              className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 w-full"
              disabled={loading}
            >
              {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Xác nhận'}
            </button>
          </>
        ) : (
          <div>
            {/* Thông báo thành công */}
            <h2 className="text-2xl font-semibold mb-4 text-center">Đổi mật khẩu thành công!</h2>
            <p className="text-gray-700 mb-4 text-center">Vui lòng đăng nhập lại để tiếp tục.</p>
            <p className="text-gray-700 mb-4 text-center">Tự động đăng xuất trong {counter} giây...</p>
            <button onClick={handleLogout} className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 w-full">
              Xác nhận
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePassword;
