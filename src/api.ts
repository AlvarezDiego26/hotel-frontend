const BASE = import.meta.env.VITE_API_URL;

// Wrapper genérico para requests
async function request(url: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw data;
  return data;
}

// === AUTH ===
export function register(payload: any) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(email: string, password: string) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then((data) => {
    localStorage.setItem("token", data.token);
    return data;
  });
}

// === HOTELS ===
export interface HotelPayload {
  name: string;
  address: string;
  city: string;
  country: string;
  district: string;
  stars: number;
  description: string;
  latitude: number;
  longitude: number;
}

export async function fetchHotels(page = 1, limit = 10) {
  const token = localStorage.getItem("token");
  const result = await request(
    `/hotels?page=${page}&limit=${limit}&ts=${Date.now()}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.hotels)) return result.hotels;
  if (Array.isArray(result.items)) return result.items;
  if (Array.isArray(result)) return result;
  return [];
}

export function createHotel(payload: HotelPayload) {
  const token = localStorage.getItem("token");
  return request("/hotels", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function updateHotel(id: number, payload: HotelPayload) {
  const token = localStorage.getItem("token");
  return request(`/hotels/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteHotel(id: number) {
  const token = localStorage.getItem("token");
  return request(`/hotels/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// === ROOMS ===
export function fetchRooms(hotelId?: number, page = 1, limit = 10) {
  const token = localStorage.getItem("token");
  let query = `?page=${page}&limit=${limit}&ts=${Date.now()}`;
  if (hotelId) query += `&hotelId=${hotelId}`;

  return request(`/rooms${query}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createRoom(payload: {
  hotelId: number;
  number: string;
  type: string;
  price: number;
  capacity?: number;
  status?: string;
}) {
  const token = localStorage.getItem("token");
  return request("/rooms", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function updateRoom(
  id: number,
  payload: {
    number?: string;
    type?: string;
    price?: number;
    capacity?: number;
    status?: string;
  }
) {
  const token = localStorage.getItem("token");
  return request(`/rooms/${id}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
  });
}

export function deleteRoom(id: number) {
  const token = localStorage.getItem("token");
  return request(`/rooms/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// === ROOM AVAILABILITY ===
export function fetchRoomAvailability(roomId: number) {
  const token = localStorage.getItem("token");
  return request(`/rooms/${roomId}/availability?ts=${Date.now()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// === RESERVATIONS ===
export function fetchReservations() {
  const token = localStorage.getItem("token");
  return request("/reservations", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createReservation(
  roomId: string,
  startDate: string,
  endDate: string
) {
  const token = localStorage.getItem("token");
  return request("/reservations", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ roomId, startDate, endDate }),
  });
}

// === PAYMENTS ===
export function confirmPayment(
  reservationId: number,
  method: "CARD" | "PAYPAL" | "CULQI" | "TRANSFER",
  amount?: number,
  extraData: { cardHolder?: string; cardNumber?: string } = {}
) {
  const token = localStorage.getItem("token");
  return request("/payments", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      reservationId,
      amount,
      method,
      ...extraData,
    }),
  });
}

// === CANCEL RESERVATION ===
export function cancelReservation(reservationId: number, reason?: string) {
  const token = localStorage.getItem("token");
  return request("/reservations/cancel", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reservationId, reason }),
  });
}

export function fetchRoomById(roomId: number) {
  const token = localStorage.getItem("token");
  return request(`/rooms/${roomId}?ts=${Date.now()}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

// === FETCH HOTEL BY ID (ARREGLADO) ===
export const fetchHotelById = async (id: number) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${BASE}/hotels/${id}?ts=${Date.now()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Error al obtener el hotel");
  return res.json();
};

// === ADMIN ===
export function fetchRefundRequests() {
  const token = localStorage.getItem("token");
  return request("/refunds", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function reviewRefundRequest(refundId: number, approve: boolean) {
  const token = localStorage.getItem("token");
  return request(`/refunds/${refundId}/review`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ approve }),
  });
}

export function fetchUsers() {
  const token = localStorage.getItem("token");
  return request("/users", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateUserRole(userId: number, role: string) {
  const token = localStorage.getItem("token");
  return request(`/users/${userId}/role`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ role }),
  });
}

export function toggleUserStatus(userId: number, isActive: boolean) {
  const token = localStorage.getItem("token");
  return request("/users", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ userId, isActive }),
  });
}

export function fetchGlobalSettings() {
  const token = localStorage.getItem("token");
  return request("/settings", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateGlobalSettings(settings: {
  key: string;
  value: string | number | boolean;
}[]) {
  const token = localStorage.getItem("token");
  return request("/settings", {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(settings),
  });
}

export function fetchAdminOverview() {
  const token = localStorage.getItem("token");
  return request("/admin/overview", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
}
