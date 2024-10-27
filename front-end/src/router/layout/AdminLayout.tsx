import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const AdminLayout = () => {
    const role = useSelector((state: RootState) => state.auth.user?.role || "customer");
    if(role !== "admin") {
        alert("You are not authorized to access this page");
        return <h1>You dont have permission</h1>
    }
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
