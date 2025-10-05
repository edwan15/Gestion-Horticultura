import React, { useState, useEffect } from "react";
import {
  UserPen,
  LoaderCircle,
  Mail,
  User,
  Shield,
  Lock,
  ArrowLeft,
  Calendar,
  Info,
  Clock,
  LayoutDashboard,
  Settings,
  Package,
  View,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
// La importación de SERVER_URL no se usa si se usan los datos mock, pero se mantiene si se conecta al backend
import { SERVER_URL } from "../../App";
import DashBoard from "../DashBoard/DashBoard";

// =========================================================================
// MOCK DATA Y SIMULADOR DE ROL (Inicio)
// =========================================================================

const allowedRoles = ["admin", "usuario", "invitado"];

const mockUsers = [
  {
    _id: "65e638d01",
    name: "Alice Admin",
    email: "alice@example.com",
    role: "admin",
    phone: "+34 600 123 456",
    registrationDate: "2023-01-15",
    lastLogin: "2025-10-02T10:30:00Z",
    activityLog: ["Creación de 3 nuevos productos", "Actualización de precios"],
    savedProducts: [{ id: 101, name: "Licencia Pro Anual" }],
    databaseAccess: { db: "main_production_db", level: "Full Read/Write" },
  },
  {
    _id: "65e638d02",
    name: "Bob User",
    email: "bob@example.com",
    role: "usuario",
    phone: "+34 600 987 654",
    registrationDate: "2023-05-20",
    lastLogin: "2025-10-02T14:45:00Z",
    activityLog: [
      "Compra finalizada (ID: #0045)",
      "Producto añadido al carrito",
    ],
    savedProducts: [
      { id: 201, name: "Kit Básico de Inicio" },
      { id: 202, name: "Módulo de Reportes" },
    ],
    databaseAccess: { db: "user_data_002", level: "Limited Read Only" },
  },
  {
    _id: "65e638d03",
    name: "Charlie Guest",
    email: "charlie@example.com",
    role: "invitado",
    phone: "N/A",
    registrationDate: "2024-02-10",
    lastLogin: "2025-09-15T09:10:00Z",
    activityLog: ["Visita a la página de contacto", "Descarga de brochure"],
    savedProducts: [],
    databaseAccess: { db: "public_access_logs", level: "No Access" },
  },
  {
    _id: "65e638d04",
    name: "Diana User",
    email: "diana@example.com",
    role: "usuario",
    phone: "+34 600 333 444",
    registrationDate: "2024-07-01",
    lastLogin: "2025-10-01T18:00:00Z",
    activityLog: ["Inicio de sesión fallido", "Actualización de contraseña"],
    savedProducts: [{ id: 301, name: "Paquete Premium Mensual" }],
    databaseAccess: { db: "user_data_004", level: "Limited Read/Write" },
  },
];

// SIMULADOR DE ROL: Devuelve 'admin' por defecto para pruebas de gestión.
const useAuthSimulator = () => {
  return {
    role: "admin", // ROL SIMULADO: Cámbialo a "usuario" para probar la restricción de permisos.
  };
};

// =========================================================================
// 1. COMPONENTES DE VISTA SIMULADA DEL USUARIO (Dashboard, Products, Settings)
// =========================================================================

const DashboardView = ({ user }) => (
  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
    <h5 className="text-xl font-bold mb-3 text-indigo-700">
      Resumen del Dashboard
    </h5>
    <p className="text-gray-600 mb-2">
      Hola, <span className="font-bold">{user.name}</span>. Tu cuenta está
      activa desde {user.registrationDate}.
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-blue-500">
        <p className="text-sm text-gray-500">Productos Activos</p>
        {/* Corrección: Uso de encadenamiento opcional para evitar error si savedProducts es undefined */}
        <p className="text-2xl font-extrabold text-blue-800">
          {user.savedProducts?.length || 0}
        </p>
      </div>
      <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-green-500">
        <p className="text-sm text-gray-500">Último Login</p>
        <p className="text-base font-bold text-green-800">
          {new Date(user.lastLogin).toLocaleDateString()}
        </p>
      </div>
      <div className="p-4 bg-white rounded-md shadow-sm border-l-4 border-red-500">
        <p className="text-sm text-gray-500">Rol</p>
        <p className="text-xl font-bold text-red-800">
          {user.role.toUpperCase()}
        </p>
      </div>
    </div>
  </div>
);

const ProductsView = ({ user }) => (
  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
    {/* Corrección: Uso de encadenamiento opcional para evitar error si savedProducts es undefined */}
    <h5 className="text-xl font-bold mb-3 text-green-700">
      Tus Productos ({user.savedProducts?.length || 0})
    </h5>

    {/* Corrección: Verificar savedProducts antes de usar .length */}
    {user.savedProducts && user.savedProducts.length > 0 ? (
      <ul className="space-y-2">
        {user.savedProducts.map((p) => (
          <li
            key={p.id}
            className="text-gray-700 p-2 bg-white rounded-md flex justify-between items-center shadow-sm"
          >
            <span>{p.name}</span>
            <span className="text-xs font-semibold text-gray-500">
              ID: {p.id}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="text-gray-500 italic">
        No tienes productos activos. ¡Visita nuestra tienda!
      </p>
    )}
  </div>
);

const SettingsView = ({ user }) => (
  <div className="p-4 bg-gray-100 rounded-lg border border-gray-200">
    <h5 className="text-xl font-bold mb-3 text-purple-700">
      Configuración de la Cuenta
    </h5>
    <div className="space-y-3">
      <div className="p-3 bg-white rounded-md shadow-sm">
        <p className="font-semibold text-gray-800">Email de Contacto:</p>
        <p className="text-gray-600">{user.email}</p>
      </div>
      <div className="p-3 bg-white rounded-md shadow-sm">
        <p className="font-semibold text-gray-800">Permisos de Notificación:</p>
        <p className="text-gray-600">Activos (Email y SMS)</p>
      </div>
      <div className="p-3 bg-red-100 rounded-md shadow-sm border border-red-300">
        <p className="font-semibold text-red-800">Acceso a DB:</p>
        <p className="text-sm text-red-600">
          {user.databaseAccess?.db} - {user.databaseAccess?.level}
        </p>
      </div>
    </div>
  </div>
);

// =========================================================================
// 2. COMPONENTE AUXILIAR: Vista de Tarjeta (Solo Móviles)
// =========================================================================
const UserCard = ({
  user,
  startEdit,
  editingUserId,
  selectedRole,
  setSelectedRole,
  handleRoleUpdate,
  setEditingUserId,
  userRole,
  viewDetails,
}) => {
  const canEdit = userRole === "admin";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md sm:hidden">
      <div className="flex justify-between items-start mb-2 border-b pb-2">
        <h3
          className="text-lg font-bold text-gray-800 flex items-center cursor-pointer hover:text-indigo-600 transition duration-150"
          onClick={() => viewDetails(user)}
        >
          <User className="w-5 h-5 mr-2 text-indigo-500" />
          {user.name || "Sin Nombre"}
        </h3>
        {canEdit && (
          <div className="flex items-center space-x-2">
            {editingUserId === user._id ? (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleRoleUpdate(user._id)}
                  className="text-white bg-green-600 hover:bg-green-700 font-bold py-1 px-2 rounded-lg text-xs transition shadow-md"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingUserId(null)}
                  className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold py-1 px-2 rounded-lg text-xs transition shadow-md"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => startEdit(user)}
                className="text-blue-600 hover:text-blue-900 transition p-1 rounded-full hover:bg-blue-50"
                title="Editar Rol"
              >
                <UserPen className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
      <p className="flex items-center text-sm text-gray-600 mb-1">
        <Mail className="w-4 h-4 mr-2 text-blue-500" />
        <span className="font-medium text-gray-900">Email:</span> {user.email}
      </p>
      <div className="flex flex-col">
        <span className="font-medium text-gray-900 mb-1">Rol Actual:</span>
        <span
          className={`px-2 py-1 text-sm leading-5 font-semibold rounded-full w-fit ${
            user.role === "admin"
              ? "bg-red-100 text-red-800"
              : user.role === "invitado"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {user.role}
        </span>
      </div>
    </div>
  );
};

// =========================================================================
// 3. COMPONENTE AUXILIAR: Vista de Detalle (UserDetails)
// =========================================================================
const UserDetails = ({ user, setView }) => {
  const [userView, setUserView] = useState("dashboard");

  if (!user) {
    return (
      <div className="text-center py-10 text-gray-500">
        Error: Usuario no encontrado.
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const renderUserView = () => {
    switch (userView) {
      case "products":
        return <ProductsView user={user} />;
      case "settings":
        return <SettingsView user={user} />;
      case "panel":
      default:
        return <DashBoard user={user} />;
    }
  };

  const tabClasses = (tab) =>
    `px-4 py-2 font-semibold transition duration-150 rounded-t-lg flex items-center ${
      userView === tab
        ? "bg-indigo-600 text-white shadow-lg"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
    }`;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-lg shadow-inner">
      <button
        onClick={() => setView("list")}
        className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium mb-6 transition duration-150"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Volver a la Lista de Usuarios
      </button>

      <h3 className="text-3xl font-extrabold text-gray-900 mb-6 border-b pb-2">
        Perfil Detallado: {user.name}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="flex items-center text-lg font-semibold text-gray-700 mb-1">
            <Mail className="w-5 h-5 mr-3 text-blue-500" />
            Email:{" "}
            <span className="font-normal ml-2 text-gray-900">{user.email}</span>
          </p>
          <p className="flex items-center text-lg font-semibold text-gray-700">
            <Shield className="w-5 h-5 mr-3 text-red-500" />
            Rol:
            <span
              className={`font-bold ml-2 px-2 py-0.5 rounded-full text-sm ${
                user.role === "admin"
                  ? "bg-red-200 text-red-900"
                  : user.role === "usuario"
                  ? "bg-green-200 text-green-900"
                  : "bg-yellow-200 text-yellow-900"
              }`}
            >
              {user.role.toUpperCase()}
            </span>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="flex items-center text-lg font-semibold text-gray-700 mb-1">
            <Calendar className="w-5 h-5 mr-3 text-gray-500" />
            Registrado:{" "}
            <span className="font-normal ml-2 text-gray-900">
              {user.registrationDate}
            </span>
          </p>
          <p className="flex items-center text-lg font-semibold text-gray-700">
            <Clock className="w-5 h-5 mr-3 text-indigo-500" />
            Último Acceso:{" "}
            <span className="font-normal ml-2 text-gray-900">
              {formatDate(user.lastLogin)}
            </span>
          </p>
        </div>
      </div>

      <h4 className="text-2xl font-bold text-gray-800 mb-4 mt-8 flex items-center">
        <View className="w-6 h-6 mr-2 text-blue-600" /> Simulación de Navegación
        del Usuario
      </h4>

      <div className="flex border-b border-gray-300 mb-4 overflow-x-auto">
        <button
          className={tabClasses("dashboard")}
          onClick={() => setUserView("dashboard")}
        >
          <LayoutDashboard className="w-5 h-5 mr-2" /> Dashboard
        </button>
        <button
          className={tabClasses("products")}
          onClick={() => setUserView("products")}
        >
          <Package className="w-5 h-5 mr-2" /> Productos
        </button>
        <button
          className={tabClasses("settings")}
          onClick={() => setUserView("settings")}
        >
          <Settings className="w-5 h-5 mr-2" /> Ajustes
        </button>
      </div>

      <div className="mb-8 p-4 border border-indigo-400 rounded-lg bg-indigo-50 shadow-md">
        <p className="text-sm font-medium text-indigo-800 mb-3">
          Vista actual como **{user.name}** en la ruta:{" "}
          <span className="font-mono bg-indigo-200 px-2 py-0.5 rounded text-indigo-900">
            /{userView}
          </span>
        </p>
        {renderUserView()}
      </div>

      <h4 className="text-xl font-bold text-gray-800 mb-4 mt-8 flex items-center border-b pb-1">
        {/* Corrección: Uso de encadenamiento opcional para evitar error si activityLog es undefined */}
        <Info className="w-5 h-5 mr-2 text-yellow-600" /> Registros de Actividad
        ({user.activityLog?.length || 0})
      </h4>
      <div className="bg-white p-4 rounded-lg border border-gray-300 max-h-80 overflow-y-auto shadow-sm">
        {/* Corrección: Verificar activityLog antes de usar .length */}
        {user.activityLog && user.activityLog.length > 0 ? (
          <ul className="space-y-2">
            {user.activityLog.map((log, index) => (
              <li
                key={index}
                className="flex items-start text-sm text-gray-700"
              >
                <span className="text-indigo-500 mr-2">•</span> {log}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">
            No hay registros de actividad recientes.
          </p>
        )}
      </div>
    </div>
  );
};

// =========================================================================
// 4. COMPONENTE PRINCIPAL (UserManagement)
// =========================================================================
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // Gestión de vistas
  const [view, setView] = useState("list");
  const [selectedUser, setSelectedUser] = useState(null);

  // Nuevo estado para retroalimentación de API
  const [statusMessage, setStatusMessage] = useState({ message: "", type: "" });

  // ROL SIMULADO
  const { role: loggedInRole } = useAuthSimulator();

  // Define reglas de acceso:
  const isAdmin = loggedInRole === "admin";
  const canView =
    isAdmin || loggedInRole === "invitado" || loggedInRole === "usuario";
  const userAccessLevel = loggedInRole
    ? loggedInRole.toUpperCase()
    : "Desconocido";

  // -------------------------------------------------------------------------
  // FETCH USERS (Usando MOCK DATA para funcionalidad autónoma)
  // -------------------------------------------------------------------------
  // La línea API_GET_USERS y la lógica de fetch real se comentan/simplifican
  // para usar los datos mock, haciendo el componente funcional sin un backend.

  useEffect(() => {
    const fetchUsers = async () => {
      const API_GET_USERS = `${SERVER_URL}/api/admin/users`;

      if (!canView) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setStatusMessage({
        message: "Cargando datos de usuarios (Simulación de API)...",
        type: "pending",
      });

      try {
        // SIMULACIÓN DE LLAMADA API:
        // await new Promise(resolve => setTimeout(resolve, 800)); // Simula latencia de red
        // setUsers(mockUsers); // Usar datos mock
        // setStatusMessage({ message: 'Usuarios cargados correctamente (Datos de prueba).', type: 'success' });

        const response = await fetch(API_GET_USERS, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Acceso denegado o Sesión Expirada.");
          }
          throw new Error("Error al cargar datos del servidor");
        }
        const data = await response.json();
        setUsers(data);
        setStatusMessage({
          message: "Usuarios cargados correctamente.",
          type: "success",
        });
      } catch (error) {
        console.error("Error fetching users:", error);
        // setUsers(mockUsers); // Fallback a datos mock en caso de error de red/auth
        setStatusMessage({
          message: `Error al cargar usuarios: ${error.message}. (Mostrando datos de prueba)`,
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [canView]);

  // -------------------------------------------------------------------------
  // UPDATE USER ROLE (Usando MOCK DATA para simulación)
  // -------------------------------------------------------------------------
  const API_UPDATE_ROLE = `${SERVER_URL}/api/admin/users/update-role`;

  const handleRoleUpdate = async (userId) => {
    if (!isAdmin || !selectedRole || !editingUserId) return;

    setStatusMessage({
      message: `Actualizando rol de ${userId} a ${selectedRole}...`,
      type: "pending",
    });
    const oldRole = users.find((u) => u._id === userId)?.role;

    // 1. Actualización optimista: Reflejar el cambio inmediatamente en el UI
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === userId ? { ...user, role: selectedRole } : user
      )
    );
    setEditingUserId(null); // Desactivar la edición

    try {
      // SIMULACIÓN DE LLAMADA API:
      // await new Promise(resolve => setTimeout(resolve, 500)); // Simula latencia de red

      // // Simular un fallo ocasional (por ejemplo, si selectedRole es 'guest')
      // if (selectedRole === 'invitado' && userId === '65e638d01') {
      //     throw new Error('La degradación del rol de administrador falló por política.');
      // }

      // setStatusMessage({ message: `Rol de ${userId} actualizado a ${selectedRole} con éxito.`, type: 'success' });

      // ➡️ LÓGICA DE PRODUCCIÓN REAL CON COOKIES HTTP-ONLY (Comentada):

      const response = await fetch(`${API_UPDATE_ROLE}/${userId}`, {
        method: "PATCH", // O PUT
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: selectedRole,
        }),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          errorBody.message || "Fallo al actualizar el rol en el servidor."
        );
      }

      setStatusMessage({
        message: `Rol de ${userId} actualizado a ${selectedRole} con éxito.`,
        type: "success",
      });
    } catch (error) {
      console.error("Error updating role:", error);

      // 2. Reversión si la API falla: Volver al rol antiguo
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: oldRole } : user
        )
      );
      setStatusMessage({
        message: `Error al actualizar el rol. El rol ha sido revertido a ${oldRole}. (Detalle: ${error.message})`,
        type: "error",
      });
    } finally {
      setSelectedRole("");
    }
  };

  const startEdit = (user) => {
    if (!isAdmin) return;
    setEditingUserId(user._id);
    setSelectedRole(user.role);
  };

  const viewDetails = (user) => {
    setSelectedUser(user);
    setView("details");
  };

  // -------------------------------------------------------------------------
  // RENDERIZADO DEL MENSAJE DE ESTADO
  // -------------------------------------------------------------------------
  const renderStatusMessage = () => {
    if (!statusMessage.message || view !== "list") return null;

    const baseClasses =
      "flex items-center p-4 rounded-lg text-sm font-semibold mb-6 shadow-md";
    let icon, styleClasses;

    switch (statusMessage.type) {
      case "pending":
        icon = <LoaderCircle className="animate-spin w-5 h-5 mr-3" />;
        styleClasses = "bg-blue-100 text-blue-800 border border-blue-300";
        break;
      case "success":
        icon = <CheckCircle className="w-5 h-5 mr-3" />;
        styleClasses = "bg-green-100 text-green-800 border border-green-300";
        break;
      case "error":
      default:
        icon = <AlertTriangle className="w-5 h-5 mr-3" />;
        styleClasses = "bg-red-100 text-red-800 border border-red-300";
    }

    return (
      <div className={`${baseClasses} ${styleClasses}`}>
        {icon}
        <p className="flex-1">{statusMessage.message}</p>
        <button
          onClick={() => setStatusMessage({ message: "", type: "" })}
          className="ml-4 p-1 rounded-full hover:bg-opacity-50 transition"
          title="Cerrar mensaje"
        >
          <XCircle className="w-4 h-4" />
        </button>
      </div>
    );
  };

  // Renderizado principal basado en el estado 'view'
  if (view === "details") {
    return <UserDetails user={selectedUser} setView={setView} />;
  }

  // Si no tiene permisos para ver
  if (!canView) {
    return (
      <div className="p-8 bg-white shadow-xl rounded-lg text-center mt-10 max-w-lg mx-auto border-t-4 border-red-500">
        <Lock className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Acceso Denegado
        </h2>
        <p className="text-gray-600">
          Lo sentimos, tu rol de **{userAccessLevel}** no tiene permisos para
          acceder a la gestión de usuarios.
        </p>
      </div>
    );
  }

  // Vista de la lista de usuarios
  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 flex items-center">
        <UserPen className="w-8 h-8 mr-3 text-indigo-600" />
        Panel de Gestión de Usuarios
      </h1>
      <p className="text-lg text-gray-600 mb-6 border-b pb-4">
        Nivel de Acceso Actual:{" "}
        <span className="font-bold text-indigo-700">{userAccessLevel}</span>
      </p>

      {renderStatusMessage()}

      {loading ? (
        <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow-lg">
          <LoaderCircle className="w-10 h-10 animate-spin text-indigo-600 mr-3" />
          <span className="text-xl font-medium text-gray-700">
            Cargando usuarios...
          </span>
        </div>
      ) : (
        <>
          {/* Vista de Tarjetas (Móvil) */}
          <div className="sm:hidden">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Lista de Usuarios ({users.length})
            </h2>
            {users.map((user) => (
              <UserCard
                key={user._id}
                user={user}
                startEdit={startEdit}
                editingUserId={editingUserId}
                selectedRole={selectedRole}
                setSelectedRole={setSelectedRole}
                handleRoleUpdate={handleRoleUpdate}
                setEditingUserId={setEditingUserId}
                userRole={loggedInRole}
                viewDetails={viewDetails}
              />
            ))}
          </div>

          {/* Tabla (Escritorio/Tablet) */}
          <div className="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Último Login
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-indigo-50 transition duration-150"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <button
                        onClick={() => viewDetails(user)}
                        className="text-indigo-600 hover:text-indigo-900 font-bold"
                      >
                        {user.name || "N/A"}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editingUserId === user._id && isAdmin ? (
                        <select
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        >
                          {allowedRoles.map((role) => (
                            <option key={role} value={role}>
                              {role.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === "admin"
                              ? "bg-red-100 text-red-800"
                              : user.role === "invitado"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.lastLogin).toLocaleDateString("es-ES")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingUserId === user._id && isAdmin ? (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleRoleUpdate(user._id)}
                            className="text-white bg-green-600 hover:bg-green-700 font-bold py-1 px-3 rounded-md text-xs transition shadow-md"
                          >
                            <CheckCircle className="w-4 h-4 inline mr-1" />{" "}
                            Guardar
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold py-1 px-3 rounded-md text-xs transition shadow-md"
                          >
                            <XCircle className="w-4 h-4 inline mr-1" /> Cancelar
                          </button>
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => viewDetails(user)}
                            className="text-gray-500 hover:text-indigo-600 transition p-1 rounded-full hover:bg-indigo-50"
                            title="Ver Detalles"
                          >
                            <View className="w-5 h-5" />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => startEdit(user)}
                              className="text-blue-600 hover:text-blue-900 transition p-1 rounded-full hover:bg-blue-50"
                              title="Editar Rol"
                            >
                              <UserPen className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default UserManagement;