import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login, setUser } from '../redux/reducers/authSlice';
import { handleGoogleCallbackApi } from '../apis/auth';
import { showToast } from '../utils/toastUtils';

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleGoogleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const success = urlParams.get('success');
      const error = urlParams.get('error');

      if (success === 'true') {
        try {
          const data = await handleGoogleCallbackApi();
          if (data.authenticated && data.user) {
            showToast('Đăng nhập Google thành công!', 'success');
            
            // Lưu thông tin người dùng vào Redux
            dispatch(login());
            dispatch(setUser({
              id: data.user.id,
              firstname: data.user.firstname,
              lastname: data.user.lastname,
              phone: data.user.phone,
              email: data.user.email,
              province: data.user.province,
              district: data.user.district,
              ward: data.user.ward,
              address: data.user.address,
              gender: data.user.gender,
              birthday: data.user.birthday,
              avatar_url: data.user.avatar_url,
              role: data.user.role,
            }));
            
            localStorage.setItem('userData', JSON.stringify(data.user));
            
            // Redirect to home or previous page
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
          }
        } catch (err) {
          console.error('Error handling Google callback:', err);
          showToast('Có lỗi xảy ra khi đăng nhập với Google!', 'error');
          navigate('/login', { replace: true });
        }
      } else if (error) {
        let errorMessage = 'Đăng nhập Google thất bại!';
        
        switch (error) {
          case 'oauth_error':
            errorMessage = 'Lỗi xác thực Google!';
            break;
          case 'oauth_failed':
            errorMessage = 'Không thể xác thực với Google!';
            break;
          case 'oauth_processing_error':
            errorMessage = 'Lỗi xử lý đăng nhập Google!';
            break;
        }
        
        showToast(errorMessage, 'error');
        navigate('/login', { replace: true });
      }
    };

    // Chỉ xử lý khi có parameter success hoặc error
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('success') || urlParams.get('error')) {
      handleGoogleCallback();
    }
  }, [location, navigate, dispatch]);
};