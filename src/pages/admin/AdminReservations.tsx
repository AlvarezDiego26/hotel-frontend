import React, { useEffect, useState } from "react";
import { fetchReservations, cancelReservation } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function AdminReservations() {
  const { token } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Cargar reservas desde la API centralizada
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchReservations();
      console.log("✅ RESERVATIONS DATA:", data);

      if (Array.isArray(data.data)) setReservations(data.data);
      else if (Array.isArray(data.items)) setReservations(data.items);
      else if (Array.isArray(data.reservations)) setReservations(data.reservations);
      else if (Array.isArray(data)) setReservations(data);
      else setReservations([]);
    } catch (err: any) {
      console.error("❌ Error al obtener reservas:", err);
      setError(err.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Confirmar reserva (solo si tu backend tiene este endpoint)
  const handleConfirm = async (reservationId: number) => {
    if (!confirm("¿Confirmar esta reserva?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reservations/confirm`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reservationId, paymentMethod: "ADMIN_MANUAL" }),
      });

      if (!res.ok) throw new Error("Error al confirmar la reserva");

      alert("✅ Reserva confirmada correctamente");
      await loadReservations();
    } catch (err) {
      console.error("❌ Error al confirmar:", err);
      alert("Error al confirmar la reserva");
    }
  };

  // 🔹 Cancelar reserva (usa la función de api.ts)
  const handleCancel = async (reservationId: number) => {
    if (!confirm("¿Cancelar esta reserva?")) return;

    try {
      await cancelReservation(reservationId, "Cancelado por administrador");
      alert("🚫 Reserva cancelada correctamente");
      await loadReservations();
    } catch (err) {
      console.error("❌ Error al cancelar:", err);
      alert("Error al cancelar la reserva");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // 🔹 Estados de carga y error
  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!reservations.length) return <p>No hay reservas registradas.</p>;

  // 🔹 Render principal
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>

      <table className="w-full table-auto border-collapse border border-gray-300 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Habitación</th>
            <th className="border p-2">Hotel</th>
            <th className="border p-2">Fecha Inicio</th>
            <th className="border p-2">Fecha Fin</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.user?.email || "N/A"}</td>
              <td className="border p-2">{r.room?.number || "N/A"}</td>
              <td className="border p-2">{r.room?.hotel?.name || "N/A"}</td>
              <td className="border p-2">
                {new Date(r.startDate).toLocaleDateString()}
              </td>
              <td className="border p-2">
                {new Date(r.endDate).toLocaleDateString()}
              </td>
              <td className="border p-2">{r.status}</td>

              {/* 🔹 Acciones dinámicas */}
              <td className="border p-2 text-center">
                {r.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleConfirm(r.id)}
                      className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 mr-2"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Cancelar
                    </button>
                  </>
                )}

                {r.status === "CONFIRMED" && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancelar
                  </button>
                )}

                {r.status === "CANCELLED" && (
                  <span className="text-gray-400 italic">Sin acciones</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
