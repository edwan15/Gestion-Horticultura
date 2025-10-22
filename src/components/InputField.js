import React from 'react'

 const InputField = ({
  label,
  value,
  field,
  type = "text",
  placeholder = "Ingresa un valor",
  item,
  handleItemChange,
  handleItemBlur,
}) => {
  const handleChange = (e) => {
    handleItemChange(item.id, field, e.target.value);
  };

  const handleBlur = () => {
    if (
      field === "factorB" ||
      field === "numWorkers" ||
      field === "hoursWorked"
    ) {
      handleItemBlur(item.id, field);
    }
  };

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      (field === "factorB" || field === "numWorkers" || field === "hoursWorked")
    ) {
      e.preventDefault();
      e.target.blur();
    }
  };

  const displayValue = value || value === 0 ? String(value) : "";

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        key={`${item.id}-${field}`}
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 shadow-inner transition"
      />
    </div>
  );
};

export default InputField
