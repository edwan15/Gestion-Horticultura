import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom"; 
import { MdKeyboardArrowRight } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion"; 
import ReactDOM from 'react-dom';

const SideBarItem = ({ isOpen, product, isMobile, closeMobileMenu }) => {
    const [isExpanded, setIsExpanded] = useState(false); // Mobile state
    
    // Desktop State
    const [showPopover, setShowPopover] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef(null);
    const buttonRef = useRef(null);
    const inactivityTimerRef = useRef(null);

    const location = useLocation();

    // ----------------------------------------------------------------------
    // STYLES ... (Keep existing style constants)
    const desktopActive = "border-l-4 border-green-600 bg-green-50 text-green-700 font-bold";
    const desktopHover = "border-l-4 border-gray-300 bg-gray-50 text-gray-700"; 
    const desktopDefault = "border-l-4 border-transparent text-gray-600 hover:text-gray-900";
    const mobileActive = "bg-green-600 shadow-xl text-white";
    const mobileInactive = "text-gray-900 hover:text-white hover:bg-green-800";
    const baseClass = "flex items-center p-3 my-0.5 cursor-pointer transition-all duration-200 relative";
    const mobileBaseClass = "flex items-center p-3 my-1 rounded-xl cursor-pointer transition-all duration-300";

    const isActiveLink = (path) => location.pathname === path || location.pathname.startsWith(path + '/');
    const isParentActive = product.childrens && product.childrens.some(child => isActiveLink(child.path));

    // 🛑 LOGIC FOR CLICK OUTSIDE & AUTO-CLOSE (DESKTOP) 🛑
    useEffect(() => {
        if (!showPopover) return;

        // 1. Click Outside Handler
        const handleClickOutside = (event) => {
            if (
                popoverRef.current && 
                !popoverRef.current.contains(event.target) && 
                buttonRef.current && 
                !buttonRef.current.contains(event.target)
            ) {
                setShowPopover(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        
        // 2. Inactivity Timer (6 seconds)
        const resetTimer = () => {
            if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = setTimeout(() => {
                setShowPopover(false);
            }, 6000);
        };

        // Start timer initially
        resetTimer();

        // Listeners to reset timer on activity inside popover
        const popoverElement = popoverRef.current;
        if (popoverElement) {
            popoverElement.addEventListener("mousemove", resetTimer);
            popoverElement.addEventListener("click", resetTimer);
            popoverElement.addEventListener("keydown", resetTimer);
        }

        return () => {
             document.removeEventListener("mousedown", handleClickOutside);
             if (inactivityTimerRef.current) clearTimeout(inactivityTimerRef.current);
             if (popoverElement) {
                popoverElement.removeEventListener("mousemove", resetTimer);
                popoverElement.removeEventListener("click", resetTimer);
                popoverElement.removeEventListener("keydown", resetTimer);
            }
        };
    }, [showPopover]);

    // Toggle Popover on Click
    const handleDesktopClick = (e) => {
        if (showPopover) {
            setShowPopover(false);
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPosition({
                top: rect.top,
                left: rect.right + 5
            });
            setShowPopover(true);
        }
    };

    // -----------------------------------------------------------
    // 1. DESKTOP RENDER (Popover / Floating Menu - Portal)
    // -----------------------------------------------------------
    if (!isMobile) {
        if (product.childrens && product.childrens.length > 0) {
            return (
                <>
                    <div 
                        ref={buttonRef}
                        className="relative w-full"
                        onClick={handleDesktopClick}
                    >
                        <div 
                            className={`${baseClass} ${
                                isParentActive ? desktopActive : (showPopover ? desktopHover : desktopDefault)
                            }`}
                        >
                            {/* Icon */}
                            <div className={`text-xl min-w-[2.5rem] flex justify-center ${
                                isParentActive ? "text-green-600" : "text-gray-400"
                            }`}>
                                {product.icon}
                            </div>
                            
                            {isOpen && (
                                <span className="flex-1 truncate">{product.title}</span>
                            )}

                            {isOpen && (
                                <MdKeyboardArrowRight className={`text-gray-400 ${showPopover ? 'rotate-90 text-green-600' : ''} transition-transform`} />
                            )}
                        </div>
                    </div>

                    {/* POPOVER MENU (Portal to Body) */}
                    {showPopover && ReactDOM.createPortal(
                        <motion.div
                            ref={popoverRef}
                            initial={{ opacity: 0, x: -10, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="fixed bg-white rounded-lg shadow-2xl border border-gray-200 z-[9999] overflow-hidden"
                            style={{ 
                                top: menuPosition.top, 
                                left: menuPosition.left,
                                minWidth: "14rem" 
                            }}
                        >
                            <div className="bg-green-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                                <span className="text-green-600 text-lg">{product.icon}</span>
                                <span className="font-bold text-gray-800 text-sm">{product.title}</span>
                            </div>
                            <div className="py-1 bg-white">
                                {product.childrens.map((child, idx) => (
                                    <NavLink
                                        key={idx}
                                        to={child.path}
                                        onClick={() => setShowPopover(false)} // Close on selection
                                        className={({ isActive }) => `
                                            flex items-center px-4 py-2 text-sm transition-colors cursor-pointer
                                            ${isActive 
                                                ? "bg-green-50 text-green-700 font-semibold border-l-4 border-green-500" 
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent hover:border-gray-300"
                                            }
                                        `}
                                    >
                                        {child.icon && <span className="mr-3 text-lg opacity-70">{child.icon}</span>}
                                        {child.title}
                                    </NavLink>
                                ))}
                            </div>
                        </motion.div>,
                        document.body
                    )}
                </>
            );
        } else {
            // Simple Item Desktop
            return (
                <NavLink
                    to={product.path}
                    className={({ isActive }) => 
                        `${baseClass} ${isActive ? desktopActive : desktopDefault} hover:border-gray-300 hover:bg-gray-50`
                    }
                >
                    <div className={`text-xl min-w-[2.5rem] flex justify-center ${
                        isActiveLink(product.path) ? "text-green-600" : "text-gray-400"
                    }`}>
                        {product.icon}
                    </div>
                    {isOpen && <span className="truncate">{product.title}</span>}
                </NavLink>
            );
        }
    }

    // -----------------------------------------------------------
    // 2. MOBILE RENDER (Accordion / Original Style)
    // -----------------------------------------------------------
    else {
        if (product.childrens && product.childrens.length > 0) {
            const parentLinkClass = isParentActive 
                ? `${mobileBaseClass} ${mobileActive}` 
                : `${mobileBaseClass} ${mobileInactive}`;

            return (
                <div className="text-sm">
                    <motion.div 
                        className={parentLinkClass} 
                        onClick={() => setIsExpanded(!isExpanded)}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="flex gap-4 items-center w-full">
                            {product.icon && <div className="text-xl">{product.icon}</div>}
                            <span className="text-base font-semibold flex-grow">{product.title}</span>
                        </span>
                        <MdKeyboardArrowRight className={`text-2xl duration-300 ${isExpanded ? "rotate-90" : "rotate-0"}`} />
                    </motion.div>
                    
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden" 
                            >
                                {product.childrens.map((child, index) => (
                                    <NavLink
                                        key={index}
                                        to={child.path}
                                        onClick={closeMobileMenu}
                                        className={({ isActive }) => 
                                            `${mobileBaseClass} ml-8 text-sm ${isActive ? mobileActive : mobileInactive}`
                                        }
                                    >
                                        {child.icon && <div className="text-lg mr-3">{child.icon}</div>}
                                        <span className="truncate">{child.title}</span>
                                    </NavLink>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            );
        } else {
            return (
                <NavLink
                    to={product.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) => 
                        `${mobileBaseClass} ${isActive ? mobileActive : mobileInactive}`
                    }
                >
                    <motion.div whileTap={{scale: 0.98}} className="flex gap-4 items-center w-full">
                        {product.icon && <div className="text-xl">{product.icon}</div>}
                        <span className="text-base font-semibold">{product.title}</span>
                    </motion.div>
                </NavLink>
            );
        }
    }
};

export default SideBarItem;