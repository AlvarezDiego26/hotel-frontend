import React, { useState, useEffect } from "react";
import { HotelPayload } from "../api";

interface Props {
  hotel?: any;
  onSave: (payload: HotelPayload) => void;
  onCancel: () => void;
}

export default function HotelForm({ hotel, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState<HotelPayload>({
    name: "",
    address: "",
    city: "",
    country: "",
    district: "",
    stars: 1,
    description: "",
    latitude: 0,
    longitude: 0,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (hotel) setFormData(hotel);
  }, [hotel]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, address, city, country } = formData;
    if (!name || !address || !city || !country) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <p className="text-red-600 text-sm">{error}</p>}

      <div>
        <label className="block text-sm font-medium">Nombre</label>
        <input
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Nombre del hotel"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Dirección</label>
        <input
          value={formData.address}
          onChange={(e) =>
            setFormData({ ...formData, address: e.target.value })
          }
          className="w-full border p-2 rounded"
          placeholder="Dirección completa"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Ciudad</label>
          <input
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">País</label>
          <input
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium">Distrito</label>
        <input
          value={formData.district}
          onChange={(e) =>
            setFormData({ ...formData, district: e.target.value })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Estrellas</label>
        <input
          type="number"
          min={1}
          max={5}
          value={formData.stars}
          onChange={(e) =>
            setFormData({ ...formData, stars: Number(e.target.value) })
          }
          className="w-full border p-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Descripción</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full border p-2 rounded"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium">Latitud</label>
          <input
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) =>
              setFormData({ ...formData, latitude: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Longitud</label>
          <input
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) =>
              setFormData({ ...formData, longitude: Number(e.target.value) })
            }
            className="w-full border p-2 rounded"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
