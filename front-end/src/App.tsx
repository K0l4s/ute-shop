import { useEffect } from 'react';
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Router from "./router/Router";
import { checkAuthStatus, setUser } from './redux/reducers/authSlice';
import { useDispatch } from 'react-redux';
import { checkAuthStatusApi } from './apis/auth';
import { getProfileApi } from './apis/user';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const data = await checkAuthStatusApi();

        if (data.authenticated) {
          dispatch(checkAuthStatus(true)); // Set the authentication status

          // Fetch user details if authenticated
          const userData = await getProfileApi();

          dispatch(setUser({
            firstname: userData.data["firstname"],
            lastname: userData.data["lastname"],
            phone: userData.data["phone"],
            email: userData.data["email"],
            province: userData.data["province"],
            district: userData.data["district"],
            ward: userData.data["ward"],
            address: userData.data["address"],
            gender: userData.data["gender"],
            birthday: userData.data["birthday"],
            avatar_url: userData.data["avatar_url"],
          }));

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