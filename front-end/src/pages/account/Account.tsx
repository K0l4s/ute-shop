import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/reducers/authSlice'; // Action to update user
import { FiSave } from 'react-icons/fi';

const Account = () => {
  const dispatch = useDispatch();
  
  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  // Form state for user data
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [gender, setGender] = useState(user?.gender || 'male');
  const [birthDate, setBirthDate] = useState(user?.birthDate || '');
  const [changePassword, setChangePassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setGender(user.gender || 'male');
      setBirthDate(user.birthDate || '');
    }
  }, [user]);

  const handleSaveChanges = () => {
    // You can add logic to save changes or update user information
    const updatedUser = {
      firstName,
      lastName,
      phone,
      email,
      gender,
      birthDate
    };
    dispatch(setUser(updatedUser));
    alert('Changes saved successfully!');
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6">THÔNG TIN TÀI KHOẢN</h2>

        <div className="flex flex-col items-center mb-8">
          <img
            className="rounded-full h-40 w-40 object-cover"
            src={user?.profilePicture || 'https://via.placeholder.com/150'}
            alt="Avatar"
          />
        </div>

        {/* Form Fields */}
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Họ *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tên *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Số điện thoại *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Giới tính</label>
              <div className="flex items-center space-x-4">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="mr-2"
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="mr-2"
                  />
                  Nữ
                </label>
              </div>
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ngày sinh</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          {/* Change Password */}
          <div className="mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={() => setChangePassword(!changePassword)}
                className="form-checkbox"
              />
              <span>Đổi mật khẩu</span>
            </label>
          </div>

          {changePassword && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mật khẩu hiện tại *</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Mật khẩu mới *</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Nhập lại mật khẩu mới *</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleSaveChanges}
            className="bg-red-500 text-white px-4 py-2 rounded flex items-center space-x-2"
          >
            <FiSave />
            <span>Lưu thay đổi</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
