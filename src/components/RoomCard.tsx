import React from "react";

export type RoomCardProps = {
  room: {
    id: number;
    number: string;
    type: string;
    price: number;
    capacity?: number;
    status?: string;
  };
};

export default function RoomCard({ room }: RoomCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
      <img
        src={`https://picsum.photos/seed/room${room.id}/400/200`}
        alt={`Room ${room.number}`}
        className="rounded-lg mb-3 w-full object-cover h-40"
      />
      <h2 className="text-lg font-semibold text-blue-700">
        Habitación {room.number}
      </h2>
      <p className="text-sm text-gray-600">Tipo: {room.type}</p>
      <p className="text-sm text-gray-600">
        Capacidad: {room.capacity || 1} personas
      </p>
      <p className="text-gray-800 font-bold mt-1">
        ${room.price} / noche
      </p>
      <p
        className={`mt-1 text-sm font-medium ${
          room.status === "AVAILABLE" ? "text-green-600" : "text-red-600"
        }`}
      >
        {room.status === "AVAILABLE" ? "Disponible" : "No disponible"}
      </p>
    </div>
  );
}
  