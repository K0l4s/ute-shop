import { Outlet } from "react-router-dom"
import Navbar from "../../components/navbar/Navbar"
import Footer from "../../components/footer/Footer"
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const CustomerLayout = () => {
    const [showScrollButton, setShowScrollButton] = useState(false);

        useEffect(() => {
            const handleScroll = () => {
                if (window.scrollY > 500) {
                    setShowScrollButton(true);
                } else {
                    setShowScrollButton(false);
                }
            };

            window.addEventListener('scroll', handleScroll);
            return () => {
                window.removeEventListener('scroll', handleScroll);
            };
        }, []);

        const scrollToTop = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        return (
            <>
            <div className="bg-gray-100">
                <Navbar />

                <Outlet />
            </div>
                <Footer />
                {showScrollButton && (
                    <button
                        onClick={scrollToTop}
                        className="fixed bottom-4 right-2 p-3 bg-violet-700 text-white rounded-full shadow-lg 
                        hover:bg-violet-800 transition duration-300"
                    >
                        <FaArrowUp />
                    </button>
                )}
            </>
        )
}
export default CustomerLayout;