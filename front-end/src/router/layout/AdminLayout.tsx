import { Outlet } from "react-router-dom";
import AdminNavbar from "../../components/navbar/AdminNavbar";
import AdminLeftBar from "../../components/leftbar/AdminLeftBar";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import BlockPermissionPage from "../../pages/errorPage/BlockPermissionPage";

// Component to handle admin access control
const AdminAccess = ({ children }: { children: JSX.Element }) => {
    const userRole = useSelector((state: RootState) => state.auth.user?.role || "customer");

    if (userRole !== "admin") {
        return <BlockPermissionPage />;
    }

    return children;
};

const AdminLayout = () => {
    return (
        <AdminAccess>
            <div className=" bg-gradient-to-br from-gray-50 to-gray-100">

                <AdminNavbar />
                <div className="grid grid-cols-7 lg:grid-cols-12 gap-4">
                    <div className="col-span-1 lg:col-span-2 shadow-lg">
                        <AdminLeftBar />
                    </div>
                    <div className="col-span-6 lg:col-span-10 p-6 bg-white rounded-lg shadow-sm bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </div>

            </div>
        </AdminAccess>
    );
};

export default AdminLayout;
