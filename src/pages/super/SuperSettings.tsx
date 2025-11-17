import React, { useEffect, useState } from "react";
import { fetchGlobalSettings, updateGlobalSettings } from "../../api";

interface GlobalSetting {
  key: string;
  value: string;
  description?: string;
}

export default function SuperSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [basePrices, setBasePrices] = useState({
    SINGLE: 40,
    DOUBLE: 60,
    SUITE: 120,
    FAMILY: 90,
  });
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // === Cargar configuraciones desde el backend ===
  useEffect(() => {
    async function loadSettings() {
      try {
        const data: GlobalSetting[] = await fetchGlobalSettings();

        const getVal = (key: string) =>
          data.find((s) => s.key === key)?.value ?? "";

        setBasePrices({
          SINGLE: Number(getVal("BASE_PRICE_SINGLE") || 40),
          DOUBLE: Number(getVal("BASE_PRICE_DOUBLE") || 60),
          SUITE: Number(getVal("BASE_PRICE_SUITE") || 120),
          FAMILY: Number(getVal("BASE_PRICE_FAMILY") || 90),
        });

        setMaintenanceMode(getVal("MAINTENANCE_MODE") === "true");
      } catch (err) {
        console.error("Error cargando configuraciones:", err);
        alert("❌ No se pudieron cargar las configuraciones globales.");
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  // === Manejar cambios en precios ===
  const handlePriceChange = (type: string, value: number) => {
    setBasePrices((prev) => ({ ...prev, [type]: value }));
  };

  // === Guardar cambios ===
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const settings = [
        { key: "BASE_PRICE_SINGLE", value: basePrices.SINGLE },
        { key: "BASE_PRICE_DOUBLE", value: basePrices.DOUBLE },
        { key: "BASE_PRICE_SUITE", value: basePrices.SUITE },
        { key: "BASE_PRICE_FAMILY", value: basePrices.FAMILY },
        { key: "MAINTENANCE_MODE", value: maintenanceMode },
      ];

      await updateGlobalSettings(settings);

      alert("Configuración guardada correctamente");
    } catch (err) {
      console.error("Error guardando configuración:", err);
      alert("❌ Error al guardar la configuración.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 mx-auto mb-3"></div>
        Cargando configuraciones...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Configuración Global</h1>
      <p className="text-gray-600 mb-6">
        Ajusta los parámetros generales del sistema y los valores por defecto.
      </p>

      {/* Precios base de habitaciones */}
      <div className="bg-white p-4 rounded shadow space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          Precios base por tipo de habitación
        </h2>
        {Object.entries(basePrices).map(([type, price]) => (
          <div key={type} className="flex items-center gap-4">
            <label className="w-24 font-medium">{type}</label>
            <input
              type="number"
              className="border p-2 rounded w-32"
              value={price}
              min={0}
              onChange={(e) =>
                handlePriceChange(type, Number(e.target.value))
              }
            />
          </div>
        ))}
      </div>

      {/* Modo mantenimiento */}
      <div className="bg-white p-4 rounded shadow flex items-center justify-between">
        <span className="font-medium">Modo mantenimiento</span>
        <input
          type="checkbox"
          checked={maintenanceMode}
          onChange={() => setMaintenanceMode(!maintenanceMode)}
          className="w-6 h-6"
        />
      </div>

      {/* Guardar cambios */}
      <div>
        <button
          onClick={handleSaveSettings}
          disabled={saving}
          className={`px-4 py-2 rounded text-white ${
            saving ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </div>
    </div>
  );
}
