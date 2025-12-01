// ============================================================================
// INSTRUCCIONES: Agregar estos bloques de código a Tarea.js
// ============================================================================

// PASO 1: Agregar ANTES de la línea 4651 (antes del cierre del return)
// Busca la línea que dice:   );
// Y ANTES de esa línea, agrega esto:

      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCalendarToDelete(null);
        }}
        onConfirm={() => handleDeleteCalendar(calendarToDelete?.id)}
        title="Eliminar Registro"
        message={`¿Estás seguro de que deseas eliminar el registro "${calendarToDelete?.name}"? Esta acción eliminará todos los productos asociados y no se puede deshacer.`}
        confirmText="Eliminar"
        variant="danger"
      />

      {/* Statistical Data Modal */}
      <TareaEstadisticosModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        calendarId={selectedCalendarId}
        calendarName={selectedCalendarName}
        onSave={handleSaveStats}
        initialData={statsData[selectedCalendarId] || {}}
      />

// ============================================================================
// PASO 2: Agregar botones en CalendarView
// ============================================================================

// Busca en CalendarView (alrededor de la línea 2360) donde están los botones
// de "Exportar Rango de Fechas" y "Exportar Día"
// DESPUÉS del último botón de exportar, agrega estos DOS botones:

                {/* Botón de Eliminar Registro */}
                <button
                  onClick={() => handleDeleteCalendar(selectedCalendarId, selectedCalendarName)}
                  disabled={!selectedCalendarId}
                  className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full 
                                    ${
                                      selectedCalendarId
                                        ? "bg-red-600 hover:bg-red-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                  title="Eliminar el registro seleccionado y todos sus datos"
                >
                  <Trash2 size={16} className="mr-2" />
                  Eliminar Registro
                </button>

                {/* Botón de Datos Estadísticos */}
                <button
                  onClick={openStatsModal}
                  disabled={!selectedCalendarId}
                  className={`flex items-center justify-center px-4 py-3 text-sm font-bold rounded-xl transition duration-200 shadow-md w-full 
                                    ${
                                      selectedCalendarId
                                        ? "bg-purple-600 hover:bg-purple-700 text-white"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                    }`}
                  title="Ver y editar datos estadísticos del invernadero"
                >
                  <BarChart3 size={16} className="mr-2" />
                  Datos Estadísticos
                </button>

// ============================================================================
// PASO 3: Agregar imports para los iconos en la parte superior del archivo
// ============================================================================

// Busca la línea que tiene los imports de lucide-react (alrededor de línea 35-40)
// Agrega Trash2 y BarChart3 a la lista de imports:

import {
  Calendar as CalendarIcon,
  Plus,
  Upload,
  Clock,
  ArrowLeft,
  X,
  Edit,
  Trash2,  // <-- AGREGAR ESTE
  Package,
  Activity,
  Loader,
  AlertTriangle,
  BarChart3,  // <-- AGREGAR ESTE
} from "lucide-react";

// ============================================================================
// NOTAS IMPORTANTES:
// ============================================================================
// 1. Los componentes ConfirmationModal y TareaEstadisticosModal ya están importados
// 2. Las funciones handleDeleteCalendar, openDeleteModal, handleSaveStats ya existen
// 3. El estado isDeleteModalOpen, calendarToDelete, isStatsModalOpen ya existe
// 4. Solo necesitas agregar estos bloques de código en los lugares indicados
// ============================================================================
