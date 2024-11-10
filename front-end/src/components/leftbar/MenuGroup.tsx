import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { Link } from "react-router-dom";

interface Submenu {
    title: string;
    link: string;
    icon: any;
}

interface MenuGroupProps {
    icon: React.ComponentType;
    title: string; 
    submenus?: Submenu[];
}

const MenuGroup: React.FC<MenuGroupProps> = ({ icon: Icon, title, submenus }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
                aria-expanded={isOpen}
                aria-controls={`submenu-${title}`}
            >
                <div className="flex items-center">
                    <Icon className="w-5 h-5 mr-3 text-blue-300" />
                    <span className="hidden lg:block font-medium">{title}</span>
                </div>
                {submenus && (
                    <FaChevronDown 
                        className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        aria-hidden="true"
                    />
                )}
            </button>

            {submenus && (
                <div 
                    id={`submenu-${title}`}
                    className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                    {submenus.map((submenu, idx) => {
                        const SubIcon = submenu.icon;
                        return (
                            <Link 
                                key={submenu.link}
                                to={submenu.link}
                                className="flex items-center p-2 pl-4 rounded-lg hover:bg-white/10 transition-colors duration-300"
                            >
                                <SubIcon className="w-4 h-4 mr-3 text-gray-300" />
                                <span className="hidden lg:block">{submenu.title}</span>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MenuGroup;