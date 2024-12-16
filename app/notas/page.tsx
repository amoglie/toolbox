import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notas | Gestor de Tareas Avanzado',
}

export default function NotesPage() {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-6">Notas</h2>
      <p>Aquí irá el contenido de la página de notas.</p>
    </div>
  )
}

