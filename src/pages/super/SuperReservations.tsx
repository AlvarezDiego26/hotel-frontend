import React, { useEffect, useState } from "react";
import { fetchReservations, cancelReservation } from "../../api";

const SuperReservations: React.FC = () => {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // === CARGAR RESERVAS ===
  const loadReservations = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchReservations();

      // Detectar estructura dinámica
      if (Array.isArray(data.data)) setReservations(data.data);
      else if (Array.isArray(data.items)) setReservations(data.items);
      else if (Array.isArray(data.reservations)) setReservations(data.reservations);
      else if (Array.isArray(data)) setReservations(data);
      else setReservations([]);
    } catch (err: any) {
      console.error("❌ Error al cargar reservas:", err);
      setError(err.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  // === CANCELAR RESERVA ===
  const handleCancel = async (reservationId: number) => {
    if (!confirm("¿Deseas cancelar esta reserva?")) return;

    try {
      await cancelReservation(reservationId, "Cancelado por superadministrador");
      alert("🚫 Reserva cancelada correctamente");
      await loadReservations();
    } catch (err) {
      console.error("❌ Error al cancelar reserva:", err);
      alert("Error al cancelar la reserva");
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // === ESTADOS DE CARGA / ERROR / VACÍO ===
  if (loading)
    return <p className="text-gray-600 italic">Cargando reservas...</p>;
  if (error)
    return <p className="text-red-500 font-semibold">⚠️ {error}</p>;
  if (!reservations.length)
    return <p className="text-gray-500 italic">No hay reservas registradas.</p>;

  // === RENDER PRINCIPAL ===
  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        📋 Gestión Global de Reservas
      </h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3 text-left">Usuario</th>
              <th className="border p-3 text-left">Hotel</th>
              <th className="border p-3 text-left">Habitación</th>
              <th className="border p-3 text-left">Inicio</th>
              <th className="border p-3 text-left">Fin</th>
              <th className="border p-3 text-left">Estado</th>
              <th className="border p-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {reservations.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 border-t">
                <td className="border p-3">{r.user?.email || "N/A"}</td>
                <td className="border p-3">{r.room?.hotel?.name || "N/A"}</td>
                <td className="border p-3">{r.room?.number || "N/A"}</td>
                <td className="border p-3">
                  {r.startDate
                    ? new Date(r.startDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="border p-3">
                  {r.endDate
                    ? new Date(r.endDate).toLocaleDateString()
                    : "—"}
                </td>
                <td className="border p-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      r.status === "CONFIRMED"
                        ? "bg-green-100 text-green-700"
                        : r.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* === ACCIONES === */}
                <td className="border p-3 text-center">
                  {r.status === "CANCELLED" ? (
                    <span className="text-gray-400 italic">Sin acciones</span>
                  ) : (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperReservations;
