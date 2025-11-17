import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { label: "Dashboard", path: "/super/dashboard" },
  { label: "Administradores", path: "/super/admins" },
  { label: "Hoteles", path: "/super/hotels" },
  { label: "Habitaciones", path: "/super/rooms" }, // ✅ NUEVA OPCIÓN
  { label: "Reservas", path: "/super/reservations" },
  { label: "Ajustes", path: "/super/settings" },
];

export default function SuperLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-64 bg-purple-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Super Panel</h2>
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded transition ${
                location.pathname === item.path
                  ? "bg-purple-600"
                  : "hover:bg-purple-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Panel SuperAdmin</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-sm">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        <div className="bg-white p-6 rounded shadow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
