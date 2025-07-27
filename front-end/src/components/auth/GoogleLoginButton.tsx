import React from 'react';
import { FcGoogle } from 'react-icons/fc';
import { loginWithGoogleApi } from '../../apis/auth';

interface GoogleLoginButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({ 
  text = "Sign in with Google",
  className = "",
  disabled = false
}) => {
  const handleGoogleLogin = () => {
    if (!disabled) {
      loginWithGoogleApi();
    }
  };

  return (
    <button
      onClick={handleGoogleLogin}
      disabled={disabled}
      className={`
        flex items-center justify-center gap-3 
        w-full py-2 px-4 
        border border-gray-300 rounded-lg
        bg-white hover:bg-gray-50
        text-gray-700 font-medium
        transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <FcGoogle className="text-xl" />
      <span>{text}</span>
    </button>
  );
};

export default GoogleLoginButton;