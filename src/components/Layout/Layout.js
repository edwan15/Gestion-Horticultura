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

import React from "react";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

const Layout = ({ children }) => {
  // CLASES CORREGIDAS:
  // 1. Añadimos 'flex flex-col' para usar Flexbox vertical.
  // 2. Usamos 'h-full' o 'min-h-full' para asegurar que toma la altura de su padre (el <div> flex-1 del SideBar).
  return (
    <div className=" h-full flex-1">
      <Header />

      {/* El contenido se estira para llenar el espacio restante entre Header y Footer */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</div>

      <Footer />
    </div>
  );
};

export default Layout;
