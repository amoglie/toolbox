import { Metadata } from 'next'
import { QuotesTable } from '@/components/QuotesTable'

export const metadata: Metadata = {
  title: 'Cotizaciones | Gestor de Tareas Avanzado',
}

export default function QuotesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <QuotesTable />
      </div>
    </div>
  )
}

