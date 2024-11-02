import { Outlet } from "react-router-dom"
import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"

const CustomerLayout = () => {
    return (
        <><div className="bg-gray-100">
            <Navbar />

            <Outlet />
        </div>
            <Footer />
        </>
    )
}
export default CustomerLayout;