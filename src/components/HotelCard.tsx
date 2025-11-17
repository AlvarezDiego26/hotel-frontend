import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star } from 'lucide-react';

type HotelCardProps = {
  hotel: any;
};

export default function HotelCard({ hotel }: HotelCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/hotels/${hotel.id}`)}
      className="cursor-pointer bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
    >
      <img
        src={`https://picsum.photos/seed/hotel${hotel.id}/400/200`}
        alt={hotel.name}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-800">{hotel.name}</h2>
        <div className="flex items-center gap-1 text-yellow-500 text-sm mb-1">
          {[...Array(hotel.stars || 3)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
        </div>
        <p className="text-gray-600 text-sm">{hotel.city}, {hotel.country}</p>
        <p className="text-gray-500 text-sm mt-1">{hotel.description}</p>
        <p className="mt-2 text-blue-700 font-semibold">Desde ${hotel.rooms?.[0]?.price || 50} / noche</p>
      </div>
    </div>
  );
}
