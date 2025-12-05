import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiCreditCard, FiLock, FiCheck, FiAlertCircle } from "react-icons/fi";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Cargar Stripe con la clave pública desde variables de entorno
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ plan, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Crear Payment Intent en tu backend
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-subscription`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    planId: plan.id,
                    email: email,
                    name: name,
                }),
            });

            const { clientSecret, subscriptionId } = await response.json();

            // 2. Confirmar el pago con Stripe
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: name,
                        email: email,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            // 3. Pago exitoso
            if (paymentIntent.status === "succeeded") {
                onSuccess(subscriptionId);
            }
        } catch (err) {
            setError("Error al procesar el pago. Por favor, inténtalo de nuevo.");
            console.error("Error:", err);
        }

        setLoading(false);
    };

    const cardElementOptions = {
        style: {
            base: {
                fontSize: "16px",
                color: "#1f2937",
                fontFamily: "system-ui, -apple-system, sans-serif",
                "::placeholder": {
                    color: "#9ca3af",
                },
            },
            invalid: {
                color: "#ef4444",
            },
        },
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Plan Summary - Más compacto */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">Plan {plan.name}</h3>
                    <div className="text-right">
                        <p className="text-lg sm:text-xl font-extrabold text-emerald-700">{plan.price}<span className="text-xs font-medium">/mes</span></p>
                        <p className="text-xs text-gray-600">Total: {plan.totalPrice}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-700 bg-emerald-100 px-2 py-1.5 rounded">
                    <FiCheck className="flex-shrink-0" />
                    <span className="font-semibold">7 días de prueba gratis</span>
                </div>
            </div>

            {/* Customer Information - Más compacto */}
            <div className="space-y-3">
                <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Nombre Completo
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="Juan Pérez"
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        placeholder="juan@ejemplo.com"
                    />
                </div>

                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                        <FiCreditCard className="inline mr-1" />
                        Información de Tarjeta
                    </label>
                    <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500 transition-all bg-white">
                        <CardElement options={cardElementOptions} />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <FiAlertCircle className="text-red-600 flex-shrink-0 mt-0.5 text-sm" />
                    <p className="text-xs sm:text-sm text-red-700">{error}</p>
                </div>
            )}

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                <FiLock className="text-emerald-600 flex-shrink-0" />
                <span>Pago seguro procesado por Stripe</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="flex-1 px-4 py-2.5 text-sm bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Procesando..." : "Confirmar Pago"}
                </button>
            </div>
        </form>
    );
};

const StripeCheckout = ({ isOpen, onClose, selectedPlan }) => {
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    console.log("🟢 StripeCheckout renderizado:", { isOpen, selectedPlan: selectedPlan?.name });

    const handleSuccess = (subscriptionId) => {
        setPaymentSuccess(true);
        // Aquí puedes redirigir al usuario o actualizar el estado de la aplicación
        setTimeout(() => {
            onClose();
            // Redirigir al dashboard o mostrar mensaje de éxito
            window.location.href = "/acumuladoC";
        }, 3000);
    };

    if (!isOpen || !selectedPlan) {
        console.log("❌ Modal NO se muestra. isOpen:", isOpen, "selectedPlan:", selectedPlan);
        return null;
    }

    console.log("✅ Modal SE DEBE MOSTRAR");

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-lg max-h-[95vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl"
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-all"
                >
                    <FiX className="text-lg" />
                </button>

                {/* Header - Más compacto */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-4 text-white">
                    <h2 className="text-lg sm:text-xl font-extrabold mb-0.5">Finalizar Suscripción</h2>
                    <p className="text-xs sm:text-sm text-emerald-100">Completa tu información de pago</p>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                    {paymentSuccess ? (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-8"
                        >
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FiCheck className="text-3xl text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">¡Pago Exitoso!</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Tu suscripción ha sido activada. Redirigiendo...
                            </p>
                            <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-emerald-200 border-t-emerald-600"></div>
                        </motion.div>
                    ) : (
                        <Elements stripe={stripePromise}>
                            <CheckoutForm
                                plan={selectedPlan}
                                onSuccess={handleSuccess}
                                onCancel={onClose}
                            />
                        </Elements>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default StripeCheckout;
