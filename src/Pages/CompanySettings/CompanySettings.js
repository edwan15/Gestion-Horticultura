// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { MdBusiness, MdLocalFlorist, MdSave, MdEdit, MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdLanguage, MdGrass, MdWaterDrop, MdSunny, MdLocalFireDepartment, MdEco } from 'react-icons/md';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { useSelector } from 'react-redux';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4500";

// const CompanySettings = () => {
//     const [settings, setSettings] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);
//     const [isEditing, setIsEditing] = useState(false);
//     const token = useSelector((state) => state.auth.token);

//     // Datos simulados iniciales para demostración inmediata
//     const initialData = {
//         companyName: 'HORTICULTURA DEL SUR ESTE',
//          logo: 'https://srbrand.es/wp-content/uploads/2019/08/LOGO-horticultura-e1580474205656.jpg',
//         description: 'Empresa líder en producción agrícola de hortalizas de calidad premium. Especializados en cultivos de invernadero con tecnología sostenible.',
//         contactInfo: {
//             email: 'info@horticulturasureste.com',
//             phone: '+34 950 123 456',
//             address: 'Polígono Industrial Agrícola, Almería, España',
//         },
//         mainCrops: [
//             { name: 'Pimientos', icon: 'pepper', color: 'bg-red-100 text-red-600', active: true, hectares: 15, desc: 'Variedades California y Lamuyo' },
//             { name: 'Calabacín', icon: 'zucchini', color: 'bg-green-100 text-green-600', active: true, hectares: 12, desc: 'Producción todo el año' },
//             { name: 'Lechuga', icon: 'lettuce', color: 'bg-lime-100 text-lime-600', active: true, hectares: 10, desc: 'Iceberg y Romana' },
//             { name: 'Melones', icon: 'melon', color: 'bg-amber-100 text-amber-600', active: true, hectares: 8, desc: 'Piel de Sapo y Galia' },
//             { name: 'Sandías', icon: 'watermelon', color: 'bg-pink-100 text-pink-600', active: true, hectares: 10, desc: 'Sin pepitas y rayada' }
//         ]
//     };

//     useEffect(() => {
//         // Aquí cargaríamos del backend, por ahora usamos datos iniciales
//         setSettings(initialData);
//         setIsLoading(false);
//     }, []);

//     const handleSave = async () => {
//         setIsEditing(false);
//         toast.success('Configuración guardada exitosamente');
//         // Aquí iría la llamada al backend para guardar
//     };

//     const getIcon = (name) => {
//         switch(name) {
//             case 'pepper': return <MdLocalFireDepartment />;
//             case 'zucchini': return <MdGrass />;
//             case 'lettuce': return <MdEco />;
//             case 'melon': return <MdSunny />;
//             case 'watermelon': return <MdWaterDrop />;
//             default: return <MdLocalFlorist />;
//         }
//     };

//     if (isLoading) return <div className="p-8 text-center">Cargando configuración...</div>;

//     return (
//         <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
//             <div className="max-w-6xl mx-auto">
                
//                 {/* Header de la página */}
//                 <div className="flex justify-between items-center mb-8">
//                     <div>
//                         <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
//                             <MdBusiness className="text-green-600" />
//                             Mi Empresa
//                         </h1>
//                         <p className="text-gray-500 mt-1">Gestión de perfil corporativo y cultivos</p>
//                     </div>
//                     <button 
//                         onClick={() => isEditing ? handleSave() : setIsEditing(true)}
//                         className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm ${
//                             isEditing 
//                             ? 'bg-green-600 text-white hover:bg-green-700' 
//                             : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
//                         }`}
//                     >
//                         {isEditing ? <><MdSave /> Guardar Cambios</> : <><MdEdit /> Editar Perfil</>}
//                     </button>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
//                     {/* Columna Izquierda: Info General */}
//                     <div className="lg:col-span-2 space-y-8">
                        
//                         {/* Tarjeta de Identidad */}
//                         <motion.div 
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative"
//                         >
//                             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
//                             <div className="flex flex-col sm:flex-row gap-6 items-start">
//                                <div className="w-24 h-24 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shadow-inner shrink-0 overflow-hidden">
//     {settings.logo ? (
//         <img 
//             src={settings.logo} 
//             alt={`${settings.companyName} Logo`} 
//             className="w-full h-full object-contain p-2" // p-2 para darle un poco de margen interno
//         />
//     ) : (
//         // Opción de reserva si el logo no está cargado o es null
//         <MdLocalFlorist className="text-4xl text-green-600" />
//     )}
// </div> <div className="w-24 h-24 rounded-xl bg-green-50 flex items-center justify-center text-4xl text-green-600 border border-green-100 shadow-inner shrink-0">
//                                     <MdLocalFlorist />
//                                 </div>
//                                 <div className="flex-1 w-full">
//                                     {isEditing ? (
//                                         <input 
//                                             type="text" 
//                                             value={settings.companyName}
//                                             onChange={(e) => setSettings({...settings, companyName: e.target.value})}
//                                             className="text-2xl font-bold text-gray-800 w-full border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent mb-2"
//                                         />
//                                     ) : (
//                                         <h2 className="text-2xl font-bold text-gray-800 mb-2">{settings.companyName}</h2>
//                                     )}
                                    
