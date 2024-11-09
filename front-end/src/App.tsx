import { useEffect } from 'react';
// import Footer from "./components/footer/Footer";
// import Navbar from "./components/navbar/Navbar";
import Router from "./router/Router";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { checkAuthStatus, setAuthLoading, setUser } from './redux/reducers/authSlice';
import { useDispatch } from 'react-redux';
import { checkAuthStatusApi } from './apis/auth';
import { getProfileApi } from './apis/user';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      dispatch(setAuthLoading(true));
      try {
        const data = await checkAuthStatusApi();

        if (data.authenticated) {
          dispatch(checkAuthStatus(true)); // Set the authentication status
          
          const storedUserData = localStorage.getItem("userData");
          if (storedUserData) {
            // Load user data from localStorage
            const userData = JSON.parse(storedUserData);
            dispatch(setUser({
              id: userData["id"],
              firstname: userData["firstname"],
              lastname: userData["lastname"],
              phone: userData["phone"],
              email: userData["email"],
              province: userData["province"],
              district: userData["district"],
              ward: userData["ward"],
              address: userData["address"],
              birthday: userData["birthday"],
              avatar_url: userData["avatar_url"],
              role: userData["role"],
            }))
          } else {
            const userData = await getProfileApi();
            localStorage.setItem("userData", JSON.stringify(userData));
            dispatch(setUser({
              id: userData.data["id"],
              firstname: userData.data["firstname"],
              lastname: userData.data["lastname"],
              phone: userData.data["phone"],
              email: userData.data["email"],
              province: userData.data["province"],
              district: userData.data["district"],
              ward: userData.data["ward"],
              address: userData.data["address"],
              birthday: userData.data["birthday"],
              avatar_url: userData.data["avatar_url"],
              role: userData.data["role"],
            }));
          }
        } else {
          dispatch(checkAuthStatus(false));
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        dispatch(checkAuthStatus(false));
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    checkLoginStatus();
  }, [dispatch]);
  return (
    <>
    <Router />
    <ToastContainer />
    </>
  );
}

export default App;