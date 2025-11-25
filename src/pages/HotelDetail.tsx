import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { fetchRoomAvailability } from "../api";
import Modal from "../components/Modal";
import Login from "./Login";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

L.Marker.prototype.options.icon = DefaultIcon;

type Room = {
  id: number;
  name: string;
  type: string;
  capacity: number;
  price: number;
  available: boolean;
  unavailableDates?: { startDate: string; endDate: string }[];
};

type Hotel = {
  id: number;
  name: string;
  city: string;
  country: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  rooms: Room[];
};

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loginModal, setLoginModal] = useState(false);

  const [filters, setFilters] = useState({
    type: "ALL",
    minPrice: 0,
    maxPrice: 9999,
    availableOnly: false,
  });

  // URL DEL BACKEND PARA PRODUCCIÓN
  const API_URL = import.meta.env.VITE_API_URL || "https://reservationsystem-wine.vercel.app";

  // ================================
  // Cargar datos del hotel
  // ================================
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`${API_URL}/api/hotels/${id}`);
        const data = await res.json();
        setHotel(data);
        setFilteredRooms(data.rooms);
      } catch (error) {
        console.error("Error cargando hotel:", error);
      }
    };

    fetchHotel();
  }, [id]);

  // ================================
  // Filtros
  // ================================
  useEffect(() => {
    if (!hotel) return;

    let filtered = hotel.rooms;

    if (filters.type !== "ALL") {
      filtered = filtered.filter((r) => r.type === filters.type);
    }

    filtered = filtered.filter(
      (r) => r.price >= filters.minPrice && r.price <= filters.maxPrice
    );

    if (filters.availableOnly) {
      filtered = filtered.filter((r) => r.available);
    }

    setFilteredRooms(filtered);
  }, [filters, hotel]);

  // ================================
  // Cargar disponibilidad
  // ================================
  useEffect(() => {
    const loadAvailability = async () => {
      if (!hotel) return;

      const updatedRooms = await Promise.all(
        hotel.rooms.map(async (room) => {
          const unavailable = await fetchRoomAvailability(room.id);
          return { ...room, unavailableDates: unavailable || [] };
        })
      );

      setHotel((prev) =>
        prev ? { ...prev, rooms: updatedRooms } : prev
      );
    };

    loadAvailability();
  }, [hotel?.id]);

  // ================================
  // Reservar → va al calendario
  // ================================
  const handleReserve = (roomId: number) => {
    navigate(`/rooms/${roomId}/book`);
  };

  if (!hotel)
    return <p className="text-center text-gray-500">Cargando hotel...</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-blue-600 hover:underline"
      >
        ← Volver
      </button>

      <h1 className="text-3xl font-bold text-blue-700">{hotel.name}</h1>
      <p className="text-gray-600">{hotel.city}, {hotel.country}</p>
      <p className="mt-2 text-gray-700">{hotel.description}</p>

      {/* MAPA */}
      {hotel.latitude && hotel.longitude ? (
        <MapContainer
          center={[hotel.latitude, hotel.longitude]}
          zoom={15}
          scrollWheelZoom={false}
          className="h-64 w-full rounded-lg my-4"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[hotel.latitude, hotel.longitude]}>
            <Popup>{hotel.name}</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p className="text-gray-500 my-4">Ubicación no disponible</p>
      )}

      {/* FILTROS */}
      <div className="bg-white shadow rounded-lg p-4 mb-6 flex flex-wrap items-center gap-4">
        <div>
          <label className="text-sm font-semibold block mb-1">Tipo</label>
          <select
            className="border rounded p-2"
            value={filters.type}
            onChange={(e) =>
              setFilters({ ...filters, type: e.target.value })
            }
          >
            <option value="ALL">Todas</option>
            <option value="SINGLE">Single</option>
            <option value="DOUBLE">Double</option>
            <option value="FAMILY">Familiar</option>
            <option value="SUITE">Suite</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Min</label>
          <input
            type="number"
            className="border rounded p-2 w-24"
            value={filters.minPrice}
            onChange={(e) =>
              setFilters({ ...filters, minPrice: Number(e.target.value) })
            }
          />
        </div>

        <div>
          <label className="text-sm font-semibold block mb-1">Max</label>
          <input
            type="number"
            className="border rounded p-2 w-24"
            value={filters.maxPrice}
            onChange={(e) =>
              setFilters({ ...filters, maxPrice: Number(e.target.value) })
            }
          />
        </div>

        <div className="flex items-center gap-2 mt-5">
          <input
            type="checkbox"
            checked={filters.availableOnly}
            onChange={(e) =>
              setFilters({ ...filters, availableOnly: e.target.checked })
            }
          />
          <label className="text-sm">Solo disponibles</label>
        </div>
      </div>

      {/* HABITACIONES */}
      <h2 className="text-xl font-semibold mb-4">Habitaciones</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRooms.length > 0 ? (
          filteredRooms.map((room) => (
            <div
              key={room.id}
              className="border rounded-lg p-4 shadow bg-white hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold">{room.name}</h3>
              <p className="text-sm text-gray-600">Tipo: {room.type}</p>
              <p className="text-sm text-gray-600">
                Capacidad: {room.capacity} personas
              </p>
              <p className="text-sm text-gray-800 font-semibold mt-1">
                ${room.price} / noche
              </p>
              <p
                className={`text-sm mt-1 ${
                  room.available ? "text-green-600" : "text-red-500"
                }`}
              >
                {room.available ? "Disponible" : "Ocupada"}
              </p>

              {room.available && (
                <button
                  onClick={() => handleReserve(room.id)}
                  className="mt-3 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                >
                  Reservar
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500">No hay habitaciones disponibles con esos filtros.</p>
        )}
      </div>

      {/* MODAL LOGIN */}
      <Modal
        open={loginModal}
        onClose={() => setLoginModal(false)}
        title="Inicia sesión o regístrate"
      >
        <Login />
      </Modal>
    </div>
  );
}
