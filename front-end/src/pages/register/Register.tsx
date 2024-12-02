import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toastUtils';

interface RegisterProps {}

const Register: React.FC<RegisterProps> = () => {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [repeat_psswd, setRepeat_psswd] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeat_psswd) {
      showToast('Mật khẩu và xác nhận mật khẩu không khớp!', 'error');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstname,
          lastname,
          email,
          password,
          repeat_psswd,
          phone,
          birthday,
          address,
        }),
      });

      if (response.ok) {
        showToast('Đăng ký thành công!', 'success');
        navigate('/active');
      } else {
        showToast('Đăng ký thất bại!', 'error');
      }
    } catch (err) {
      console.error('Có lỗi xảy ra: ', err);
      showToast('Đăng ký thất bại!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
      <div className="bg-white shadow-md rounded px-12 pt-6 pb-8 mb-4 flex flex-row items-center justify-between ">
        <div className="text-center">
          <img
            src="./logo.svg"
            alt="shop"
            className=" h-40 m-auto"
          />
          <p className="text-sm text-gray-600 font-bold pt-4 pb-4">Mua sắm thoải mái - Tính tiền hết hồn!</p>
        </div>
        <div>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4 flex justify-between">
            <input
              type="text"
              className="shadow appearance-none border rounded w-4/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="First Name"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
            />
            <input
              type="text"
              className="shadow appearance-none border rounded w-7/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Last Name"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="date"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Date of Birth"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Confirm Password"
              value={repeat_psswd}
              onChange={(e) => setRepeat_psswd(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-24 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> : 'Đăng ký'}
          </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">
          Already have an account? <a href="/login" className="text-blue-500">Sign in</a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
