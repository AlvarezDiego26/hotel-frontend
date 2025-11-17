import React, { useEffect, useState } from "react";
import {
  fetchHotels,
  createHotel,
  updateHotel,
  deleteHotel,
  HotelPayload,
} from "../../api";
import Modal from "../../components/Modal";
import HotelForm from "../../components/HotelForm";

type Hotel = {
  id: number;
  name: string;
  district: string;
  city: string;
  country: string;
};

const SuperHotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<Hotel[]>([]);
  const [selected, setSelected] = useState<Hotel | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [countries, setCountries] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("Todos");
  const [selectedDistrict, setSelectedDistrict] = useState("Todos");

  // === CARGAR HOTELES ===
  const loadHotels = async () => {
    try {
      const data: Hotel[] = await fetchHotels(1, 200); // traer más para filtrar bien
      setHotels(data);

      // Extraer países y distritos únicos (con tipado correcto)
      const uniqueCountries = Array.from(
        new Set(data.map((h) => h.country).filter(Boolean))
      ) as string[];

      const uniqueDistricts = Array.from(
        new Set(data.map((h) => h.district).filter(Boolean))
      ) as string[];

      setCountries(uniqueCountries);
      setDistricts(uniqueDistricts);
      setFilteredHotels(data);
    } catch (err) {
      console.error("Error cargando hoteles:", err);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  // === FILTROS ===
  useEffect(() => {
    let filtered = hotels;

    if (selectedCountry !== "Todos") {
      filtered = filtered.filter((h) => h.country === selectedCountry);
    }

    if (selectedDistrict !== "Todos") {
      filtered = filtered.filter((h) => h.district === selectedDistrict);
    }

    setFilteredHotels(filtered);
  }, [selectedCountry, selectedDistrict, hotels]);

  // === CRUD ===
  const handleSave = async (payload: HotelPayload) => {
    if (selected) await updateHotel(selected.id, payload);
    else await createHotel(payload);
    setShowModal(false);
    setSelected(null);
    await loadHotels();
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Seguro que deseas eliminar este hotel?")) {
      await deleteHotel(id);
      await loadHotels();
    }
  };

  // === RENDER ===
  return (
    <div className="p-6">
      {/* Encabezado */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-gray-800">
          🏨 Gestión de Hoteles
        </h2>
        <button
          className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition"
          onClick={() => {
            setSelected(null);
            setShowModal(true);
          }}
        >
          + Nuevo Hotel
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white p-4 rounded-lg shadow mb-5 flex flex-wrap gap-4 items-center">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            País
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="Todos">Todos los países</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Distrito
          </label>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="Todos">Todos los distritos</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nombre</th>
              <th className="p-3">Distrito</th>
              <th className="p-3">Ciudad</th>
              <th className="p-3">País</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredHotels.map((hotel) => (
              <tr key={hotel.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{hotel.name}</td>
                <td className="p-3">{hotel.district}</td>
                <td className="p-3">{hotel.city}</td>
                <td className="p-3">{hotel.country}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={() => {
                      setSelected(hotel);
                      setShowModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    onClick={() => handleDelete(hotel.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {filteredHotels.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-gray-500 italic"
                >
                  No hay hoteles que coincidan con los filtros seleccionados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => {
            setShowModal(false);
            setSelected(null);
          }}
          title={selected ? "Editar Hotel" : "Nuevo Hotel"}
        >
          <HotelForm
            hotel={selected}
            onSave={handleSave}
            onCancel={() => {
              setShowModal(false);
              setSelected(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default SuperHotels;