//                                     {isEditing ? (
//                                         <textarea 
//                                             value={settings.description}
//                                             onChange={(e) => setSettings({...settings, description: e.target.value})}
//                                             className="w-full text-gray-600 border rounded-lg p-2 focus:ring-2 focus:ring-green-200 outline-none"
//                                             rows="3"
//                                         />
//                                     ) : (
//                                         <p className="text-gray-600 leading-relaxed">{settings.description}</p>
//                                     )}
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Sección de Cultivos */}
//                         <motion.div 
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ delay: 0.1 }}
//                         >
//                             <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
//                                 <MdGrass className="text-green-600" />
//                                 Cultivos Principales
//                             </h3>
//                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                                 {settings.mainCrops.map((crop, index) => (
//                                     <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
//                                         <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${crop.color}`}>
//                                             {getIcon(crop.icon)}
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex justify-between items-center">
//                                                 <h4 className="font-bold text-gray-800">{crop.name}</h4>
//                                                 <span className={`text-xs px-2 py-1 rounded-full ${crop.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
//                                                     {crop.active ? 'Activo' : 'Inactivo'}
//                                                 </span>
//                                             </div>
//                                             <p className="text-xs text-gray-500 mt-1">{crop.desc}</p>
//                                             <div className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-600">
//                                                 <span className="bg-gray-100 px-2 py-0.5 rounded">{crop.hectares} Has</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         </motion.div>

//                     </div>

//                     {/* Columna Derecha: Contacto y Configuración */}
//                     <div className="space-y-8">
                        
//                         {/* Información de Contacto */}
//                         <motion.div 
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.2 }}
//                             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
//                         >
//                             <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Contacto</h3>
//                             <div className="space-y-4">
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-1 text-green-600"><MdEmail /></div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
//                                         <p className="text-gray-700">{settings.contactInfo.email}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-1 text-green-600"><MdPhone /></div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase font-semibold">Teléfono</p>
//                                         <p className="text-gray-700">{settings.contactInfo.phone}</p>
//                                     </div>
//                                 </div>
//                                 <div className="flex items-start gap-3">
//                                     <div className="mt-1 text-green-600"><MdLocationOn /></div>
//                                     <div>
//                                         <p className="text-xs text-gray-500 uppercase font-semibold">Dirección</p>
//                                         <p className="text-gray-700">{settings.contactInfo.address}</p>
//                                     </div>
//                                 </div>
//                             </div>
//                         </motion.div>

//                         {/* Preferencias */}
//                         <motion.div 
//                             initial={{ opacity: 0, x: 20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ delay: 0.3 }}
//                             className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
//                         >
//                             <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Sistema</h3>
//                             <div className="space-y-4">
//                                 <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <MdLanguage className="text-gray-400" />
//                                         <span className="text-gray-700">Idioma</span>
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-900">Español (ES)</span>
//                                 </div>
//                                 <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
//                                     <div className="flex items-center gap-3">
//                                         <MdAccessTime className="text-gray-400" />
//                                         <span className="text-gray-700">Zona Horaria</span>
//                                     </div>
//                                     <span className="text-sm font-medium text-gray-900">Madrid (CET)</span>
//                                 </div>
//                             </div>
//                         </motion.div>

//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CompanySettings;





import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdBusiness, MdLocalFlorist, MdSave, MdEdit, MdPhone, MdEmail, MdLocationOn, MdAccessTime, MdLanguage, MdGrass, MdWaterDrop, MdSunny, MdLocalFireDepartment, MdEco } from 'react-icons/md';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:4500";

