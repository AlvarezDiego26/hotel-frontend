// src/pages/admin/AdminHotels.tsx
import React, { useEffect, useState } from "react";
import { fetchHotels } from "../../api";

export default function AdminHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
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
    fetchHotels(1, 20)
      .then((hotels) => {
        console.log("✅ HOTELS FROM API:", hotels);
        setHotels(hotels);
      })
      .catch((err) => {
        console.error("❌ Error fetching hotels:", err);
        setError(err.message || "Error al cargar hoteles");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Cargando hoteles...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!hotels.length) return <p>No hay hoteles disponibles.</p>;

  return (
    <div>
      <h1 className="text-xl font-bold mb-4">Hoteles</h1>
      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Nombre</th>
            <th className="border p-2">Ciudad</th>
            <th className="border p-2">País</th>
          </tr>
        </thead>
        <tbody>
          {hotels.map((h) => (
            <tr key={h.id} className="hover:bg-gray-50">
              <td className="border p-2">{h.name}</td>
              <td className="border p-2">{h.city}</td>
              <td className="border p-2">{h.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
