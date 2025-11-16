// import React from "react";
// import Footer from "../Footer/Footer";
// import Header from "../Header/Header";

// const Layout = ({ children }) => {
//   return (
//     <div className="min-h-10vh ">
//       <Header />

//       <div className=" min-h-73vh">{children}</div>
//       <Footer className=" min-h-10vh " />
//     </div>
//   );
// };

// export default Layout;

// import React from "react";
// import Footer from "../Footer/Footer";
// import Header from "../Header/Header";

// const Layout = ({ children }) => {
//   // CLASES CORREGIDAS:
//   // 1. Añadimos 'flex flex-col' para usar Flexbox vertical.
//   // 2. Usamos 'h-full' o 'min-h-full' para asegurar que toma la altura de su padre (el <div> flex-1 del SideBar).
//   return (
//     <div className=" h-full flex-1">
//       <Header />

//       {/* El contenido se estira para llenar el espacio restante entre Header y Footer */}
//       <div className="flex-1 overflow-y-auto p-4 sm:p-6 border ">{children}</div>

//       <Footer />
//     </div>
//   );
// };

// export default Layout;


// import React from "react";
// import Footer from "../Footer/Footer";
// import Header from "../Header/Header";

// const Layout = ({ children }) => {
//   return (
//     // 🛑 CAMBIO CLAVE: Usamos 'min-h-screen' para que ocupe al menos el 100% de la altura del viewport.
//     // Usamos 'flex flex-col' para apilar Header, Contenido y Footer verticalmente.
//     <div className="min-h-screen flex flex-col bg-gray-50">
      
//       {/* 1. Header (Fijo) */}
//       {/* Se mantiene como un elemento normal, ocupando el espacio que necesita. */}
//       <Header />

//       {/* 2. Contenido Principal (Scrollable) */}
//       {/* 🛑 CAMBIO CLAVE: 'flex-grow' hace que este div se estire para ocupar todo el espacio restante. 
//          'overflow-y-auto' habilita el desplazamiento SOLAMENTE dentro de este contenedor.
//          El padding 'p-4' es excelente para móviles, 'sm:p-6' para pantallas más grandes. 
//          Añadimos 'w-full' para asegurar el ancho total.
//       */}
//       <main className="flex-grow w-full overflow-y-auto p-4 sm:p-6">
//           {children}
//       </main>

//       {/* 3. Footer (Fijo) */}
//       {/* Se mantiene como un elemento normal al final del Flex container. */}
//       <Footer />
//     </div>
//   );
// };

// export default Layout;




import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Layout = ({ children }) => {
    // 🛑 Estructura de layout principal: min-h-screen y flex-col
    return (
        // Fondo base de la aplicación. Usa 'min-h-screen' para garantizar altura mínima.
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />

            {/* Contenido: Toma el espacio restante y añade un padding general */}
            {/* Se elimina el 'border' que tenías para un look más limpio */}
            <main className="flex-1 w-full max-w-full mx-auto p-4 sm:p-6 lg:p-8">
                {children}
            </main>

            <Footer />
        </div>
    );
};

export default Layout;