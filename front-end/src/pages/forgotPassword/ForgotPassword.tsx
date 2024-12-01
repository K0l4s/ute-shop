import { useState } from "react";
import { forgotPasswordApis } from "../../apis/auth";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toastUtils";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();
    const handleSubmit =async () => {
      // Handle password reset logic
      
        // Call API to send reset password email
        try{
        const response = await forgotPasswordApis(email);
        console.log('Data:', response);
        if(response.ok){
          // alert('Email sent successfully!');
          showToast('Email sent successfully!', 'success');
          navigate("/reset/password");
        }
        else{
            const msg = await response.json();
          // alert('Email sent failed! Error message:' + msg.error);
          showToast('Email sent failed! Error message:' + msg.error, 'error');
        }
    }catch(err){
        console.error('Có lỗi xảy ra: ', err);
        }

    //   console.log('Email:', email);
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
  
           
            {/* Confirm Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded-lg text-lg font-semibold hover:bg-blue-600 transition"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    );
}

export default ForgotPassword