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
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
                <AdminNavbar />
                <div className="flex">
                    {/* Left Sidebar */}
                    <div className="xl:w-64 lg:w-64 md:w-0 w-0 hidden lg:block xl:block bg-gray-800 text-white min-h-screen">
                        <AdminLeftBar />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                        <Outlet />
                    </div>
                </div>
            </div>

        </AdminAccess>
    );
};

export default AdminLayout;
