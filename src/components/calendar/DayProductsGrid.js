// components/DayProductsGrid.jsx
import React from 'react';
import ProductCard from './ProductCard'; // Usa el componente ProductCard

const DayProductsGrid = ({ products, onProductDelete }) => (
  <div className="products-grid">
    {products?.length === 0 ? (
      <p>No hay productos añadidos aún.</p>
    ) : (
      products?.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onDelete={onProductDelete} // Pasa la función de manejo
        />
      ))
    )}
  </div>
);

export default DayProductsGrid;