import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    FiX, 
    FiCheck, 
    FiZap, 
    FiTrendingUp, 
    FiAward,
    FiClock,
    FiShield,
    FiUsers,
    FiDatabase,
    FiBarChart2
} from "react-icons/fi";
import { FaCrown, FaRocket } from "react-icons/fa";
import StripeCheckout from "./StripeCheckout";

const SubscriptionPlans = ({ isOpen, onClose }) => {
    const [selectedPlan, setSelectedPlan] = useState("monthly");
    const [showCheckout, setShowCheckout] = useState(false);
    const [planForCheckout, setPlanForCheckout] = useState(null);

    // Planes de suscripción (Basado en €3500/año)
    const plans = [
        {
            id: "monthly",
            name: "Mensual",
            duration: "1 mes",
            price: "€364.58",
            priceValue: 364.58,
            totalPrice: "€364.58",
            period: "/mes",
            description: "Ideal para probar la plataforma",
            icon: FiClock,
            color: "emerald",
            popular: false,
            savings: null,
            features: [
                "Acceso completo a todas las funciones",
                "Gestión de cultivos ilimitada",
                "Reportes y analíticas en tiempo real",
                "Soporte técnico por email",
                "Actualizaciones automáticas",
                "1 usuario incluido"
            ]
        },
        {
            id: "quarterly",
            name: "Trimestral",
            duration: "3 meses",
            price: "€328.13",
            priceValue: 328.13,
            totalPrice: "€984.39",
            period: "/mes",
            description: "Ahorra 10% con este plan",
            icon: FiTrendingUp,
            color: "blue",
            popular: false,
            savings: "10%",
            features: [
                "Todo lo del plan mensual",
                "10% de descuento",
                "Soporte prioritario",
                "Hasta 3 usuarios",
                "Exportación de datos avanzada",
                "Integraciones básicas"
            ]
        },
        {
            id: "biannual",
            name: "Semestral",
            duration: "6 meses",
            price: "€310.42",
            priceValue: 310.42,
            totalPrice: "€1,862.52",
            period: "/mes",
            description: "El más popular entre empresas",
            icon: FaRocket,
            color: "purple",
            popular: true,
            savings: "15%",
            features: [
                "Todo lo del plan trimestral",
                "15% de descuento",
                "Soporte prioritario 24/7",
                "Hasta 5 usuarios",
                "API de integración completa",
                "Capacitación personalizada"
            ]
        },
        {
            id: "annual",
            name: "Anual",
            duration: "12 meses",
            price: "€291.67",
            priceValue: 291.67,
            totalPrice: "€3,500",
            period: "/mes",
            description: "Máximo ahorro y beneficios",
            icon: FaCrown,
            color: "amber",
            popular: false,
            savings: "20%",
            features: [
                "Todo lo del plan semestral",
                "20% de descuento",
                "Gestor de cuenta dedicado",
                "Usuarios ilimitados",
                "Personalización avanzada",
                "Consultoría estratégica trimestral"
            ]
        }
    ];

    const colorClasses = {
        emerald: {
            bg: "bg-emerald-50",
            border: "border-emerald-200",
            text: "text-emerald-700",
            button: "bg-emerald-600 hover:bg-emerald-700",
            gradient: "from-emerald-500 to-teal-500",
            ring: "ring-emerald-500/20"
        },
        blue: {
            bg: "bg-blue-50",
            border: "border-blue-200",
            text: "text-blue-700",
            button: "bg-blue-600 hover:bg-blue-700",
            gradient: "from-blue-500 to-cyan-500",
            ring: "ring-blue-500/20"
        },
        purple: {
            bg: "bg-purple-50",
            border: "border-purple-200",
            text: "text-purple-700",
            button: "bg-purple-600 hover:bg-purple-700",
            gradient: "from-purple-500 to-pink-500",
            ring: "ring-purple-500/20"
        },
        amber: {
            bg: "bg-amber-50",
            border: "border-amber-200",
            text: "text-amber-700",
            button: "bg-amber-600 hover:bg-amber-700",
            gradient: "from-amber-500 to-orange-500",
            ring: "ring-amber-500/20"
        }
    };

    const handleSelectPlan = (plan) => {
        console.log("🔵 Plan seleccionado:", plan);
        setSelectedPlan(plan.id);
        setPlanForCheckout(plan);
        setShowCheckout(true);
        console.log("🔵 Modal de checkout abierto:", true);
    };

    const handleCloseCheckout = () => {
        console.log("🔴 Cerrando modal de checkout");
        setShowCheckout(false);
        setPlanForCheckout(null);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                {/* Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                    onClick={onClose}
                />

                {/* Modal Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="relative w-full max-w-7xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                    >
                        <FiX className="text-xl" />
                    </button>

                    {/* Header */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 px-8 py-12 text-center">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
                        </div>

                        <div className="relative z-10">
                            {/* Free Trial Badge */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold mb-6"
                            >
                                <FiZap className="text-yellow-300" />
                                <span>7 DÍAS DE PRUEBA GRATIS</span>
                                <FiZap className="text-yellow-300" />
                            </motion.div>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
                                Elige tu Plan Perfecto
                            </h2>
                            <p className="text-lg text-white/90 max-w-2xl mx-auto">
                                Comienza con 7 días gratis. Sin tarjeta de crédito requerida. Cancela cuando quieras.
                            </p>
                        </div>
                    </div>

                    {/* Plans Grid */}
                    <div className="px-8 py-12 bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
                            {plans.map((plan, index) => {
                                const colors = colorClasses[plan.color];
                                const Icon = plan.icon;
                                const isSelected = selectedPlan === plan.id;

                                return (
                                    <motion.div
                                        key={plan.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className={`relative bg-white rounded-xl border-2 transition-all duration-300 ${
                                            plan.popular
                                                ? "border-purple-500 shadow-xl shadow-purple-500/20 scale-105"
                                                : isSelected
                                                ? `${colors.border} shadow-lg ${colors.ring} ring-4`
                                                : "border-gray-200 hover:border-gray-300 hover:shadow-md"
                                        }`}
                                    >
                                        {/* Popular Badge */}
                                        {plan.popular && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                                <div className="flex items-center gap-1 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold shadow-lg">
                                                    <FiAward className="text-sm" />
                                                    MÁS POPULAR
                                                </div>
                                            </div>
                                        )}

                                        {/* Savings Badge */}
                                        {plan.savings && (
                                            <div className="absolute -top-3 -right-3 z-10">
                                                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-xs shadow-lg`}>
                                                    Ahorra<br/>{plan.savings}
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            {/* Icon & Name */}
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center`}>
                                                    <Icon className="text-2xl" />
                                                </div>
                                                <div>
                                                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                                    <p className="text-xs text-gray-500">{plan.duration}</p>
                                                </div>
                                            </div>

                                            {/* Price */}
                                            <div className="mb-4">
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                                                    <span className="text-gray-500 font-medium">{plan.period}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Total: <span className="font-bold text-gray-700">{plan.totalPrice}</span>
                                                </p>
                                            </div>

                                            {/* CTA Button */}
                                            <button
                                                onClick={() => handleSelectPlan(plan)}
                                                className={`w-full py-3 px-4 rounded-lg font-bold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl ${colors.button}`}
                                            >
                                                Continuar al Pago
                                            </button>

                                            {/* Features List */}
                                            <div className="mt-6 space-y-3">
                                                {plan.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-start gap-2">
                                                        <FiCheck className={`text-lg ${colors.text} mt-0.5 flex-shrink-0`} />
                                                        <span className="text-sm text-gray-700">{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Trust Indicators */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {[
                                { icon: FiShield, title: "Pago Seguro", desc: "Encriptación SSL de 256 bits" },
                                { icon: FiUsers, title: "Soporte 24/7", desc: "Equipo disponible siempre" },
                                { icon: FiDatabase, title: "Datos Protegidos", desc: "Backup automático diario" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                        <item.icon className="text-lg" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                                        <p className="text-xs text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer Note */}
                        <p className="text-center text-sm text-gray-500 mt-8">
                            * Los precios se actualizarán próximamente. Todos los planes incluyen 7 días de prueba gratuita.
                        </p>
                    </div>
                </motion.div>

                {/* Stripe Checkout Modal */}
                <StripeCheckout
                    isOpen={showCheckout}
                    onClose={handleCloseCheckout}
                    selectedPlan={planForCheckout}
                />
            </div>
        </AnimatePresence>
    );
};

export default SubscriptionPlans;
