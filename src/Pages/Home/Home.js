import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogIn, FiUserPlus, FiGrid, FiArrowRight, FiCheckCircle, FiActivity, FiLayers, FiZap } from "react-icons/fi";
import { FaSeedling, FaTractor, FaCloudUploadAlt, FaChartLine, FaLeaf, FaCrown } from "react-icons/fa"; 
import { AiFillGithub } from "react-icons/ai"; 

import IMAGE from "../../asset/inventary.png"; 
import LOGO from "../../asset/LOGOS.svg"; 
import { ShowOnLogout, ShowOnLogin } from "../../protect/HiddenLiks";
import SubscriptionPlans from "../../components/Subscription/SubscriptionPlans";

// --- VARIANTS DE ANIMACIÓN (PROFESIONALES Y ELEGANTES) ---
const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.6, ease: "easeOut" } 
    }
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const imageReveal = {
    hidden: { opacity: 0, scale: 0.95, x: 40 },
    visible: { 
        opacity: 1, 
        scale: 1, 
        x: 0,
        transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } 
    }
};

const Home = () => {
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            
            {/* --- BACKGROUND ELEMENTS --- */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-b from-emerald-50/80 to-transparent rounded-full blur-[120px] translate-x-1/3 -translate-y-1/4"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-t from-blue-50/60 to-transparent rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
            </div>

            {/* --- NAVBAR --- */}
            <nav className="relative z-50 w-full border-b border-gray-100/50 bg-white/80 backdrop-blur-md sticky top-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 flex items-center justify-center bg-emerald-100 rounded-xl text-emerald-600">
                                <img src={LOGO} alt="Logo" className="w-8 h-8 object-contain" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xl font-bold text-gray-900 tracking-tight leading-none">
                                    Horticultura del <span className="text-emerald-600">Sureste</span>
                                </span>
                                <span className="text-[10px] font-semibold text-gray-400 tracking-widest uppercase">Enterprise</span>
                            </div>
                        </Link>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <ShowOnLogout>
                                <Link to="/login">
                                    <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-emerald-700 transition-colors">
                                        <FiLogIn className="text-lg" />
                                        <span>Ingresar</span>
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                        <FiUserPlus className="text-lg" />
                                        <span>Registrarse</span>
                                    </button>
                                </Link>
                            </ShowOnLogout>

                            <ShowOnLogin>
                                <Link to="/acumuladoC">
                                    <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-sm font-bold rounded-lg shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2">
                                        <FiGrid className="text-lg" />
                                        <span>Dashboard</span>
                                    </button>
                                </Link>
                            </ShowOnLogin>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-24 lg:pt-20 lg:pb-32">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                    
                    {/* Left Content */}
                    <motion.div 
                        className="flex-1 text-center lg:text-left"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Plataforma de Gestión Integral
                        </motion.div>
                        
                        <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] mb-6 tracking-tight">
                            Potencia tu <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                                Agro-Negocio
                            </span>
                        </motion.h1>
                        
                        <motion.p variants={fadeInUp} className="text-lg text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                            Centraliza operaciones, monitorea cultivos en tiempo real y toma decisiones basadas en datos con la suite más completa para el sector agrícola.
                        </motion.p>

                        <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-12">
                            <ShowOnLogout>
                                <Link to="/register" className="w-full sm:w-auto">
                                    <button className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group">
                                        Prueba 7 Días Gratis
                                        <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                    <p className="text-xs text-gray-500 text-center mt-2">Sin tarjeta de crédito • Cancela cuando quieras</p>
                                </Link>
                                <button 
                                    onClick={() => setShowSubscriptionModal(true)}
                                    className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl shadow-xl shadow-purple-500/30 hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <FaCrown className="relative z-10" />
                                    <span className="relative z-10">Ver Planes</span>
                                    <FiZap className="relative z-10 text-yellow-300 group-hover:animate-pulse" />
                                </button>
                            </ShowOnLogout>
                        </motion.div>

                        {/* Stats / Features Row */}
                        <motion.div variants={fadeInUp} className="grid grid-cols-2 sm:grid-cols-4 gap-6 border-t border-gray-100 pt-8">
                            {[
                                { icon: FaSeedling, label: "Gestión de Cultivos", value: "+100%" },
                                { icon: FaChartLine, label: "Analítica Avanzada", value: "Real-time" },
                                { icon: FaCloudUploadAlt, label: "Datos en la Nube", value: "Seguro" },
                                { icon: FiLayers, label: "Multi-Plataforma", value: "24/7" }
                            ].map((item, index) => (
                                <div key={index} className="flex flex-col items-center lg:items-start">
                                    <div className="flex items-center gap-2 text-emerald-600 mb-1">
                                        <item.icon className="text-xl" />
                                        <span className="text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded text-emerald-700">{item.value}</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500">{item.label}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right Image */}
                    <motion.div 
                        className="flex-1 relative w-full max-w-2xl"
                        variants={imageReveal}
                        initial="hidden"
                        animate="visible"
                    >
                        <div className="relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                            
                            {/* Main Image */}
                            <img 
                                src={IMAGE} 
                                alt="Dashboard Interface" 
                                className="relative w-full rounded-2xl shadow-2xl border border-gray-200/50 bg-white"
                            />

                            {/* Floating Widget 1 */}
                            <motion.div 
                                className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden md:block"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <FaLeaf />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Productividad</p>
                                        <p className="text-lg font-bold text-gray-900">+24.5%</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Floating Widget 2 */}
                            <motion.div 
                                className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 hidden md:block"
                                animate={{ y: [0, 10, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                        <FiCheckCircle />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium">Estado del Sistema</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                            <p className="text-sm font-bold text-gray-900">Operativo</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* --- FOOTER SIMPLE --- */}
            <footer className="relative z-10 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-2">
                        <img src={LOGO} alt="Logo" className="w-6 h-6 grayscale opacity-50" />
                        <span className="text-sm text-gray-500">© {new Date().getFullYear()} HortiDash Enterprise.</span>
                    </div>
                    <div className="flex gap-6 text-sm text-gray-500">
                        <a href="#" className="hover:text-emerald-600 transition-colors">Política de Privacidad</a>
                        <a href="#" className="hover:text-emerald-600 transition-colors">Términos de Servicio</a>
                        <a href="https://github.com/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors text-lg">
                            <AiFillGithub />
                        </a>
                    </div>
                </div>
            </footer>

            {/* Modal de Suscripciones */}
            <SubscriptionPlans 
                isOpen={showSubscriptionModal} 
                onClose={() => setShowSubscriptionModal(false)} 
            />
        </div>
    );
};

export default Home;