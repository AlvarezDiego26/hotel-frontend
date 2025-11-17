# Hotel Frontend (Vite + React + TypeScript)

This is a minimal frontend connected to your backend.

## Quick start

1. Install
```bash
npm install
```

2. Run dev
```bash
npm run dev
```

The app expects the backend API at `http://localhost:3000/api`. You can change it by setting environment variable `.env`:

```
VITE_API_URL=http://localhost:3000/api
```

## Pages
- `/register` — register new user (calls POST /api/auth/register)
- `/login` — login (POST /api/auth/login)
- `/` — dashboard (lists hotels GET /api/hotels?page=1&limit=10)

## Notes
- Stores JWT in localStorage for demo only.
- Tailwind CSS included.
