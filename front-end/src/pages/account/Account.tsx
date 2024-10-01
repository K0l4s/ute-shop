import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { setUser } from '../../redux/reducers/authSlice';
import { FiSave, FiUpload } from 'react-icons/fi';
import { updateProfileApis } from '../../apis/user';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BsKey } from 'react-icons/bs';
import ChangePassword from '../../components/modals/ChangePassword';

const Account = () => {
  const dispatch = useDispatch();
  
  // Get user data from Redux
  const user = useSelector((state: RootState) => state.auth.user);
  // Form state for user data
  const [firstname, setFirstname] = useState(user?.firstname || '');
  const [lastname, setLastname] = useState(user?.lastname || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [email, setEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [gender, setGender] = useState(user?.gender === true ? 'male' : 'female');
  const [birthday, setBirthday] = useState(user?.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setFirstname(user.firstname || '');
      setLastname(user.lastname || '');
      setAddress(user.address || '');
      setPhone(user.phone || '');
      setEmail(user.email || '');
      setGender(user.gender === true ? 'male' : 'female');
      setBirthday(user.birthday ? new Date(user.birthday).toISOString().split('T')[0] : '');
      setAvatarUrl(user.avatar_url);
    }
  }, [user]);

  // Clean up avatar URL when component unmounts
  useEffect(() => {
    if (avatar) {
      const url = URL.createObjectURL(avatar);
      setAvatarUrl(url);

      // Release object URL on component unmount
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [avatar]);

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true);

    const updatedUser = {
      firstname,
      lastname,
      phone,
      email,
      address,
      gender: gender === 'male' ? true : false,
      birthday: birthday,
      avatarUrl
    };

    const response = await updateProfileApis(
      updatedUser.firstname,
      updatedUser.lastname,
      updatedUser.address,
      updatedUser.phone,
      updatedUser.gender,
      new Date(updatedUser.birthday),
      avatar ? avatar : null,
    );

    setAvatar(null);
    setLoading(false);

    if (response) {
      dispatch(setUser({ ...updatedUser, avatar_url: response.data.avatar_url || updatedUser.avatarUrl }));
    } else {
      alert('Error saving changes: ' + (response?.message || 'Unknown error'));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileType = file.type.toLowerCase();
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];

      if (!allowedTypes.includes(fileType)) {
        alert('Chỉ cho phép các định dạng ảnh jpeg, jpg và png!');
        return;
      }

      setAvatar(file);
      alert('Ảnh đã được chọn!');
    }
  };

  return (
    <div className="flex justify-center relative">
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-50 rounded flex items-center justify-center bg-black bg-opacity-50">
          <AiOutlineLoading3Quarters className="animate-spin mr-2 text-2xl text-white" />
          <div className="text-white font-bold text-2xl">Đang lưu thay đổi...</div>
        </div>
      )}

      <div className={`bg-white shadow-md rounded-lg p-8 w-full max-w-5xl ${loading ? 'opacity-50' : ''}`}>
        <h2 className="text-lg text-purple-700 font-bold mb-6">THÔNG TIN TÀI KHOẢN</h2>

        <div className="flex flex-col items-center mb-8">
          <img
            className="rounded-full h-48 w-48 object-cover"
            src={avatarUrl || user?.avatar_url || 'https://via.placeholder.com/150'}
            alt="Avatar"
          />

          <label className="mt-4">
            <input
              type="file"
              accept="image/jpeg, image/jpg, image/png"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="text-white cursor-pointer m-auto rounded flex items-center space-x-2 px-4 py-2 bg-purple-700 hover:bg-purple-500">
              <FiUpload />
              <span>
                Chọn ảnh
              </span>
            </div>
          </label>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleSaveChanges}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Họ *</label>
              <input
                type="text"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder='Nhập họ của bạn'
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Tên *</label>
              <input
                type="text"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder='Nhập tên của bạn'
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Số điện thoại *</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                disabled
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Địa chỉ *</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder='Nhập địa chỉ của bạn'
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Ngày sinh</label>
              <input
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
                className="w-full p-2 border rounded"
                required
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
          </div>

          <div onClick={() => setShowPasswordModal(true)} 
              className='flex px-4 py-2 bg-red-600 text-white rounded w-fit 
                items-center cursor-pointer hover:bg-red-500'>
            <BsKey size={24} className='mr-2' 
          />
            Đổi mật khẩu
          </div>
          {showPasswordModal && (
            <ChangePassword onClose={() => setShowPasswordModal(false)} />
          )}

          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 m-auto rounded flex items-center space-x-2 hover:bg-red-500"
          >
            {loading ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Đang lưu...
              </>
            ) : (
              <>
                <FiSave className="mr-2" />
                Lưu thay đổi
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Account;
