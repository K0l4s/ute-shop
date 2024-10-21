import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";
interface Submenu {
    title: string;
    link: string;
    icon: any;
}

interface MenuGroupProps {
    icon: any;
    title: string;
    submenus?: Submenu[]; // submenus is optional
}

// Component for Menu Group (with submenus)
const MenuGroup: React.FC<MenuGroupProps> = ({ icon: Icon, title, submenus }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Toggle the menu visibility
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="flex flex-col ">
            {/* Main menu item */}
            <div onClick={toggleMenu} className="flex items-center justify-between hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2">
                <div className="flex items-center">
                    <Icon className="mr-2" />
                    <span className="hidden lg:block">{title}</span>
                </div>
                {submenus && <FaChevronDown className={`transition-transform ${isOpen ? 'rotate-180 ' : ''}`} />}
            </div>

            {/* Submenu items */}
            {isOpen && submenus && (
                <div className="ml-6 ">
                    {submenus.map((submenu, idx) => (
                        <Link key={idx} to={submenu.link} className="flex items-center hover:text-gray-500 cursor-pointer duration-300 ease-in-out p-2 duration-300 ease-in-out">
                            <submenu.icon className="mr-2" />
                            <span className="hidden lg:block">{submenu.title}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MenuGroup;