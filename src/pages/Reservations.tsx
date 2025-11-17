import React, { useEffect, useState } from "react";
import { fetchReservations, cancelReservation } from "../api";

type Reservation = {
  id: number;
  status: string;
  startDate?: string | null;
  endDate?: string | null;
  totalAmount?: number | null;
  room?: {
    id: number;
    number: string;
    hotel?: { id: number; name: string };
  } | null;
  payment?: { id: number; status: string; amount?: number };
  createdAt?: string;
};

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchReservations();
      const data = res.data ?? res;
      setReservations(data);
    } catch (err: any) {
      setError(err?.error || err?.message || "Error al cargar reservas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCancel = async (reservationId: number) => {
    if (!confirm("¿Seguro que deseas cancelar esta reserva?")) return;

    const reason = prompt("Por favor indica el motivo de la cancelación (opcional):") || "";

    setBusyId(reservationId);
    try {
      await cancelReservation(reservationId, reason);
      await load();
      alert("Solicitud de cancelación enviada correctamente");
    } catch (err: any) {
      console.error("Error al cancelar:", err);
      alert(err?.error || err?.message || "No se pudo cancelar la reserva");
    } finally {
      setBusyId(null);
    }
  };


  if (loading) return <p className="p-6 text-gray-500">Cargando reservas...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (reservations.length === 0)
    return <p className="p-6 text-gray-600">No tienes reservas aún.</p>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-700",
    REFUNDED: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">Mis Reservas</h1>

        <div className="space-y-4">
          {reservations.map((r) => (
            <div
              key={r.id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between transition hover:shadow-md"
            >
              <div>
                <div className="font-semibold">
                  {r.room?.hotel?.name ?? "Hotel desconocido"} — Habitación{" "}
                  {r.room?.number}
                </div>
                <div className="text-sm text-gray-600">
                  {r.startDate
                    ? `Desde: ${new Date(r.startDate).toLocaleDateString()}`
                    : ""}
                  {r.endDate
                    ? ` · Hasta: ${new Date(r.endDate).toLocaleDateString()}`
                    : ""}
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  Estado:{" "}
                  <span
                    className={`px-2 py-1 rounded ${statusColors[r.status] || ""}`}
                  >
                    {r.status}
                  </span>
                  {r.totalAmount ? ` · $${r.totalAmount}` : ""}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Reservado el:{" "}
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleString()
                    : "Fecha desconocida"}
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex items-center gap-3">
                {r.payment && (
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      r.payment.status === "COMPLETED"
                        ? "bg-green-100 text-green-700"
                        : r.payment.status === "REFUNDED"
                        ? "bg-gray-100 text-gray-600"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    Pago: {r.payment.status}
                  </span>
                )}

                {["PENDING", "CONFIRMED"].includes(r.status) && (
                  <button
                    onClick={() => handleCancel(r.id)}
                    disabled={busyId === r.id}
                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {busyId === r.id ? "Cancelando..." : "Cancelar"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
