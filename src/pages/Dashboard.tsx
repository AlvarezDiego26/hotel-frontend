import React, { useEffect, useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import HotelCard from '../components/HotelCard';

export default function Dashboard() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (filters: { district?: string; stars?: number; type?: string }) => {
    try {
      let query = `?page=1&limit=20`;
      if (filters.district) query += `&district=${filters.district}`;
      if (filters.stars) query += `&stars=${filters.stars}`;
      if (filters.type) query += `&type=${filters.type}`;

      const url = `${import.meta.env.VITE_API_URL}/hotels${query}`;
      console.log(' URL llamada:', url);
      const res = await fetch(url);
      const data = await res.json();
      console.log('Datos recibidos:', data);

      // Normalizar respuesta
      const parsed = Array.isArray(data) ? data : data.data || data.items || [];
      setHotels(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err?.error || 'Error al cargar los hoteles');
    }
  };

  useEffect(() => {
    handleSearch({});
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">Explora Hoteles</h1>
        {error && <div className="text-red-600 mb-2">{error}</div>}

        <SearchBar onSearch={handleSearch} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map(h => (
            <div key={h.id}>
              <HotelCard hotel={h} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
