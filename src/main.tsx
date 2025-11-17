import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./styles.css";

import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

// Layouts
import AppLayout from "./components/AppLayout";
import AdminLayout from "./components/AdminLayout";
import SuperLayout from "./components/SuperLayout"; 

// Páginas de usuario
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reservations from "./pages/Reservations";
import BookRoom from "./pages/BookRoom";
import HotelDetail from "./pages/HotelDetail";

// Páginas de admin
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHotels from "./pages/admin/AdminHotels";
import AdminRooms from "./pages/admin/AdminRooms";
import AdminReservations from "./pages/admin/AdminReservations";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRefunds from "./pages/admin/AdminRefunds";

// Páginas de superadmin
import SuperDashboard from "./pages/super/SuperDashboard";
import SuperAdmins from "./pages/super/SuperAdmins";
import SuperSettings from "./pages/super/SuperSettings";
import SuperHotels from "./pages/super/SuperHotels";
import SuperReservations from "./pages/super/SuperReservations";
import SuperRooms from "./pages/super/SuperRooms"; 

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* PÁGINAS PÚBLICAS */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="register" element={<Register />} />
            <Route path="login" element={<Login />} />
            <Route path="hotels/:id" element={<HotelDetail />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="rooms/:id/book" element={<BookRoom />} />
          </Route>

          {/* PANEL ADMIN (solo ADMIN y SUPERADMIN) */}
          <Route element={<RequireAuth allowedRoles={["ADMIN", "SUPERADMIN"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="hotels" element={<AdminHotels />} />
              <Route path="rooms" element={<AdminRooms />} />
              <Route path="reservations" element={<AdminReservations />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="refunds" element={<AdminRefunds />} />
            </Route>
          </Route>

          {/* PANEL SUPERADMIN (solo SUPERADMIN) */}
          <Route element={<RequireAuth allowedRoles={["SUPERADMIN"]} />}>
            <Route path="/super" element={<SuperLayout />}>
              <Route path="dashboard" element={<SuperDashboard />} />
              <Route path="admins" element={<SuperAdmins />} />
              <Route path="hotels" element={<SuperHotels />} />
              <Route path="rooms" element={<SuperRooms />} /> {/* ✅ NUEVA RUTA */}
              <Route path="reservations" element={<SuperReservations />} />
              <Route path="settings" element={<SuperSettings />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
