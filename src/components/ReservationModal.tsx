import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { isWithinInterval, parseISO } from "date-fns";

interface Props {
  hotel: any;
  room: any;
  onClose: () => void;
  onConfirm: (dates: { startDate: string; endDate: string }) => void;
}

export default function ReservationModal({ hotel, room, onClose, onConfirm }: Props) {
  const [dates, setDates] = useState<[Date, Date] | null>(null);
  const [error, setError] = useState("");

  const isDateBooked = (date: Date) => {
    return room.unavailableDates?.some(r =>
      isWithinInterval(date, { start: parseISO(r.startDate), end: parseISO(r.endDate) })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dates) {
      setError("Selecciona un rango de fechas");
      return;
    }
    const [start, end] = dates;
    onConfirm({ startDate: start.toISOString(), endDate: end.toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-3">Reservar {room.name}</h2>
        {error && <p className="text-red-600 mb-2">{error}</p>}

        <Calendar
          selectRange
          value={dates}
          onChange={(val) => setDates(val as [Date, Date])}
          tileDisabled={({ date }) => isDateBooked(date)}
          tileClassName={({ date }) => (isDateBooked(date) ? "bg-red-400 text-white rounded-md" : undefined)}
        />

        <div className="text-sm text-gray-600 mt-2 flex items-center">
          <span className="bg-red-400 w-4 h-4 inline-block rounded mr-2"></span> Fechas ocupadas
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancelar</button>
          <button onClick={handleSubmit} className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirmar reserva</button>
        </div>
      </div>
    </div>
  );
}
