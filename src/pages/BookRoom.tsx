import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  createReservation,
  fetchRoomAvailability,
  confirmPayment,
} from "../api";
import { format, isWithinInterval, parseISO } from "date-fns";
import Modal from "../components/Modal";
import Login from "./Login";

type PaymentMethod = "CARD" | "PAYPAL" | "TRANSFER" | "CULQI";

export default function BookRoom() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [dates, setDates] = useState<[Date, Date] | null>(null);
  const [unavailable, setUnavailable] = useState<
    { startDate: string; endDate: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [reservationId, setReservationId] = useState<number | null>(null);

  // Estado del login modal
  const [loginModal, setLoginModal] = useState(false);

  // Campos de pago
  const [method, setMethod] = useState<PaymentMethod>("CARD");
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [bankRef, setBankRef] = useState("");
  const [culqiCode, setCulqiCode] = useState("");

  const token = localStorage.getItem("token");
  const userLoggedIn = !!token;

  // Cargar disponibilidad
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const data = await fetchRoomAvailability(Number(id));
        setUnavailable(data);
      } catch (err) {
        console.error("Error cargando disponibilidad:", err);
      }
    };
    loadAvailability();
  }, [id]);

  const isDateBooked = (date: Date) => {
    return unavailable.some((r) =>
      isWithinInterval(date, {
        start: parseISO(r.startDate),
        end: parseISO(r.endDate),
      })
    );
  };

  // Paso 1 — Seleccionar fechas
  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!dates) {
      setError("Selecciona un rango de fechas disponible.");
      return;
    }

    // Si no está logueado, abrir modal de login
    if (!userLoggedIn) {
      setLoginModal(true);
      return;
    }

    setShowPayment(true);
  };

  // Paso 2 — Pago
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const [start, end] = dates!;

    try {
      let currentReservationId = reservationId;
      if (!currentReservationId) {
        const reservation = await createReservation(
          id!,
          start.toISOString(),
          end.toISOString()
        );
        currentReservationId = reservation.reservation.id;
        setReservationId(currentReservationId);
      }

      const paymentInfo: any = {};
      if (method === "CARD") {
        paymentInfo.cardHolder = cardHolder;
        paymentInfo.cardNumber = cardNumber;
      } else if (method === "PAYPAL") {
        paymentInfo.cardHolder = paypalEmail;
      } else if (method === "TRANSFER") {
        paymentInfo.cardHolder = bankRef;
      } else if (method === "CULQI") {
        paymentInfo.cardHolder = culqiCode;
      }

      const response = await confirmPayment(
        currentReservationId,
        method,
        100,
        paymentInfo
      );

      if (!response || response.error) {
        throw new Error(response?.error || "Error al procesar el pago");
      }

      alert("✅ Pago realizado y reserva confirmada correctamente.");
      navigate("/reservations");
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err?.message || "Error al procesar la reserva o el pago.");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Cuando se cierre el modal tras login exitoso
  const handleLoginSuccess = () => {
    setLoginModal(false);
    setShowPayment(true); // mostrar paso de pago
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">
          Reservar habitación #{id}
        </h2>

        {error && <p className="text-red-600 mb-3">{error}</p>}

        {!showPayment ? (
          <>
            <Calendar
              selectRange
              value={dates}
              onChange={(value) => setDates(value as [Date, Date])}
              tileDisabled={({ date }) => isDateBooked(date)}
              tileClassName={({ date }) =>
                isDateBooked(date)
                  ? "bg-red-400 text-white rounded-md"
                  : undefined
              }
            />

            <div className="text-sm text-gray-600 mt-2 flex items-center">
              <span className="bg-red-400 w-4 h-4 inline-block rounded mr-2"></span>
              Fechas ocupadas
            </div>

            <form onSubmit={handleReserve} className="mt-6">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
              >
                Continuar con el pago
              </button>
            </form>
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Método de pago
            </h3>
            <select
              value={method}
              onChange={(e) =>
                setMethod(
                  e.target.value as "CARD" | "PAYPAL" | "TRANSFER" | "CULQI"
                )
              }
              className="border rounded w-full p-2 mb-4"
            >
              <option value="CARD">💳 Tarjeta</option>
              <option value="PAYPAL">🅿️ PayPal</option>
              <option value="TRANSFER">🏦 Transferencia bancaria</option>
              <option value="CULQI">💸 Culqi</option>
            </select>

            {method === "CARD" && (
              <>
                <label className="block mb-2">Nombre del titular</label>
                <input
                  type="text"
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="border rounded w-full p-2 mb-3"
                  placeholder="Ej: Juan Pérez"
                  required
                />
                <label className="block mb-2">Número de tarjeta</label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="border rounded w-full p-2 mb-4"
                  placeholder="**** **** **** 1234"
                  maxLength={16}
                  required
                />
              </>
            )}

            {method === "PAYPAL" && (
              <>
                <label className="block mb-2">Correo de PayPal</label>
                <input
                  type="email"
                  value={paypalEmail}
                  onChange={(e) => setPaypalEmail(e.target.value)}
                  className="border rounded w-full p-2 mb-4"
                  placeholder="usuario@paypal.com"
                  required
                />
              </>
            )}

            {method === "TRANSFER" && (
              <>
                <label className="block mb-2">Referencia bancaria</label>
                <input
                  type="text"
                  value={bankRef}
                  onChange={(e) => setBankRef(e.target.value)}
                  className="border rounded w-full p-2 mb-4"
                  placeholder="Código o número de operación"
                  required
                />
              </>
            )}

            {method === "CULQI" && (
              <>
                <label className="block mb-2">Código de transacción Culqi</label>
                <input
                  type="text"
                  value={culqiCode}
                  onChange={(e) => setCulqiCode(e.target.value)}
                  className="border rounded w-full p-2 mb-4"
                  placeholder="Ej: CULQI1234"
                  required
                />
              </>
            )}

            <form onSubmit={handlePayment}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                {loading ? "Procesando pago..." : "Confirmar pago"}
              </button>
            </form>

            <button
              onClick={() => setShowPayment(false)}
              className="w-full mt-3 bg-gray-300 text-gray-800 py-2 rounded hover:bg-gray-400 transition"
            >
              Volver al calendario
            </button>
          </>
        )}
      </div>

      {/* Modal de login */}
      <Modal
        open={loginModal}
        onClose={() => setLoginModal(false)}
        title="Inicia sesión o regístrate"
      >
        <Login onSuccess={handleLoginSuccess} />
      </Modal>
    </div>
  );
}
