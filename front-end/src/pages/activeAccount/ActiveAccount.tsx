import React, { useState, useRef } from 'react';
import { activeAccountApis } from '../../apis/auth';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toastUtils';

const ActiveAccount = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(Array(6).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]); // Sử dụng HTMLInputElement | null để phù hợp với giá trị trả về của ref

  const handleCodeChange = (index: number, value: string) => {
    const updatedCode = [...code];
    if (value.length <= 1) {
      updatedCode[index] = value;
      setCode(updatedCode);

      // Chuyển focus sang ô tiếp theo nếu có
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus(); // Sử dụng optional chaining để kiểm tra null
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      // Khi nhấn phím Backspace, chuyển focus về ô trước đó nếu rỗng
      inputRefs.current[index - 1]?.focus(); // Sử dụng optional chaining để kiểm tra null
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await activeAccountApis(email, code.join(''));
      console.log('Data:', response);
      if (response.ok) {
        // alert('Vertify complete!');
        showToast('Vertify complete!', 'success');
        navigate("/login");
      } else {
        const msg = await response.json();
        // alert('Error:' + msg.error);
        showToast('Error:' + msg.error, 'error');
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
            src="https://img.freepik.com/free-vector/store-shopping-concept-illustration_114360-1088.jpg"
            alt="Shop Illustration"
            className="h-64"
          />
          <h1 className="text-4xl font-bold mt-5">UTE SHOP</h1>
          <p className="text-lg">Mua sắm thoải mái - Tính tiền hết hồn!</p>
        </div>

        {/* Right Side - Form */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Verify your email</h2>

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
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)} // Lưu ref của từng ô input
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
            Kiểm tra hộp thư SPAM nếu không thấy mã code nhé!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActiveAccount;
