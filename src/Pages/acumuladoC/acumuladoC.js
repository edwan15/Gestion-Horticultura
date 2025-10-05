// export default acumuladoC;
import React from "react";
import {
  Truck,
  BarChart2,
  Zap,
  LayoutList,
  CheckCircle,
  Droplet,
  Clock,
  MapPin,
} from "lucide-react";
import { Link } from "react-router-dom";

const acumuladoC = () => {
  // COORDENADAS PROPORCIONADAS (37.824927, -0.944296)
  const mapEmbedUrl =
    "https://maps.google.com/maps?q=37.824927,-0.944296&z=15&output=embed";

  return (
    // Contenedor principal: Altura y padding base ajustados para móviles.
    <div className="w-full max-w-7xl mx-auto p-3 sm:p-8 lg:p-12 min-h-[90vh] bg-white">
      {/* 1. SECCIÓN DE CABECERA Y TÍTULO */}
      <header className="text-center py-6 sm:py-12 border-b border-gray-200">
        <h1
          // Tamaño de fuente ajustado: 4xl en móvil, 6xl en tablet, 7xl en desktop.
          className="text-4xl sm:text-6xl lg:text-7xl font-extrabold mb-3 leading-tight
                                transform transition duration-500 hover:scale-[1.01] 
                                bg-gradient-to-r from-green-500 via-blue-600 to-indigo-600 
                                bg-clip-text text-transparent"
        >
          AGROANALYTICS
        </h1>
        <p className="text-lg sm:text-2xl text-gray-700 font-medium">
          La Herramienta Digital para la Gestión Inteligente del Cultivo.
        </p>
      </header>

      {/* 2. MISIÓN DEL DESARROLLADOR */}
      <section className="mt-8 mb-10 bg-blue-50 p-4 sm:p-8 rounded-xl shadow-lg transition duration-500 hover:shadow-2xl border-l-4 border-green-500">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-800 mb-3 flex items-center">
          <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 mr-2 animate-pulse" />
          Misión y Visión
        </h2>
        <p className="text-sm sm:text-lg text-gray-700 leading-relaxed">
          AgroAnalytics nace para cerrar la brecha entre la agricultura
          tradicional y la era digital. Nuestra misión es potenciar a cada
          productor con análisis de alto nivel sobre el riesgo, la carga laboral
          y la producción. Buscamos una gestión de datos sin precedentes que
          convierte la información en ventaja competitiva, optimizando la
          eficiencia de los cultivos de calabacín y pimientos para garantizar el
          máximo control y rendimiento económico.
        </p>
      </section>

      {/* 3. FUNCIONALIDADES CLAVE */}
      <section className="mt-10">
        <h2 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-8">
          Datos Específicos para Análisis de Alto Nivel
        </h2>

        {/* GRID RESPONSIVO: Mantiene el comportamiento adaptable. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Tarjeta 3: Producción Calabacín */}
          <Link to="/produccionC" className="block h-full">
            <Card
              icon={
                <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
              }
              title="Producción de Calabacín"
              description="Análisis de rendimiento por cosecha y área. Identifica tendencias de crecimiento para asegurar la calidad y volumen."
              bgColor="bg-green-50"
              hoverBorder="hover:border-green-600"
            />
          </Link>

          {/* Tarjeta 4: Producción Pimientos */}
          <Link to="/produccion" className="block h-full">
            <Card
              icon={
                <BarChart2 className="w-7 h-7 sm:w-8 sm:h-8 text-red-500" />
              }
              title="Produccion de Pimientos"
              description="Datos específicos sobre el grado de madurez y volumen de pimientos. Planificación de la recolección basada en la demanda."
              bgColor="bg-red-50"
              hoverBorder="hover:border-red-500"
            />
          </Link>

          {/* Tarjeta 1: Riego */}
          <Link to="/riego" className="block h-full">
            <Card
              icon={<Droplet className="w-7 h-7 sm:w-8 sm:h-8 text-blue-500" />}
              title="Control de Riego y Riesgos"
              description="Análisis de la eficiencia hídrica y variables de riesgo ambiental. Determina el momento y la cantidad óptima de agua."
              bgColor="bg-blue-50"
              hoverBorder="hover:border-blue-500"
            />
          </Link>

          {/* Tarjeta 2: Trabajadores */}
          <Link to="/panel/horas-trabajo" className="block h-full">
            <Card
              icon={<Clock className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-500" />}
              title="Gestión de Tiempos y Carga Laboral"
              description="Registro y análisis de horas de trabajadores. Mide la productividad por fase de cultivo para gestión de costes."
              bgColor="bg-indigo-50"
              hoverBorder="hover:border-indigo-500"
            />
          </Link>

          {/* Tarjeta 5: Gestión de Carga */}
          <Link to="/tarea" className="block h-full">
            <Card
              icon={<Truck className="w-7 h-7 sm:w-8 sm:h-8 text-yellow-600" />}
              title="Logística y Gestión de Carga"
              description="Optimización de las gestiones de carga post-cosecha. Control de inventario en tránsito para una distribución eficaz."
              bgColor="bg-yellow-50"
              hoverBorder="hover:border-yellow-600"
            />
          </Link>

          {/* Tarjeta 6: Control Total */}
          <Link to="/panel" className="block h-full">
            <Card
              icon={
                <LayoutList className="w-7 h-7 sm:w-8 sm:h-8 text-gray-500" />
              }
              title="Inventario de Productos"
              description="Visualización de datos clave de un vistazo para un control y gestión rápido. Indicadores de rendimiento (KPIs) en tiempo real."
              bgColor="bg-gray-50"
              hoverBorder="hover:border-gray-500"
            />
          </Link>
        </div>
      </section>

      {/* 5. SECCIÓN DEL MAPA */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-xl sm:text-4xl font-bold text-center text-gray-800 mb-6 sm:mb-8 flex items-center justify-center">
          <MapPin className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 mr-2 sm:mr-3" />
          Ubicación Específica del Cultivo
        </h2>

        <div
          // Proporción del mapa ajustada para ser un poco más cuadrada en móvil (16:9) y panorámica en desktop (16:7)
          className="w-full rounded-xl overflow-hidden shadow-2xl border-4 border-green-500 transform transition duration-300 hover:scale-[1.005]"
          style={{ aspectRatio: window.innerWidth < 640 ? "16 / 9" : "16 / 7" }}
          // NOTA: Usar window.innerWidth directamente en el style puede requerir un useState/useEffect para actualizar la vista.
          // UNA MEJOR ALTERNATIVA ES:
          // style={{ aspectRatio: '16 / 9' }} className="sm:aspect-[16/7]"
        >
          <iframe
            src={mapEmbedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de la parcela agrícola"
          ></iframe>
        </div>
        <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
          Coordenadas: 37.824927, -0.944296 (Balsicas, Murcia)
        </p>
      </section>

      {/* 6. LLAMADA A LA ACCIÓN / PIE DE PÁGINA */}
      <footer className="mt-12 sm:mt-16 text-center py-6 sm:py-8 border-t border-gray-200">
        <p className="text-sm text-gray-500 mb-4">
          Comienza hoy a optimizar cada aspecto de tu producción.
        </p>
        <Link to="/panel">
          <button className="px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 text-white font-semibold text-base sm:text-lg rounded-lg shadow-xl transition duration-300 hover:bg-indigo-700 transform hover:scale-105">
            Acceder al Panel de Control
          </button>
        </Link>
      </footer>
    </div>
  );
};

// =======================================================
// COMPONENTE AUXILIAR (Tarjeta con Transiciones Profesionales)
// =======================================================
const Card = ({ icon, title, description, bgColor, hoverBorder }) => {
  return (
    <div
      // Se asegura que la tarjeta ocupe toda la altura disponible en su contenedor flex.
      className={`
                ${bgColor} p-4 sm:p-6 rounded-xl shadow-lg 
                border-b-4 border-transparent transition-all duration-300 ease-in-out
                transform hover:scale-100 ${hoverBorder} hover:shadow-2xl
                flex flex-col items-center text-center h-full cursor-pointer
            `}
    >
      <div className="mb-3 sm:mb-4 p-2 sm:p-3 rounded-full bg-white shadow-md">
        {icon}
      </div>
      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-xs sm:text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default acumuladoC;
