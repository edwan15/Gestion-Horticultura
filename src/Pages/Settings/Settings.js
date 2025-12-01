import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MdPerson, 
    MdSecurity, 
    MdNotifications, 
    MdLanguage, 
    MdColorLens, 
    MdSave, 
    MdLock, 
    MdEmail, 
    MdPhone, 
    MdCheckCircle,
    MdOutlineAgriculture,
    MdVisibility,
    MdVisibilityOff
} from 'react-icons/md';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { selectUser } from "../../features/auth/authSlice/authSlice";

const Settings = () => {
    const user = useSelector(selectUser);
    const [activeTab, setActiveTab] = useState('account');
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados para formularios
    const [profileData, setProfileData] = useState({
        name: user?.name || 'Usuario',
        email: user?.email || 'usuario@horticultura.com',
        phone: user?.phone || '+34 600 000 000',
        role: user?.role || 'Agricultor'
    });

    const [securityData, setSecurityData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [preferences, setPreferences] = useState({
        emailNotifications: true,
        pushNotifications: false,
        theme: 'light',
        language: 'es'
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSave = async (section) => {
        setIsLoading(true);
        // Simulación de llamada al backend
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
        toast.success(`Configuración de ${section} actualizada correctamente`);
    };

    const TabButton = ({ id, icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                activeTab === id 
                ? 'bg-green-50 text-green-700 shadow-sm border border-green-100' 
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
        >
            <Icon className={`text-xl ${activeTab === id ? 'text-green-600' : 'text-gray-400'}`} />
            {label}
            {activeTab === id && (
                <motion.div 
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-green-500"
                />
            )}
        </button>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 sm:p-8">
            <div className="max-w-5xl mx-auto">
                
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded-lg text-white shadow-lg shadow-green-200">
                            <MdOutlineAgriculture className="text-2xl" />
                        </div>
                        Configuración Personal
                    </h1>
                    <p className="text-gray-500 mt-2 ml-14">Gestiona tu perfil, seguridad y preferencias del sistema.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* Sidebar de Navegación */}
                    <div className="lg:col-span-3 space-y-2">
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 sticky top-8">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">Menú</p>
                            <div className="space-y-1">
                                <TabButton id="account" icon={MdPerson} label="Mi Cuenta" />
                                <TabButton id="security" icon={MdSecurity} label="Seguridad" />
                                <TabButton id="notifications" icon={MdNotifications} label="Notificaciones" />
                                <TabButton id="preferences" icon={MdColorLens} label="Apariencia" />
                            </div>
                        </div>
                    </div>

                    {/* Área de Contenido */}
                    <div className="lg:col-span-9">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
                            >
                                {/* --- SECCIÓN CUENTA --- */}
                                {activeTab === 'account' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">Información del Perfil</h2>
                                                <p className="text-sm text-gray-500">Actualiza tu información personal y de contacto.</p>
                                            </div>
                                            <div className="relative group cursor-pointer">
                                                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-2xl font-bold text-green-700 border-2 border-white shadow-md">
                                                    {profileData.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-xs text-white font-medium">Editar</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Nombre Completo</label>
                                                <div className="relative">
                                                    <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Rol / Cargo</label>
                                                <div className="relative">
                                                    <MdOutlineAgriculture className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="text" 
                                                        value={profileData.role}
                                                        disabled
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Correo Electrónico</label>
                                                <div className="relative">
                                                    <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="email" 
                                                        value={profileData.email}
                                                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Teléfono</label>
                                                <div className="relative">
                                                    <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type="tel" 
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button 
                                                onClick={() => handleSave('perfil')}
                                                disabled={isLoading}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-70"
                                            >
                                                {isLoading ? 'Guardando...' : <><MdSave /> Guardar Cambios</>}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* --- SECCIÓN SEGURIDAD --- */}
                                {activeTab === 'security' && (
                                    <div className="space-y-8">
                                        <div className="border-b border-gray-100 pb-6">
                                            <h2 className="text-xl font-bold text-gray-800">Seguridad y Contraseña</h2>
                                            <p className="text-sm text-gray-500">Gestiona tu contraseña y métodos de autenticación.</p>
                                        </div>

                                        <div className="max-w-md space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Contraseña Actual</label>
                                                <div className="relative">
                                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                    <button 
                                                        onClick={() => setShowPassword(!showPassword)}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Nueva Contraseña</label>
                                                <div className="relative">
                                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                                                <div className="relative">
                                                    <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <input 
                                                        type={showPassword ? "text" : "password"}
                                                        className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all"
                                                        placeholder="••••••••"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3">
                                            <MdSecurity className="text-orange-500 text-xl mt-0.5" />
                                            <div>
                                                <h4 className="text-sm font-bold text-orange-800">Autenticación de Dos Factores (2FA)</h4>
                                                <p className="text-xs text-orange-700 mt-1">Añade una capa extra de seguridad a tu cuenta. Actualmente desactivado.</p>
                                                <button className="mt-2 text-xs font-semibold text-orange-600 hover:text-orange-800 underline">
                                                    Configurar 2FA
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-end pt-4">
                                            <button 
                                                onClick={() => handleSave('seguridad')}
                                                className="flex items-center gap-2 px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                            >
                                                <MdSave /> Actualizar Contraseña
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* --- SECCIÓN NOTIFICACIONES --- */}
                                {activeTab === 'notifications' && (
                                    <div className="space-y-8">
                                        <div className="border-b border-gray-100 pb-6">
                                            <h2 className="text-xl font-bold text-gray-800">Preferencias de Notificaciones</h2>
                                            <p className="text-sm text-gray-500">Elige cómo y cuándo quieres recibir alertas.</p>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg shadow-sm text-green-600">
                                                        <MdEmail />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">Notificaciones por Correo</p>
                                                        <p className="text-xs text-gray-500">Recibe resúmenes semanales y alertas importantes.</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={preferences.emailNotifications}
                                                        onChange={() => setPreferences({...preferences, emailNotifications: !preferences.emailNotifications})}
                                                        className="sr-only peer" 
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                            </div>

                                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 bg-white rounded-lg shadow-sm text-blue-600">
                                                        <MdNotifications />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-800">Notificaciones Push</p>
                                                        <p className="text-xs text-gray-500">Alertas en tiempo real en tu navegador.</p>
                                                    </div>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={preferences.pushNotifications}
                                                        onChange={() => setPreferences({...preferences, pushNotifications: !preferences.pushNotifications})}
                                                        className="sr-only peer" 
                                                    />
                                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* --- SECCIÓN PREFERENCIAS --- */}
                                {activeTab === 'preferences' && (
                                    <div className="space-y-8">
                                        <div className="border-b border-gray-100 pb-6">
                                            <h2 className="text-xl font-bold text-gray-800">Apariencia y Sistema</h2>
                                            <p className="text-sm text-gray-500">Personaliza tu experiencia visual en la plataforma.</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-gray-700 block">Idioma</label>
                                                <div className="relative">
                                                    <MdLanguage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    <select 
                                                        value={preferences.language}
                                                        onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-green-500 outline-none bg-white appearance-none cursor-pointer"
                                                    >
                                                        <option value="es">Español (España)</option>
                                                        <option value="en">English (US)</option>
                                                        <option value="fr">Français</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <label className="text-sm font-medium text-gray-700 block">Tema</label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <button 
                                                        onClick={() => setPreferences({...preferences, theme: 'light'})}
                                                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                                            preferences.theme === 'light' 
                                                            ? 'border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500' 
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                    >
                                                        <div className="w-4 h-4 rounded-full border border-gray-300 bg-white"></div>
                                                        <span className="text-sm font-medium">Claro</span>
                                                    </button>
                                                    <button 
                                                        onClick={() => setPreferences({...preferences, theme: 'dark'})}
                                                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                                                            preferences.theme === 'dark' 
                                                            ? 'border-green-500 bg-gray-800 text-white ring-1 ring-green-500' 
                                                            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                                        }`}
                                                    >
                                                        <div className="w-4 h-4 rounded-full border border-gray-500 bg-gray-900"></div>
                                                        <span className="text-sm font-medium">Oscuro</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
