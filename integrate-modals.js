// Script para integrar los modales en Tarea.js
const fs = require('fs');
const path = require('path');

const tareaPath = path.join(__dirname, 'src', 'components', 'Carga', 'Tarea.js');

// Leer el archivo
let content = fs.readFileSync(tareaPath, 'utf8');

// 1. Agregar los modales antes del cierre del return (antes de la línea que tiene solo "  );")
const modalsCode = `
      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCalendarToDelete(null);
        }}
        onConfirm={() => handleDeleteCalendar(calendarToDelete?.id)}
        title="Eliminar Registro"
        message={\`¿Estás seguro de que deseas eliminar el registro "\${calendarToDelete?.name}"? Esta acción eliminará todos los productos asociados y no se puede deshacer.\`}
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
`;

// Buscar el patrón: </div>\n      </div>\n    </div>\n  );
// Y agregar los modales antes del último </div>
const pattern = /(\s+<\/div>\s+<\/div>\s+<\/div>\s+\);\s+};)/;
const replacement = modalsCode + '\n    </div>\n  );\n};';

if (pattern.test(content)) {
  content = content.replace(pattern, replacement);
  console.log('✅ Modales agregados exitosamente');
} else {
  console.log('❌ No se encontró el patrón para agregar los modales');
}

// Guardar el archivo
fs.writeFileSync(tareaPath, content, 'utf8');
console.log('✅ Archivo guardado: ' + tareaPath);
