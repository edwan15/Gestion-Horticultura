// components/ProductCard.jsx
import React from 'react';

const ProductCard = ({ product, onDelete }) => (
  <div className="product-card">
    <h4>{product.name}</h4>
    <p>Cantidad: {product.quantity}</p>
    <button onClick={() => onDelete(product.id)}>Eliminar</button>
  </div>
);

export default ProductCard;