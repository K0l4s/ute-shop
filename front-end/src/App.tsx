import { useEffect } from 'react';
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Router from "./router/Router";
import { checkAuthStatus } from './redux/reducers/authSlice';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/v1/auth/check', {
          method: 'GET',
          credentials: 'include', // Gửi cookie kèm theo
        });
        const data = await response.json();
        if (response.ok) {
          dispatch(checkAuthStatus(data.authenticated)); // Cập nhật trạng thái vào Redux
        } else {
          dispatch(checkAuthStatus(false));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        dispatch(checkAuthStatus(false));
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  return (
    <>
    <Navbar />
    <div className="overflow-auto">
    <Router />
    </div>
    <Footer/>
    </>
  );
}

export default App;