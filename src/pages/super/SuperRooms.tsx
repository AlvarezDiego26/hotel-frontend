import React, { useEffect, useState } from "react";
import {
  fetchRooms,
  fetchHotels,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../../api";
import Modal from "../../components/Modal";

interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  capacity: number;
  status: string;
  hotelId: number;
  hotel?: { name: string };
}

interface Hotel {
  id: number;
  name: string;
}

const SuperRooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<string>("Todos");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    hotelId: "",
    number: "",
    type: "",
    price: "",
    capacity: "",
    status: "AVAILABLE",
  });
  const [loading, setLoading] = useState(true);

  // === CARGAR DATOS ===
  const loadData = async () => {
    try {
      setLoading(true);
      const roomData = await fetchRooms(undefined, 1, 200);
      const hotelData = await fetchHotels(1, 200);

      const parsedRooms: Room[] =
        roomData?.data ||
        roomData?.items ||
        roomData?.rooms ||
        (Array.isArray(roomData) ? roomData : []);

      const parsedHotels: Hotel[] =
        hotelData?.data ||
        hotelData?.items ||
        hotelData?.hotels ||
        (Array.isArray(hotelData) ? hotelData : []);

      setRooms(parsedRooms);
      setHotels(parsedHotels);
      setFilteredRooms(parsedRooms);
    } catch (err) {
      console.error("Error al cargar habitaciones:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // === FILTRO POR HOTEL ===
  useEffect(() => {
    if (selectedHotel === "Todos") {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(
        rooms.filter((r) => String(r.hotelId) === String(selectedHotel))
      );
    }
  }, [selectedHotel, rooms]);

  // === CRUD ===
  const handleSave = async () => {
    try {
      const payload = {
        hotelId: Number(form.hotelId),
        number: form.number,
        type: form.type,
        price: parseFloat(form.price),
        capacity: parseInt(form.capacity),
        status: form.status,
      };

      if (!payload.hotelId || isNaN(payload.hotelId)) {
        alert("Por favor selecciona un hotel válido.");
        return;
      }

      if (selectedRoom) {
        await updateRoom(selectedRoom.id, payload);
      } else {
        await createRoom(payload);
      }

      await loadData();
      setShowModal(false);
      setSelectedRoom(null);
      resetForm();
    } catch (err) {
      console.error("Error al guardar habitación:", err);
      alert("Error al guardar habitación");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar esta habitación?")) return;
    try {
      await deleteRoom(id);
      await loadData();
    } catch (err) {
      console.error("Error al eliminar habitación:", err);
      alert("Error al eliminar habitación");
    }
  };

  const openModal = (room?: Room) => {
    if (room) {
      setSelectedRoom(room);
      setForm({
        hotelId: String(room.hotelId),
        number: room.number,
        type: room.type,
        price: String(room.price),
        capacity: String(room.capacity),
        status: room.status,
      });
    } else {
      setSelectedRoom(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setForm({
      hotelId: "",
      number: "",
      type: "",
      price: "",
      capacity: "",
      status: "AVAILABLE",
    });
  };

  // === RENDER ===
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          🏠 Gestión de Habitaciones
        </h2>
        <button
          onClick={() => openModal()}
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
        >
          + Nueva Habitación
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-lg shadow mb-5 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Filtrar por hotel
          </label>
          <select
            value={selectedHotel}
            onChange={(e) => setSelectedHotel(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="Todos">Todos los hoteles</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <p className="p-4 text-gray-500 italic">Cargando habitaciones...</p>
        ) : filteredRooms.length ? (
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Número</th>
                <th className="p-3">Tipo</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Capacidad</th>
                <th className="p-3">Estado</th>
                <th className="p-3">Hotel</th>
                <th className="p-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map((r) => (
                <tr key={r.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{r.number}</td>
                  <td className="p-3">{r.type}</td>
                  <td className="p-3">${r.price}</td>
                  <td className="p-3">{r.capacity}</td>
                  <td className="p-3">{r.status}</td>
                  <td className="p-3">{r.hotel?.name || "—"}</td>
                  <td className="p-3 text-right space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => openModal(r)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(r.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-4 text-gray-500 italic">
            No hay habitaciones registradas.
          </p>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          title={selectedRoom ? "Editar Habitación" : "Nueva Habitación"}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-3"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Hotel
              </label>
              <select
                required
                value={form.hotelId}
                onChange={(e) => setForm({ ...form, hotelId: e.target.value })}
                className="border rounded-md p-2 w-full"
              >
                <option value="">Selecciona un hotel</option>
                {hotels.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  value={form.number}
                  onChange={(e) => setForm({ ...form, number: e.target.value })}
                  required
                  className="border rounded-md p-2 w-full"
                />
              </div>

              <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Tipo de habitación
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
                className="border rounded-md p-2 w-full"
              >
                <option value="">Selecciona un tipo</option>
                <option value="SINGLE">Individual</option>
                <option value="DOUBLE">Doble</option>
                <option value="SUITE">Suite</option>
                <option value="DELUXE">Deluxe</option>
              </select>
            </div>

            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="border rounded-md p-2 w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Capacidad
                </label>
                <input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  required
                  className="border rounded-md p-2 w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="border rounded-md p-2 w-full"
              >
                <option value="AVAILABLE">Disponible</option>
                <option value="OCCUPIED">Ocupada</option>
                <option value="MAINTENANCE">Mantenimiento</option>
              </select>
            </div>

            <div className="flex justify-end space-x-2 pt-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                {selectedRoom ? "Guardar cambios" : "Crear"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default SuperRooms;
