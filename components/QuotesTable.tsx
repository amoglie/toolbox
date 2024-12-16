'use client'

import { useEffect, useState } from 'react'
import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from "@/lib/utils"

interface ExchangeRate {
  exchange: string
  buy: number
  sell: number
  spread: number
  logo: string
}

const EXCHANGE_LOGOS = {
  belo: 'https://usdthoy.com.ar/images/belo.svg',
  lemoncash: 'https://usdthoy.com.ar/images/lemoncash.svg',
  letsbit: 'https://usdthoy.com.ar/images/letsbit.svg',
  ripio: 'https://usdthoy.com.ar/images/ripio.svg',
  bybit: 'https://usdthoy.com.ar/images/bybit.svg',
  buenbit: 'https://usdthoy.com.ar/images/buenbit.svg',
  fiwind: 'https://usdthoy.com.ar/images/fiwind.svg',
  tiendacrypto: 'https://usdthoy.com.ar/images/tiendacrypto.svg',
}

export function QuotesTable() {
  const [rates, setRates] = useState<ExchangeRate[]>([])
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState(true)

  const fetchRates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('https://criptoya.com/api/USDT/ARS/0.1')
      const data = await response.json()
      
      const exchanges = Object.keys(EXCHANGE_LOGOS)
      const formattedRates = exchanges.map(exchange => ({
        exchange,
        buy: data[exchange]?.ask || 0,
        sell: data[exchange]?.bid || 0,
        spread: (data[exchange]?.ask || 0) - (data[exchange]?.bid || 0),
        logo: EXCHANGE_LOGOS[exchange as keyof typeof EXCHANGE_LOGOS]
      }))

      setRates(formattedRates)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Error fetching rates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 30000)
    return () => clearInterval(interval)
  }, [])

  const getBestBuyRate = () => Math.min(...rates.map(rate => rate.buy))
  const getBestSellRate = () => Math.max(...rates.map(rate => rate.sell))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            Cotizaciones <span className="text-[#95FF8D]">USDT</span>
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <span>Actualizado {lastUpdate.toLocaleTimeString()}</span>
            {isLoading && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <RefreshCw className="h-3 w-3" />
              </motion.div>
            )}
          </div>
        </div>
        <button
          onClick={fetchRates}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md hover:bg-accent"
        >
          <RefreshCw className="h-4 w-4" />
          Actualizar
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-6">
        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#95FF8D]/20 flex items-center justify-center">
            <TrendingDown className="h-4 w-4 text-[#95FF8D]" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Mejor para comprar</div>
            <div className="font-medium">
              {formatCurrency(getBestBuyRate())} ({rates.find(r => r.buy === getBestBuyRate())?.exchange})
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#95FF8D]/20 flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-[#95FF8D]" />
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Mejor para vender</div>
            <div className="font-medium">
              {formatCurrency(getBestSellRate())} ({rates.find(r => r.sell === getBestSellRate())?.exchange})
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        <div className="grid">
          {rates.map((rate, index) => (
            <div
              key={rate.exchange}
              className={cn(
                "grid grid-cols-[auto,1fr,1fr] md:grid-cols-[auto,1fr,1fr,1fr] items-center gap-4 p-4",
                index !== rates.length - 1 && "border-b"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-accent flex items-center justify-center">
                  <img
                    src={rate.logo}
                    alt={`${rate.exchange} logo`}
                    className="h-6 w-6"
                  />
                </div>
                <div>
                  <div className="font-medium capitalize">{rate.exchange}</div>
                  <div className="text-xs text-muted-foreground">USDT > ARS</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Compra</div>
                <div className={cn(
                  "font-medium",
                  rate.buy === getBestBuyRate() && "text-[#95FF8D]"
                )}>
                  {formatCurrency(rate.buy)}
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm text-muted-foreground">Venta</div>
                <div className={cn(
                  "font-medium",
                  rate.sell === getBestSellRate() && "text-[#95FF8D]"
                )}>
                  {formatCurrency(rate.sell)}
                </div>
              </div>

              <div className="hidden md:block text-right">
                <div className="text-sm text-muted-foreground">Spread</div>
                <div className="font-medium">{formatCurrency(rate.spread)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

