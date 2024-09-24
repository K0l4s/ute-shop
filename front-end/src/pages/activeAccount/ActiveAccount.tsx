import React, { useState } from 'react';
import { activeAccountApis } from '../../apis/auth';
import { useNavigate } from 'react-router-dom';

const ActiveAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));

  const handleCodeChange = (index: number, value: string) => {
    const updatedCode = [...code];
    updatedCode[index] = value;
    setCode(updatedCode);
  };

  const handleSubmit = async () => {
    try {
      const response = await activeAccountApis(email, code.join(''));
      console.log('Data:', response);
      if (response.ok) {
        alert('Vertify complete!');
        navigate("/login");
      }
      else {
        const msg = await response.json();
        alert('Error:' + msg.error);
      }
    } catch (err) {
      console.error('Có lỗi xảy ra: ', err);
    }

  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex items-center bg-white shadow-lg p-10 rounded-lg">
        {/* Left Side - Illustration */}
        <div className="mr-10">
          <img
            src="https://img.freepik.com/free-vector/store-shopping-concept-illustration_114360-1088.jpg" // You can replace with the actual image
            alt="Shop Illustration"
            className="h-64"
          />
          <h1 className="text-4xl font-bold mt-5">UTE SHOP</h1>
          <p className="text-lg">Mua sắm thoải mái - Tính tiền hết hồn!</p>
        </div>

        {/* Right Side - Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Reset your password</h2>

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-lg mb-2">Your email</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
            />
          </div>

          {/* Reset Code Input */}
          <div className="mb-4">
            <label className="block text-lg mb-2">Enter your code</label>
            <div className="flex space-x-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-12 h-12 text-center border rounded-lg focus:outline-none focus:border-blue-500"
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                />
              ))}
            </div>
          </div>


          {/* Confirm Button */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
          >
            Confirm
          </button>

          {/* Resend Code */}
          <p className="mt-4 text-center">
            Don’t receive code? <a href="#" className="text-blue-500 font-semibold">Resend it!</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccount;
