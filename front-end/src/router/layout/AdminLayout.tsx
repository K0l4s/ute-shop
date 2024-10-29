import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const AdminAccess = ({ children }: { children: JSX.Element }) => {
    const userRole = useSelector((state: RootState) => state.auth.user?.role || "customer");

    if (userRole !== "admin") {
        return <h1>You don't have permission</h1>;
    }

    return children;
};

const AdminLayout = () => {
    return (
        <AdminAccess>
            <div className="min-h-screen">
                <AdminNavbar />
                <div className="grid grid-cols-7 lg:grid-cols-12">
                    <div className="col-span-1 lg:col-span-2">
                        <AdminLeftBar />
                    </div>
                    <div className="col-span-6 m-0 lg:col-span-10 p-4">
                        <Outlet />
                    </div>
                </div>
            </div>
        </AdminAccess>
    );
};

export default AdminLayout;
