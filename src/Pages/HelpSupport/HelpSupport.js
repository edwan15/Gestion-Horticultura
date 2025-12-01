import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdHelp, MdSearch, MdExpandMore, MdExpandLess, MdEmail, MdPhone, MdChat, MdDescription, MdPlayCircle, MdBook } from 'react-icons/md';
import { toast } from 'react-toastify';

const HelpSupport = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('faqs'); // faqs, guides, contact

    const faqs = [
        {
            question: "¿Cómo registro una nueva cosecha?",
            answer: "Ve a la sección 'Producción', selecciona el cultivo y haz clic en 'Nueva Cosecha'. Ingresa los kilos recolectados y la fecha."
        },
        {
            question: "¿Cómo actualizo el inventario de fertilizantes?",
            answer: "En el módulo 'Inventario', busca el producto y usa la opción 'Ajustar Stock'. Puedes registrar entradas o salidas."
        },
        {
            question: "¿Puedo exportar los informes a PDF?",
            answer: "Sí, en la sección de 'Finanzas' y 'Producción' encontrarás un botón de descarga en la esquina superior derecha de cada informe."
        },
        {
            question: "¿Cómo añado un nuevo trabajador?",
            answer: "Solo los administradores pueden añadir personal. Ve a 'Personal' > 'Añadir Empleado' y completa el formulario con sus datos."
        },
        {
            question: "¿Qué hago si olvido mi contraseña?",
            answer: "En la pantalla de inicio de sesión, haz clic en '¿Olvidaste tu contraseña?'. Recibirás un correo para restablecerla."
        }
    ];

    const guides = [
        { title: "Guía de Inicio Rápido", icon: <MdDescription />, desc: "Configura tu cuenta y empieza en 5 minutos." },
        { title: "Gestión de Plagas", icon: <MdBook />, desc: "Protocolos de actuación y registro de incidencias." },
        { title: "Tutorial de Riego", icon: <MdPlayCircle />, desc: "Video explicativo sobre el sistema de riego automatizado." },
        { title: "Control de Costes", icon: <MdDescription />, desc: "Aprende a imputar costes directos e indirectos." }
    ];

    const handleContactSubmit = (e) => {
        e.preventDefault();
        toast.success("Mensaje enviado. Te contactaremos pronto.");
    };

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <MdHelp className="text-green-600" />
                        Centro de Ayuda
                    </h1>
                    <p className="text-gray-500">¿En qué podemos ayudarte hoy?</p>
                    
                    <div className="mt-6 max-w-xl mx-auto relative">
                        <MdSearch className="absolute left-4 top-3.5 text-gray-400 text-xl" />
                        <input 
                            type="text" 
                            placeholder="Buscar ayuda, artículos, guías..." 
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none shadow-sm transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Tabs de Navegación */}
                <div className="flex justify-center gap-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('faqs')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'faqs' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Preguntas Frecuentes
                    </button>
                    <button 
                        onClick={() => setActiveTab('guides')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'guides' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Guías y Recursos
                    </button>
                    <button 
                        onClick={() => setActiveTab('contact')}
                        className={`px-6 py-2 rounded-full font-medium transition-colors ${activeTab === 'contact' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
                    >
                        Contacto
                    </button>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 min-h-[400px]">
                    
                    {/* FAQs */}
                    {activeTab === 'faqs' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                            {faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase())).map((faq, index) => (
                                <FAQItem key={index} question={faq.question} answer={faq.answer} />
                            ))}
                            {faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                <p className="text-center text-gray-500 py-8">No se encontraron resultados para tu búsqueda.</p>
                            )}
                        </motion.div>
                    )}

                    {/* Guías */}
                    {activeTab === 'guides' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {guides.map((guide, index) => (
                                <div key={index} className="p-6 rounded-xl border border-gray-100 hover:border-green-200 hover:shadow-md transition-all cursor-pointer group bg-gray-50 hover:bg-white">
                                    <div className="text-3xl text-green-600 mb-4 group-hover:scale-110 transition-transform w-fit">
                                        {guide.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-800 mb-2">{guide.title}</h3>
                                    <p className="text-sm text-gray-500">{guide.desc}</p>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Contacto */}
                    {activeTab === 'contact' && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800 mb-4">Envíanos un mensaje</h3>
                                <form onSubmit={handleContactSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Asunto</label>
                                        <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none">
                                            <option>Soporte Técnico</option>
                                            <option>Facturación</option>
                                            <option>Sugerencia</option>
                                            <option>Otro</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                                        <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-100 outline-none h-32" placeholder="Describe tu problema..."></textarea>
                                    </div>
                                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition-colors">
                                        Enviar Mensaje
                                    </button>
                                </form>
                            </div>
                            <div className="space-y-6 flex flex-col justify-center bg-green-50 p-6 rounded-xl">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                        <MdEmail className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Email</p>
                                        <p className="text-green-700">soporte@horticulturasureste.com</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                        <MdPhone className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Teléfono</p>
                                        <p className="text-green-700">+34 900 123 456</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
                                        <MdChat className="text-xl" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-800">Chat en Vivo</p>
                                        <p className="text-green-700">Disponible 9:00 - 18:00</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left"
            >
                <span className="font-semibold text-gray-800">{question}</span>
                {isOpen ? <MdExpandLess className="text-green-600 text-xl" /> : <MdExpandMore className="text-gray-400 text-xl" />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="bg-gray-50 px-4 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100"
                    >
                        <div className="pt-2">{answer}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HelpSupport;
