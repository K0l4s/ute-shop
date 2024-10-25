import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router";
import { RootState } from "../redux/store";

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  let location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};