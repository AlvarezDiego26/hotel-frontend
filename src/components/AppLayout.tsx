import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import ChatAssistant from './ChatAssistant';

export default function AppLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div>
      <nav className="bg-blue-700 text-white p-4 shadow">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="font-bold text-xl">Trivago Clone</Link>
          <div className="space-x-4">
            {!token ? (
              <>
                <Link to="/register">Registrarse</Link>
                <Link to="/login">Iniciar sesión</Link>
              </>
            ) : (
              <>
                <Link to="/reservations">Mis Reservas</Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 px-3 py-1 rounded"
                >
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
      <Outlet />
      <ChatAssistant />
    </div>
  );
}
