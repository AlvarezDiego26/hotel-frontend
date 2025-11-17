import React, { useState } from "react";

interface SearchBarProps {
  onSearch: (filters: { district?: string; stars?: number }) => void;
}

const districts = [
  "Cayma", "Cerro Colorado", "Jacobo Hunter", "Yanahuara", "Sachaca",
  "Mariano Melgar", "Paucarpata", "Selva Alegre", "José Luis Bustamante y Rivero",
  "Sabandía", "Tiabaya", "Umacollo", "Socabaya", "Characato", "Mollebaya",
  "Pocsi", "Hunter", "Alto Selva Alegre", "Chiguata", "Miraflores",
  "Yura", "Chachas", "Polobaya", "Vitor", "Cocabamba", "Pampacolca", "Tarucani",
  "La Joya", "Uchumayo"
];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [district, setDistrict] = useState("");
  const [stars, setStars] = useState<number | "">("");

  const handleSearch = () => {
    onSearch({ district: district || undefined, stars: stars || undefined });
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-gray-100 rounded-md shadow-md mb-6">
      <select
        value={district}
        onChange={e => setDistrict(e.target.value)}
        className="border p-2 rounded"
      >
        <option value="">Todos los distritos</option>
        {districts.map(d => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <select
        value={stars}
        onChange={e => setStars(Number(e.target.value))}
        className="border p-2 rounded"
      >
        <option value="">Todas las estrellas</option>
        {[1, 2, 3, 4, 5].map(s => (
          <option key={s} value={s}>{s} ⭐</option>
        ))}
      </select>

      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
      >
        Buscar
      </button>
    </div>
  );
};
