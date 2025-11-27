import React from 'react';

// Icono simple de engranajes (simulando trabajo/mantenimiento)
// Normalmente usarías una librería como 'lucide-react' o 'react-icons'
const CogIcon = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="m4.93 4.93 1.41 1.41" />
    <path d="m17.66 17.66 1.41 1.41" />
    <path d="m2 12 2 0" />
    <path d="m20 12 2 0" />
    <path d="m4.93 19.07 1.41-1.41" />
    <path d="m17.66 6.34 1.41-1.41" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const HoraTrabajador = () => {
  return (
    // Contenedor principal: Altura mínima de pantalla, fondo sutil, centrado
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 transition-colors duration-500">
      
      {/* Contenedor del contenido: Estilo de tarjeta profesional y responsivo */}
      <div 
        className="
          w-full max-w-lg p-6 sm:p-10 
          bg-white shadow-2xl rounded-xl 
          text-center 
          transform transition-all duration-700 ease-in-out
          hover:shadow-3xl
        "
      >
        
        {/* Icono animado */}
        <div 
          className="
            mb-6 sm:mb-8 
            text-indigo-600 
            flex justify-center 
            transform transition-transform duration-700
            hover:scale-105
          "
        >
          {/* Aplicamos una animación personalizada de Tailwind para el giro */}
          <CogIcon className="w-16 h-16 sm:w-20 sm:h-20 animate-spin-slow" />
        </div>
        
        {/* Título principal */}
        <h1 
          className="
            text-3xl sm:text-4xl md:text-5xl 
            font-extrabold text-gray-900 
            mb-3 transition-opacity duration-700 delay-100
            opacity-100
          "
        >
          ¡Volveremos Pronto!
        </h1>
        
        {/* Descripción */}
        <p 
          className="
            text-lg text-gray-600 
            mb-8 sm:mb-10 
            transition-opacity duration-700 delay-200
            opacity-100
          "
        >
          Estamos realizando un mantenimiento programado para implementar mejoras significativas. Agradecemos tu paciencia y comprensión.
        </p>
        
        {/* Información de tiempo o contacto (adaptable) */}
        <div 
          className="
            bg-indigo-50 p-4 rounded-lg 
            border-l-4 border-indigo-500 
            mb-8 sm:mb-10 
            shadow-inner 
            transition-shadow duration-500
            hover:shadow-md
          "
        >
          <p className="text-indigo-800 font-semibold text-base sm:text-lg">
            Tiempo estimado de finalización: En menos de 4 horas.
          </p>
        </div>
        
        {/* Botón de Contacto o Redes Sociales */}
        <a
          href="mailto:soporte@tuempresa.com"
          className="
            inline-flex items-center justify-center 
            px-6 py-3 
            border border-transparent text-base font-medium rounded-full 
            text-white bg-indigo-600 
            shadow-lg 
            transition-all duration-300 ease-in-out 
            transform hover:scale-[1.02] hover:bg-indigo-700 
            focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50 
            w-full sm:w-auto
          "
        >
          Contáctanos para urgencias
        </a>

        {/* Pequeño pie de página profesional */}
        <p className="mt-8 text-sm text-gray-400">
          © {new Date().getFullYear()} Tu Empresa. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default HoraTrabajador;