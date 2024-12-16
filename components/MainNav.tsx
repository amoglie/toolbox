'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Tareas
      </Link>
      <Link
        href="/cotizaciones"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/cotizaciones" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Cotizaciones
      </Link>
      <Link
        href="/calendario"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/calendario" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Calendario
      </Link>
      <Link
        href="/notas"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/notas" ? "text-primary" : "text-muted-foreground"
        )}
      >
        Notas
      </Link>
    </nav>
  )
}

