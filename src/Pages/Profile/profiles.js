import { useEffect, useState } from "react";
import React from "react";
import useRedirectLoggedOutUser from "../../custom/useRedirect";
import { useDispatch } from "react-redux";
import { getUser } from "../../services/Services";
import { SET_NAME, SET_USER } from "../../features/auth/authSlice/authSlice";
import Loader from "../../Util/Loader";
import { Link } from "react-router-dom";

const Profiles = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();

  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function getUserData() {
      const data = await getUser();
      console.log(data);
      setProfile(data);
      setIsLoading(false);
      await dispatch(SET_USER(data));
      await dispatch(SET_NAME(data.name));
    }
    getUserData();
  }, [dispatch]);

  return (
    // CONTENEDOR GLOBAL: Asegura el ancho completo, padding, centrado y altura mínima.
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-[50vh]">
      {isLoading && <Loader />}
      
      {/* Contenedor Flex para Centrar Horizontal y Verticalmente */}
      <div className="flex flex-col items-center justify-center w-full">
        
        {!isLoading && profile === null ? (
          <p className="text-center text-red-500 font-semibold">
            Something went wrong, please reload the page...
          </p>
        ) : (
          // CARD Y BOTÓN CONTENEDOR
          <div className="flex flex-col items-center w-full">
            
            {/* CARD DE PERFIL */}
            <div 
                // RESPONSIVIDAD DEL CARD: w-full en móvil, max-w-lg en desktop para un tamaño óptimo.
                className="w-full max-w-sm sm:max-w-md lg:max-w-lg rounded-3xl overflow-hidden shadow-2xl my-6 bg-slate-700 text-white"
            >
              {/* Imagen de fondo (Cover) */}
              <div className="h-24 sm:h-32 bg-blue-500 w-full overflow-hidden">
                <img 
                    src={"https://i.imgur.com/dYcYQ7E.png"} 
                    alt="cover" 
                    className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Foto de Perfil */}
              <div className="flex justify-center -mt-16 mb-4">
                <img
                  src={profile?.photo || "URL_DEFAULT_PROFILE_IMAGE"}
                  alt="profile"
                  // Tamaño responsivo y sombra para destacar
                  className="rounded-full border-solid w-32 h-32 sm:w-40 sm:h-40 border-white border-4 object-cover shadow-xl"
                />
              </div>
              
              {/* Contenido de Texto */}
              <div className="text-center px-4 pb-6 pt-2">
                <h3 className="text-2xl font-bold mb-2">
                  {profile?.name}
                </h3>
                <p className="mt-2 font-light text-slate-300 px-4 sm:px-8">
                  {profile?.bio || "No hay biografía disponible."}
                </p>
              </div>
              
              {/* Contacto y Detalles */}
              <div 
                  // FLEX WRAP: Asegura que si los datos son muy largos, se ajusten
                  className="flex flex-wrap justify-center py-4 px-4 border-t border-slate-600 bg-slate-600/30"
              >
                
                {/* Teléfono */}
                <div className="text-center w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-600 pb-2 sm:pb-0 pr-0 sm:pr-4 mb-2 sm:mb-0">
                  <h2 className="text-lg font-semibold">{profile?.phone || "N/A"}</h2>
                  <span className="text-sm text-slate-300">Teléfono</span>
                </div>
                
                {/* Email */}
                <div className="text-center w-full sm:w-1/2 pl-0 sm:pl-4">
                  <h2 
                      // Oculta el desbordamiento si el email es muy largo.
                      className="text-sm sm:text-lg font-semibold truncate px-2" 
                      title={profile?.email}
                  >
                      {profile?.email || "N/A"}
                  </h2>
                  <span className="text-sm text-slate-300">Email</span>
                </div>
              </div>
            </div>

            {/* BOTÓN DE EDICIÓN */}
            <div className="flex justify-center mt-4">
              <Link to={"/edit-profile"}>
                <button 
                    className="px-6 py-2 bg-indigo-500 rounded-lg text-white font-semibold shadow-md hover:bg-indigo-600 transition-colors"
                >
                    Editar Perfil
                </button>
              </Link>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
};

export default Profiles;

