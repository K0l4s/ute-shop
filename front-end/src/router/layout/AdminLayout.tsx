import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";

const AdminLayout = () => {
    return (
        <>
            <AdminNavbar />
            <AdminLeftBar />
            <div className="ps-60 mt-2 mr-3">
                <Outlet />
            </div>
        </>
    )
}

export default AdminLayout;