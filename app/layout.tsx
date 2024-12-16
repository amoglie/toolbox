import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { MainNav } from '@/components/MainNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gestor de Tareas Avanzado',
  description: 'Gestiona tus tareas, cotizaciones, calendario y notas de manera eficiente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-background text-foreground`}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <h1 className="text-2xl font-bold">Gestor de Tareas</h1>
              <MainNav />
            </div>
          </header>
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}

