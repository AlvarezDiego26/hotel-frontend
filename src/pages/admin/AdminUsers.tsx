import React, { useEffect, useState } from "react";
import { fetchUsers, updateUserRole, toggleUserStatus } from "../../api";
import { useAuth } from "../../context/AuthContext";

interface User {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  role: "CLIENT" | "ADMIN" | "SUPERADMIN";
  isActive?: boolean;
}

export default function AdminUsers() {
  const { user: loggedUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchUsers();
      let list: User[] = [];

      if (Array.isArray(data.data)) list = data.data;
      else if (Array.isArray(data.items)) list = data.items;
      else if (Array.isArray(data.users)) list = data.users;
      else if (Array.isArray(data)) list = data;

      setUsers(list);
    } catch (err: any) {
      console.error("❌ Error al cargar usuarios:", err);
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (targetUser: User, newRole: User["role"]) => {
    try {
      await updateUserRole(targetUser.id, newRole);
      await loadUsers();
    } catch (err) {
      console.error("❌ Error al cambiar rol:", err);
      alert("Error al cambiar el rol del usuario");
    }
  };

  const handleToggleStatus = async (targetUser: User) => {
    if (targetUser.role === "SUPERADMIN" && loggedUser?.role !== "SUPERADMIN") {
      alert("No puedes bloquear un SuperAdmin.");
      return;
    }

    const action = targetUser.isActive ? "bloquear" : "desbloquear";
    if (!confirm(`¿Deseas ${action} a ${targetUser.email}?`)) return;

    try {
      await toggleUserStatus(targetUser.id, !targetUser.isActive);
      await loadUsers();
    } catch (err) {
      console.error(`❌ Error al ${action} usuario:`, err);
      alert(`Error al ${action} usuario`);
    }
  };

  const canChangeRole = (targetUser: User) => {
    if (!loggedUser) return false;
    if (loggedUser.id === targetUser.id) return false;

    if (loggedUser.role === "SUPERADMIN") return targetUser.role !== "SUPERADMIN";
    if (loggedUser.role === "ADMIN") return targetUser.role !== "SUPERADMIN";

    return false;
  };

  const canToggleStatus = (targetUser: User) => {
    if (!loggedUser) return false;
    if (loggedUser.id === targetUser.id) return false;

    if (loggedUser.role === "SUPERADMIN") return true;
    if (loggedUser.role === "ADMIN") return targetUser.role !== "SUPERADMIN";

    return false;
  };

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!users.length) return <p>No hay usuarios registrados.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Usuarios</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border p-2">{`${u.firstName || ""} ${u.lastName || ""}`}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2 capitalize">{u.role}</td>
              <td className="border p-2">
                {u.isActive ? (
                  <span className="px-2 py-1 bg-green-500 text-white rounded">Activo</span>
                ) : (
                  <span className="px-2 py-1 bg-red-500 text-white rounded">Bloqueado</span>
                )}
              </td>
              <td className="border p-2 flex gap-2 flex-wrap">
                {canChangeRole(u) ? (
                  <button
                    onClick={() =>
                      handleRoleChange(u, u.role === "CLIENT" ? "ADMIN" : "CLIENT")
                    }
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Cambiar a {u.role === "CLIENT" ? "ADMIN" : "CLIENT"}
                  </button>
                ) : (
                  <span className="text-gray-400 italic">Sin permisos</span>
                )}

                {canToggleStatus(u) && (
                  <button
                    onClick={() => handleToggleStatus(u)}
                    className={`px-2 py-1 rounded text-white ${
                      u.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    {u.isActive ? "Bloquear" : "Desbloquear"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
