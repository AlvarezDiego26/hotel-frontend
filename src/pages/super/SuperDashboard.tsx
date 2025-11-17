// src/pages/super/SuperDashboard.tsx
import React, { useEffect, useState } from "react";
import { fetchAdminOverview } from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Building2, Users, CalendarDays, Loader2 } from "lucide-react";

interface OverviewStats {
  hotels: number;
  reservations: number;
  admins: number;
  activity: { label: string; count: number }[];
  latestHotels: {
    id: number;
    name: string;
    city: string;
    country: string;
    createdAt: string;
  }[];
}

export default function SuperDashboard() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await fetchAdminOverview();
        setStats(data);
      } catch (err: any) {
        console.error("❌ Error cargando estadísticas:", err);
        setError("No se pudieron cargar las estadísticas");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-600">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-medium bg-red-50 rounded-xl">
        ❌ {error}
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Panel Global</h1>
        <p className="text-gray-500 mt-1">
          Bienvenido al panel de administración global del sistema.
        </p>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Hoteles activos"
          value={stats.hotels}
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
          color="from-blue-50 to-blue-100"
        />
        <StatCard
          title="Reservas totales"
          value={stats.reservations}
          icon={<CalendarDays className="w-6 h-6 text-green-600" />}
          color="from-green-50 to-green-100"
        />
        <StatCard
          title="Administradores"
          value={stats.admins}
          icon={<Users className="w-6 h-6 text-yellow-600" />}
          color="from-yellow-50 to-yellow-100"
        />
      </div>

      {/* Gráfico de actividad */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Actividad mensual
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.activity}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="label" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                background: "#fff",
                borderRadius: "0.5rem",
                borderColor: "#e5e7eb",
              }}
            />
            <Bar dataKey="count" name="Reservas" fill="#3b82f6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabla de últimos hoteles */}
      <div className="bg-white rounded-2xl shadow p-6 border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Últimos hoteles registrados
        </h2>

        {stats.latestHotels.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay hoteles registrados aún.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-700 text-sm">
                  <th className="p-3 text-left font-medium">Nombre</th>
                  <th className="p-3 text-left font-medium">Ciudad</th>
                  <th className="p-3 text-left font-medium">País</th>
                  <th className="p-3 text-left font-medium">Fecha de registro</th>
                </tr>
              </thead>
              <tbody>
                {stats.latestHotels.map((hotel) => (
                  <tr
                    key={hotel.id}
                    className="border-t hover:bg-gray-50 text-gray-700 text-sm transition"
                  >
                    <td className="p-3">{hotel.name}</td>
                    <td className="p-3">{hotel.city}</td>
                    <td className="p-3">{hotel.country}</td>
                    <td className="p-3">
                      {new Date(hotel.createdAt).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// 🔹 Subcomponente para tarjetas de estadísticas
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div
      className={`bg-gradient-to-br ${color} p-5 rounded-2xl shadow hover:shadow-md transition flex items-center gap-4`}
    >
      <div className="bg-white p-3 rounded-full shadow-sm">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
    </div>
  );
}
