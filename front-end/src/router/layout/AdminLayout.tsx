import { Outlet, useNavigate } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useEffect } from "react";

const AdminLayout = () => {
    const user = useSelector((state: RootState) => state.auth.user);
    // console.log("role", useSelector((state: RootState) => state.auth || "customer"));
    const navigate = useNavigate();
    useEffect(() => {
        console.log("role", user?.role);
        if(user?.role != "admin") {
            navigate("/");
            alert("You are not authorized to access this page");
        }
    }, [user]);
    return (
        <div className="min-h-screen">
            <AdminNavbar />
            <div className="grid grid-cols-7 lg:grid-cols-12">
                <div className="col-span-1 lg:col-span-2">
                    <AdminLeftBar/>
                </div>
                <div className="col-span-6 m-0 lg:col-span-10 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
