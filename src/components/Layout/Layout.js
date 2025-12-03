import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import FloatingActionButton from "../FloatingActionButton/FloatingActionButton";

const Layout = ({ children, onMenuToggle }) => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header onMenuToggle={onMenuToggle} />

            <main className="flex-1 w-full max-w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>

            <Footer />
            
            {/* Botón Flotante Global */}
            <FloatingActionButton />
        </div>
    );
};

export default Layout;