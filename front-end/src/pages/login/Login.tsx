import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, setUser } from '../../redux/reducers/authSlice';
import { useDispatch } from 'react-redux';
import { loginApi } from '../../apis/auth';
interface LoginProps {}

const Login: React.FC<LoginProps> = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await loginApi(email, password);
      alert('Đăng nhập thành công!');
      
      // Lưu thông tin người dùng vào Redux
      dispatch(login());
      dispatch(setUser({
        id: data.data.id,
        firstname: data.data.firstname,
        lastname: data.data.lastname,
        phone: data.data.phone,
        email: data.data.email,
        province: data.data.province,
        district: data.data.district,
        ward: data.data.ward,
        address: data.data.address,
        gender: data.data.gender,
        birthday: data.data.birthday,
        avatar_url: data.data.avatar_url,
        role: data.data.role,
      }));
      localStorage.setItem('userData', JSON.stringify(data.data));
      navigate('/');
    } catch (err) {
      alert('Đăng nhập thất bại!');
      // if (data?.error === "Error logging in: User not active") {
      //   navigate('/active');
      // }
    }
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md rounded px-12 pt-6 pb-8 mb-4 flex flex-col items-center">
        <div className="text-center">
          <img
            src="./logo.svg"
            alt="shop"
            className=" h-40 m-auto"
          />
          <p className="text-sm text-gray-600 font-bold pt-4 pb-4">Mua sắm thoải mái - Tính tiền hết hồn!</p>
        </div>
        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-24 rounded focus:outline-none focus:shadow-outline"
            >
              Sign in
            </button>
          </div>
        </form>
        <p className="text-center text-xs text-gray-500 mt-4">
          Don't have an account? <a href="/register" className="text-blue-500">Sign up</a> <br />
          <a href="/forgot" className="text-blue-500">Forgot your password? </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
