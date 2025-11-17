// src/pages/AdminRefunds.tsx
import React, { useEffect, useState } from "react";
import { fetchRefundRequests, reviewRefundRequest } from "../api";

type Refund = {
  id: number;
  reservationId: number;
  userId: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  reason?: string;
  createdAt: string;
  reviewedAt?: string | null;
  reviewedById?: number | null;
  reservation?: any;
  user?: any;
};

export default function AdminRefunds() {
  const [refunds, setRefunds] = useState<Refund[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchRefundRequests();
      setRefunds(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.error || err?.message || "Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleReview = async (id: number, approve: boolean) => {
    if (!confirm(`¿Seguro que deseas ${approve ? "APROBAR" : "RECHAZAR"} esta solicitud?`)) return;
    setBusyId(id);
    try {
      await reviewRefundRequest(id, approve);
      alert(approve ? "Reembolso aprobado" : "Reembolso rechazado");
      await load();
    } catch (err: any) {
      console.error(err);
      alert(err?.error || err?.message || "Error al procesar la solicitud");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <p className="p-6 text-gray-500">Cargando solicitudes...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;
  if (refunds.length === 0) return <p className="p-6 text-gray-600">No hay solicitudes.</p>;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Solicitudes de Reembolso</h1>
        <div className="space-y-4">
          {refunds.map(r => (
            <div key={r.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:justify-between">
              <div>
                <div className="font-semibold">
                  Reserva #{r.reservationId} — {r.reservation?.room?.hotel?.name ?? "Hotel desconocido"}
                </div>
                <div className="text-sm text-gray-600">
                  Solicitante: {r.user?.firstName ?? r.user?.email ?? "Usuario"} · {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="mt-2 text-sm">
                  Motivo: {r.reason ?? "—"}
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  Estado: <span className="font-medium">{r.status}</span>
                </div>
              </div>

              <div className="mt-3 md:mt-0 flex gap-2 items-center">
                {r.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleReview(r.id, true)}
                      disabled={busyId === r.id}
                      className="px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => handleReview(r.id, false)}
                      disabled={busyId === r.id}
                      className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Rechazar
                    </button>
                  </>
                )}
                {r.status !== "PENDING" && (
                  <div className="text-sm text-gray-600">
                    {r.status} {r.reviewedAt ? `· ${new Date(r.reviewedAt).toLocaleString()}` : ""}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
