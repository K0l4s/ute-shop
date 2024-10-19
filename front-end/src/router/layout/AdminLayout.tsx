import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";

const AdminLayout = () => {
    return (
        <div className="min-h-screen">
            <AdminNavbar />
            <div className="grid grid-cols-7 lg:grid-cols-12">
                <div className="col-span-1 lg:col-span-3">
                    <AdminLeftBar/>
                </div>
                <div className="col-span-6 lg:col-span-9 p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
