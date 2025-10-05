import React from "react";
import {
  Mail,
  Phone,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";

// Enlace de ejemplo para redes sociales
const socialLinks = [
  {
    name: "Facebook",
    icon: <Facebook size={18} />,
    href: "https://facebook.com/edwanz",
  },
  {
    name: "Twitter",
    icon: <Twitter size={18} />,
    href: "https://twitter.com.com/edwanz",
  },
  {
    name: "Instagram",
    icon: <Instagram size={18} />,
    href: "https://instagram.com/edwanz",
  },
  {
    name: "LinkedIn",
    icon: <Linkedin size={18} />,
    href: "https://linkedin.com/in/edwanz",
  },
];

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    // Contenedor principal
    <footer className="w-full mt-8 border-t border-slate-700 bg-slate-800 text-slate-300">
      {/* ======================================================= */}
      {/* SECCIÓN ÚNICA (RESPONSIVA) */}
      {/* ======================================================= */}
      <div
        // En móvil: Los elementos se apilan (flex-col).
        // En desktop: Los elementos se ponen en fila (md:flex-row) y se reparten (justify-between).
        className="max-w-7xl mx-auto py-4 px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0 text-center"
      >
        {/* 1. Derechos Reservados (Ajuste de Fuente para Móvil) */}
        <p
          // text-[10px] es un tamaño aún más pequeño que xs (12px)
          className="text-[10px] sm:text-xs text-white order-3 md:order-1"
        >
          Diseñado y Desarrollado por Edwan Z. &copy; {year}
        </p>

        {/* 2. Información de Contacto (USABILIDAD MÓVIL: flex-wrap) */}
        <div
          // flex-wrap permite que el contenido se mueva a la siguiente línea si no hay espacio.
          className="flex flex-wrap justify-center items-center space-x-4 order-2"
        >
          {/* Email */}
          <div className="flex items-center group mb-1 sm:mb-0">
            <Mail
              size={16}
              className="text-slate-400 group-hover:text-indigo-400 mr-2 transition-colors duration-200"
            />
            <a
              href="mailto:Edwan101@hotmail.com"
              className="text-xs text-slate-300 hover:text-indigo-400 transition-all duration-200"
            >
              Edwan101@hotmail.com
            </a>
          </div>

          {/* Separador (solo visible en dispositivos que no están apilando) */}
          <span className="hidden sm:inline-block text-slate-600">|</span>

          {/* Teléfono */}
          <div className="flex items-center group mt-1 sm:mt-0">
            <Phone
              size={16}
              className="text-slate-400 group-hover:text-indigo-400 mr-2 transition-colors duration-200"
            />
            <a
              href="tel:+34631982876"
              className="text-xs text-slate-300 hover:text-indigo-400 transition-all duration-200"
            >
              +34 631982876
            </a>
          </div>
        </div>

        {/* 3. Redes Sociales (Íconos) con Movimiento */}
        <div className="flex justify-center space-x-3 order-1 md:order-3">
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`Visita nuestro ${link.name}`}
              // Hover: Cambio a azul índigo y movimiento sutil
              className="text-slate-400 hover:text-indigo-400 transition-all duration-300 transform hover:-translate-y-1"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
