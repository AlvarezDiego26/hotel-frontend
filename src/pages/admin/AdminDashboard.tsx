import React, { useEffect, useState } from "react";
import { fetchAdminOverview } from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
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

export default function AdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchAdminOverview();
        setData(result);
      } catch (err) {
        console.error(err);
        setError("Error al cargar estadísticas");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-8 text-center">Cargando estadísticas...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Hoteles</p>
              <p className="text-3xl font-bold text-blue-600">{data.hotels}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="text-2xl">🏨</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Reservas Totales</p>
              <p className="text-3xl font-bold text-green-600">{data.reservations}</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <span className="text-2xl">📅</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Administradores</p>
              <p className="text-3xl font-bold text-purple-600">{data.admins}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Actividad */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Actividad de Reservas</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.activity}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Últimos Hoteles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Últimos Hoteles Agregados</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-sm font-medium text-gray-500">Nombre</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Ubicación</th>
                  <th className="pb-3 text-sm font-medium text-gray-500">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.latestHotels.map((hotel) => (
                  <tr key={hotel.id} className="group hover:bg-gray-50 transition">
                    <td className="py-3 text-sm font-medium text-gray-800">{hotel.name}</td>
                    <td className="py-3 text-sm text-gray-600">
                      {hotel.city}, {hotel.country}
                    </td>
                    <td className="py-3 text-sm text-gray-500">
                      {new Date(hotel.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.latestHotels.length === 0 && (
              <p className="text-center text-gray-500 py-4">No hay hoteles recientes</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
