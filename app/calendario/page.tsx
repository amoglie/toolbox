import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendario | Gestor de Tareas Avanzado',
}

export default function CalendarPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Calendario</h2>
      <p>Aquí irá el contenido de la página de calendario.</p>
    </div>
  )
}

