import React, { useEffect, useState } from "react";
import { fetchRooms } from "../../api"; // usamos tu helper centralizado

export default function AdminRooms() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No hay token de acceso");
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchRooms(undefined, 1, 50) // podemos traer hasta 50 para admins
      .then((data) => {
        console.log("FULL DATA FROM API (ROOMS):", data);

        // 🔹 Detectar la estructura devuelta por el backend
        if (Array.isArray(data.data)) setRooms(data.data);
        else if (Array.isArray(data.items)) setRooms(data.items);
        else if (Array.isArray(data.rooms)) setRooms(data.rooms);
        else if (Array.isArray(data)) setRooms(data);
        else setRooms([]);
      })
      .catch((err) => {
        console.error("Error fetching rooms:", err);
        setError(err.message || "Error al cargar habitaciones");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Cargando habitaciones...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!rooms.length) return <p>No hay habitaciones disponibles.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Habitaciones</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr>
            <th className="border p-2">Número</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Precio</th>
            <th className="border p-2">Capacidad</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Hotel</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.number}</td>
              <td className="border p-2">{r.type}</td>
              <td className="border p-2">{r.price}</td>
              <td className="border p-2">{r.capacity}</td>
              <td className="border p-2">{r.status}</td>
              <td className="border p-2">{r.hotel?.name || r.hotelName || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
