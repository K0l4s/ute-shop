import { useEffect } from 'react';
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Router from "./router/Router";
import { checkAuthStatus, setUser } from './redux/reducers/authSlice';
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

        if (response.ok && data.authenticated) {
          dispatch(checkAuthStatus(true)); // Set the authentication status

          // Fetch user details if authenticated
          const userResponse = await fetch('http://localhost:8080/api/v1/user/profile', {
            method: 'GET',
            credentials: 'include', // Send cookies along with the request
          });

          const userData = await userResponse.json();
          if (userResponse.ok) {
            dispatch(setUser({
              firstName: userData.data["firstname"],
              lastName: userData.data["lastname"],
              phone: userData.data["phone"],
              email: userData.data["email"],
              gender: userData.data["gender"],
              birthDate: userData.data["birthday"],
              profilePicture: userData.data["avatar_url"],
            }));
          }
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
  const navbarHideList = [
    '/login',
    '/register',
    '/forgot',
    '/reset/password'
  ]
  const isHideNavbar = navbarHideList.includes(window.location.pathname)
  return (
    <>
    {!isHideNavbar &&
    <Navbar />}
    {/* <div className="overflow-auto"> */}
    <div>
    <Router />
    </div>
    {!isHideNavbar &&
    <Footer/>}
    </>
  );
}

export default App;