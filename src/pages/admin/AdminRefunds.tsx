import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AdminRefunds() {
  const { token } = useAuth();
  const [refunds, setRefunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRefunds = () => {
    fetch(`${import.meta.env.VITE_API_URL}/refunds`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setRefunds(data.items || data))
      .finally(() => setLoading(false));
  };

  const reviewRefund = (id: number, approve: boolean) => {
    fetch(`${import.meta.env.VITE_API_URL}/refunds/review`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refundRequestId: id, approve }),
    }).then(() => fetchRefunds());
  };

  useEffect(() => {
    fetchRefunds();
  }, []);

  if (loading) return <p>Cargando reembolsos...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Solicitudes de Reembolso</h1>
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Usuario</th>
            <th className="border p-2">Reserva</th>
            <th className="border p-2">Monto</th>
            <th className="border p-2">Motivo</th>
            <th className="border p-2">Estado</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {refunds.map((r) => (
            <tr key={r.id}>
              <td className="border p-2">{r.user?.email}</td>
              <td className="border p-2">{r.reservation?.id}</td>
              <td className="border p-2">
                {r.reservation?.payment?.amount
                  ? `S/. ${Number(r.reservation.payment.amount).toFixed(2)}`
                  : "—"}
              </td>
              <td className="border p-2">{r.reason || "—"}</td>
              <td className="border p-2">{r.status}</td>
              <td className="border p-2 space-x-2">
                {r.status === "PENDING" && (
                  <>
                    <button
                      onClick={() => reviewRefund(r.id, true)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Aprobar
                    </button>
                    <button
                      onClick={() => reviewRefund(r.id, false)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Rechazar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