const CompanySettings = () => {
    const [settings, setSettings] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const token = useSelector((state) => state.auth.token);

    // Datos simulados iniciales para demostración inmediata
    const initialData = {
        companyName: 'HORTICULTURA DEL SUR ESTE',
        // *** 1. LOGO MOVIDO AQUÍ (Nivel superior) ***
        logo: 'https://srbrand.es/wp-content/uploads/2019/08/LOGO-horticultura-e1580474205656.jpg', 
        // **********************************************
        description: 'Empresa líder en producción agrícola de hortalizas de calidad premium. Especializados en cultivos de invernadero con tecnología sostenible.',
        contactInfo: {
            email: 'info@horticulturasureste.com',
            phone: '+34 950 123 456',
            address: 'Polígono Industrial Agrícola, Almería, España',
            // El logo ya no está aquí
        },
        mainCrops: [
            { name: 'Pimientos', icon: 'pepper', color: 'bg-red-100 text-red-600', active: true, hectares: 15, desc: 'Variedades California y Lamuyo' },
            { name: 'Calabacín', icon: 'zucchini', color: 'bg-green-100 text-green-600', active: true, hectares: 12, desc: 'Producción todo el año' },
            { name: 'Lechuga', icon: 'lettuce', color: 'bg-lime-100 text-lime-600', active: true, hectares: 10, desc: 'Iceberg y Romana' },
            { name: 'Melones', icon: 'melon', color: 'bg-amber-100 text-amber-600', active: true, hectares: 8, desc: 'Piel de Sapo y Galia' },
            { name: 'Sandías', icon: 'watermelon', color: 'bg-pink-100 text-pink-600', active: true, hectares: 10, desc: 'Sin pepitas y rayada' }
        ]
    };

    useEffect(() => {
        setSettings(initialData);
        setIsLoading(false);
    }, []);

    const handleSave = async () => {
        setIsEditing(false);
        toast.success('Configuración guardada exitosamente');
        // Aquí iría la llamada al backend para guardar
    };

    const getIcon = (name) => {
        switch(name) {
            case 'pepper': return <MdLocalFireDepartment />;
            case 'zucchini': return <MdGrass />;
            case 'lettuce': return <MdEco />;
            case 'melon': return <MdSunny />;
            case 'watermelon': return <MdWaterDrop />;
            default: return <MdLocalFlorist />;
        }
    };

    if (isLoading) return <div className="p-8 text-center">Cargando configuración...</div>;

    return (
        <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                
                {/* Header de la página */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                            <MdBusiness className="text-green-600" />
                            Mi Empresa
                        </h1>
                        <p className="text-gray-500 mt-1">Gestión de perfil corporativo y cultivos</p>
                    </div>
                    <button 
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className={`px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm ${
                            isEditing 
                            ? 'bg-green-600 text-white hover:bg-green-700' 
                            : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {isEditing ? <><MdSave /> Guardar Cambios</> : <><MdEdit /> Editar Perfil</>}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Columna Izquierda: Info General */}
                    <div className="lg:col-span-2 space-y-8">
                        
                        {/* Tarjeta de Identidad */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-600"></div>
                            <div className="flex flex-col sm:flex-row gap-6 items-start">
                                
                                {/* *** 2. REEMPLAZO DEL ÍCONO POR LA IMAGEN *** */}
                                <div className="w-24 h-24 rounded-xl bg-green-50 flex items-center justify-center border border-green-100 shadow-inner shrink-0 overflow-hidden">
                                    {settings.logo ? (
                                        <img 
                                            src={settings.logo} 
                                            alt={`${settings.companyName} Logo`} 
                                            className="w-full h-full object-contain p-2"
                                        />
                                    ) : (
                                        <MdLocalFlorist className="text-4xl text-green-600" />
                                    )}
                                </div>
                                {/* ********************************************** */}
                                
                                <div className="flex-1 w-full">
                                    {isEditing ? (
                                        <input 
                                            type="text" 
                                            value={settings.companyName}
                                            onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                                            className="text-2xl font-bold text-gray-800 w-full border-b-2 border-green-200 focus:border-green-500 outline-none bg-transparent mb-2"
                                        />
                                    ) : (
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{settings.companyName}</h2>
                                    )}
                                    
                                    {isEditing ? (
                                        <textarea 
                                            value={settings.description}
                                            onChange={(e) => setSettings({...settings, description: e.target.value})}
                                            className="w-full text-gray-600 border rounded-lg p-2 focus:ring-2 focus:ring-green-200 outline-none"
                                            rows="3"
                                        />
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed">{settings.description}</p>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Sección de Cultivos */}
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <MdGrass className="text-green-600" />
                                Cultivos Principales
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {settings.mainCrops.map((crop, index) => (
                                    <div key={index} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${crop.color}`}>
                                            {getIcon(crop.icon)}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-gray-800">{crop.name}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${crop.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    {crop.active ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">{crop.desc}</p>
                                            <div className="mt-2 flex items-center gap-2 text-xs font-medium text-gray-600">
                                                <span className="bg-gray-100 px-2 py-0.5 rounded">{crop.hectares} Has</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                    </div>

                    {/* Columna Derecha: Contacto y Configuración */}
                    <div className="space-y-8">
                        
                        {/* Información de Contacto */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Contacto</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-green-600"><MdEmail /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                        <p className="text-gray-700">{settings.contactInfo.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-green-600"><MdPhone /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Teléfono</p>
                                        <p className="text-gray-700">{settings.contactInfo.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 text-green-600"><MdLocationOn /></div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Dirección</p>
                                        <p className="text-gray-700">{settings.contactInfo.address}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Preferencias */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                        >
                            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Sistema</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MdLanguage className="text-gray-400" />
                                        <span className="text-gray-700">Idioma</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Español (ES)</span>
                                </div>
                                <div className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg transition-colors">
                                    <div className="flex items-center gap-3">
                                        <MdAccessTime className="text-gray-400" />
                                        <span className="text-gray-700">Zona Horaria</span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">Madrid (CET)</span>
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompanySettings;