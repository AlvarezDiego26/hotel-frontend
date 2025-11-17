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

export default function SuperAdmins() {
  const { user: loggedUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"" | "CLIENT" | "ADMIN" | "SUPERADMIN">("");

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

  const handleChangeRole = async (targetUser: User, newRole: User["role"]) => {
    if (targetUser.role === "SUPERADMIN" && loggedUser?.role !== "SUPERADMIN") {
      alert("No tienes permisos para cambiar el rol de un SuperAdmin.");
      return;
    }

    if (!confirm(`¿Cambiar rol de ${targetUser.firstName || ""} a ${newRole}?`)) return;

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

  const filteredUsers = users.filter(
    (u) =>
      (`${u.firstName || ""} ${u.lastName || ""}`.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "" || u.role === roleFilter)
  );

  if (loading) return <p>Cargando usuarios...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!users.length) return <p>No hay usuarios registrados.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Administradores del sistema</h1>

      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded p-2 w-full max-w-md"
        />

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as any)}
          className="border rounded p-2"
        >
          <option value="">Todos los roles</option>
          <option value="SUPERADMIN">SUPERADMIN</option>
          <option value="ADMIN">ADMIN</option>
          <option value="CLIENT">CLIENT</option>
        </select>
      </div>

      <table className="w-full border-collapse border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Rol</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => {
            const isLoggedUserSuperAdmin = loggedUser?.role === "SUPERADMIN";

            const canChangeRole =
              loggedUser?.id !== u.id &&
              (isLoggedUserSuperAdmin || (loggedUser?.role === "ADMIN" && u.role !== "SUPERADMIN"));

            const canToggleStatus =
              loggedUser?.id !== u.id &&
              (isLoggedUserSuperAdmin || (loggedUser?.role === "ADMIN" && u.role !== "SUPERADMIN"));

            return (
              <tr key={u.id}>
                <td className="border p-2">{`${u.firstName || ""} ${u.lastName || ""}`}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">
                  {u.role === "SUPERADMIN" ? (
                    <span className="px-2 py-1 bg-purple-500 text-white rounded">SUPERADMIN</span>
                  ) : u.role === "ADMIN" ? (
                    <span className="px-2 py-1 bg-blue-500 text-white rounded">ADMIN</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-300 rounded">CLIENT</span>
                  )}
                </td>
                <td className="border p-2">
                  {u.isActive ? (
                    <span className="px-2 py-1 bg-green-500 text-white rounded">Activo</span>
                  ) : (
                    <span className="px-2 py-1 bg-red-500 text-white rounded">Bloqueado</span>
                  )}
                </td>
                <td className="border p-2 flex gap-2 justify-center flex-wrap">
                  {canChangeRole ? (
                    <button
                      onClick={() =>
                        handleChangeRole(u, u.role === "CLIENT" ? "ADMIN" : "CLIENT")
                      }
                      className={`px-2 py-1 rounded text-white ${
                        u.role === "CLIENT"
                          ? "bg-blue-500 hover:bg-blue-600"
                          : "bg-yellow-500 hover:bg-yellow-600"
                      }`}
                    >
                      Cambiar a {u.role === "CLIENT" ? "ADMIN" : "CLIENT"}
                    </button>
                  ) : (
                    <span className="text-gray-400 italic">Sin permisos</span>
                  )}

                  {canToggleStatus && (
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
