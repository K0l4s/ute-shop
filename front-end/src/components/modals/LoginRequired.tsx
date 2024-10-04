import React from "react";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";

type LoginRequiredProps = {
  onClose: () => void;
};

const LoginRequired: React.FC<LoginRequiredProps> = ({onClose}) => {
  const navigate = useNavigate();

  const handleNavigateToLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 z-50 flex justify-center items-center">
      <div className="relative bg-white p-8 rounded shadow-lg w-96 flex justify-center flex-col">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-gray-800"
          aria-label="Close"
        >
          <IoMdClose size={28} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">Bạn cần đăng nhập để thực hiện chức năng này</h2>
        <button onClick={handleNavigateToLogin} className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">Đăng nhập</button>
      </div>
    </div>
  );
}

export default LoginRequired;