import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserPen, LoaderCircle, Mail, Key, User } from "lucide-react";
import { SERVER_URL } from "../../App";

// Roles permitidos para el selector
const allowedRoles = ["admin", "usuario", "invitado"];

// =========================================================================
// 1. COMPONENTE AUXILIAR: Vista de Tarjeta (Solo Móviles)
// Recibe la función de estado 'setEditingUserId' para poder cancelar la edición.
// =========================================================================
const UserCard = ({
  user,
  startEdit,
  editingUserId,
  selectedRole,
  setSelectedRole,
  handleRoleUpdate,
  setEditingUserId,
}) => (
  // El uso de 'sm:hidden' asegura que solo se muestre en pantallas pequeñas
  <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
    <div className="flex justify-between items-start mb-2 border-b pb-2">
      <h3 className="text-lg font-bold text-gray-800 flex items-center">
        <User className="w-5 h-5 mr-2 text-indigo-500" />
        {user.name || "Sin Nombre"}
      </h3>
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
    </div>

    <p className="flex items-center text-sm text-gray-600 mb-1">
      <Mail className="w-4 h-4 mr-2 text-blue-500" />
      <span className="font-medium text-gray-900">Email:</span> {user.email}
    </p>

    <p className="flex items-center text-sm text-gray-600 mb-2">
      <Key className="w-4 h-4 mr-2 text-purple-500" />
      <span className="font-medium text-gray-900">ID:</span>{" "}
      <span className="truncate">{user._id}</span>
    </p>

    <div className="flex flex-col">
      <span className="font-medium text-gray-900 mb-1">Rol Actual:</span>
      {editingUserId === user._id ? (
        <select
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          className="py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
        >
          {allowedRoles.map((role) => (
            <option key={role} value={role}>
              {role.toUpperCase()}
            </option>
          ))}
        </select>
      ) : (
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
      )}
    </div>
  </div>
);

// =========================================================================
// 2. COMPONENTE PRINCIPAL
// =========================================================================
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUserId, setEditingUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // 1. Fetch Users
useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      
      // 🛑 PASO 1: Obtener el token del localStorage
      const token = localStorage.getItem('user_token'); 
      
      if (!SERVER_URL) {
        console.log("SERVER_URL no definida. Saltando llamada a getUsers.");
        setLoading(false);
        return;
      }
      // Añadimos chequeo para el token por si no está logueado
      if (!token) {
        toast.error("Error: Token de sesión no encontrado.");
        setLoading(false);
        return;
      }
      
      try {
        // 🛑 PASO 2: Enviar el token en el header 'Authorization'
        const response = await axios.get(
          `${SERVER_URL}/api/admin/users`, 
            {
                headers: {
                    'Authorization': `Bearer ${token}` 
                }
            }
        );
        setUsers(response.data);
      } catch (error) {
        // ... (manejo de errores)
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        toast.error(`Error al cargar usuarios: ${message}.`);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // 2. Update User Role
  const handleRoleUpdate = async (userId) => {
    if (!selectedRole || !editingUserId) return;
    if (!SERVER_URL) {
      toast.error("SERVER_URL no definida. No se puede actualizar el rol.");
      setEditingUserId(null);
      return;
    }
    if (!allowedRoles.includes(selectedRole)) {
      toast.error("Rol seleccionado no válido.");
      return;
    }

    try {
      const response = await axios.patch(
        `${SERVER_URL}/api/admin/users/${userId}/role`,
        {
          role: selectedRole,
        }
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: selectedRole } : user
        )
      );
      toast.success(
        response.data.message || `Rol actualizado a ${selectedRole}`
      );
      setEditingUserId(null);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
    }
  };

  const startEdit = (user) => {
    setEditingUserId(user._id);
    setSelectedRole(user.role);
  };

  if (loading) {
    return (
      <div className="text-center p-8 flex justify-center items-center h-full">
        <LoaderCircle className="animate-spin w-8 h-8 text-blue-500" />
        <p className="ml-3 text-xl">Cargando usuarios...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 bg-white min-h-[80vh] rounded-xl shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-2">
        Gestión de Usuarios
      </h2>

      {/* ======================================================= */}
      {/* VISTA DE TARJETA (Solo en Móviles) - Usa sm:hidden */}
      {/* ======================================================= */}
      <div className="sm:hidden">
        {users.length === 0 && (
          <p className="text-center py-5 text-gray-500">
            No se encontraron usuarios.
          </p>
        )}
        {users.map((user) => (
          <UserCard
            key={user._id}
            user={user}
            startEdit={startEdit}
            editingUserId={editingUserId}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            handleRoleUpdate={handleRoleUpdate}
            setEditingUserId={setEditingUserId} // ¡CORREGIDO!
          />
        ))}
      </div>

      {/* ======================================================= */}
      {/* VISTA DE TABLA (Solo en Desktop/Tablet) - Usa hidden sm:block */}
      {/* ======================================================= */}
      <div className="overflow-x-auto hidden sm:block">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {/* ID: Oculto en SM/MD, visible solo en LG+ */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                ID de Usuario
              </th>
              {/* Email: Siempre visible */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              {/* Rol: Siempre visible */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol Actual
              </th>
              {/* Acciones: Siempre visible */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition duration-150"
              >
                {/* ID de Usuario (oculto en pantallas medianas y menores) */}
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden lg:table-cell truncate max-w-xs"
                  title={user._id}
                >
                  {user._id}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate max-w-sm">
                  {user.email}
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  {editingUserId === user._id ? (
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                      {user.role}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingUserId === user._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRoleUpdate(user._id)}
                        className="text-white bg-green-600 hover:bg-green-700 font-bold py-2 px-4 rounded-lg text-xs transition duration-150 shadow-md"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingUserId(null)}
                        className="text-gray-700 bg-gray-200 hover:bg-gray-300 font-bold py-2 px-4 rounded-lg text-xs transition duration-150 shadow-md"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEdit(user)}
                      className="text-blue-600 hover:text-blue-900 transition duration-150 p-2 rounded-full hover:bg-blue-50"
                      title="Editar Rol"
                    >
                      <UserPen className="text-xl" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && !loading && (
          <p className="text-center py-10 text-gray-500">
            No se encontraron usuarios.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
