import React from 'react';
import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      textAlign: 'center',
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🚫 Acceso Denegado (Error 403)</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
        Tu rol actual ("invitado" o "usuario") no tiene permiso para ver esta página. 
        Si crees que esto es un error, contacta al administrador.
      </p>
      <Link 
        to="/panel" 
        style={{ 
          textDecoration: 'none', 
          padding: '10px 20px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          borderRadius: '5px' 
        }}
      >
        Volver al Panel
      </Link>
    </div>
  );
};

export default UnauthorizedPage;
