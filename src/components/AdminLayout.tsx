import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { label: "Dashboard", path: "/admin/dashboard" },
  { label: "Hoteles", path: "/admin/hotels" },
  { label: "Habitaciones", path: "/admin/rooms" },
  { label: "Reservas", path: "/admin/reservations" },
  { label: "Reembolsos", path: "/admin/refunds" },
  { label: "Usuarios", path: "/admin/users" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6 text-center">Panel Admin</h2>
        <nav className="flex flex-col gap-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`p-2 rounded ${
                location.pathname === item.path ? "bg-blue-600" : "hover:bg-blue-700"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Panel de Administración</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Cerrar sesión
          </button>
        </header>
        <div className="bg-white p-6 rounded shadow">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
