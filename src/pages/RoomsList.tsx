import React, { useEffect, useState } from 'react'
import { fetchRooms, createReservation } from '../api'
import Modal from '../components/Modal'

export default function RoomsList() {
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRoom, setSelectedRoom] = useState<any>(null)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchRooms()
        setRooms(res.data || res)
      } catch (err: any) {
        setError(err?.error || JSON.stringify(err))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const handleReserve = async () => {
    if (!selectedRoom) return
    if (!startDate || !endDate) {
      alert('Por favor selecciona las fechas de inicio y fin.')
      return
    }

    try {
      await createReservation(selectedRoom.id, startDate, endDate)
      alert('Reserva creada correctamente')
      setSelectedRoom(null)
      setStartDate('')
      setEndDate('')
    } catch (err: any) {
      alert(`Error: ${err?.error || JSON.stringify(err)}`)
    }
  }

  if (loading) return <p className='p-6 text-gray-500'>Cargando habitaciones...</p>
  if (error) return <p className='text-red-600 p-6'>{error}</p>

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-2xl font-bold mb-4'>Habitaciones disponibles</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {rooms.map(r => (
            <div key={r.id} className='bg-white p-4 rounded shadow'>
              <h2 className='font-semibold'>Habitación {r.number}</h2>
              <p className='text-sm'>Tipo: {r.type}</p>
              <p className='text-sm'>Precio: ${r.price}</p>
              <p className='text-sm'>Capacidad: {r.capacity}</p>
              <p className='text-xs text-gray-600 mt-1'>
                Hotel: {r.hotel?.name}
              </p>
              <button
                className='mt-3 bg-blue-600 text-white px-3 py-1 rounded'
                onClick={() => setSelectedRoom(r)}
              >
                Reservar
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para confirmar reserva */}
      <Modal
        open={!!selectedRoom}
        onClose={() => setSelectedRoom(null)}
        title={`Reservar habitación ${selectedRoom?.number}`}
      >
        <div className='flex flex-col gap-3'>
          <label>
            Fecha de inicio:
            <input
              type='date'
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className='w-full border p-2 rounded'
            />
          </label>
          <label>
            Fecha de fin:
            <input
              type='date'
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className='w-full border p-2 rounded'
            />
          </label>

          <div className='flex justify-end gap-3 mt-4'>
            <button
              onClick={() => setSelectedRoom(null)}
              className='px-4 py-2 rounded bg-gray-200 hover:bg-gray-300'
            >
              Cancelar
            </button>
            <button
              onClick={handleReserve}
              className='px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700'
            >
              Confirmar reserva
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
