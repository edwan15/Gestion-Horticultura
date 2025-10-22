// components/ProductItemForm.jsx
import React, { useState } from 'react';
import InputField from './InputField'; // Usa el componente InputField

const ProductItemForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === '' || quantity <= 0) return;

    onSubmit({ name, quantity: Number(quantity) });
    // Resetear formulario
    setName('');
    setQuantity(1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <InputField
        label="Nombre del Producto"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <InputField
        label="Cantidad"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />
      <button type="submit">Añadir Producto</button>
    </form>
  );
};

export default ProductItemForm;