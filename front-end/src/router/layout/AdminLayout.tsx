import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";

const AdminLayout = () => {
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
