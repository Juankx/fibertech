"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HistorialList } from "@/components/tecnico/HistorialList"
import { History, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface DiaTrabajado {
  fecha: string
  actividades: Array<{
    id: number
    numeroOrden: string
    tipoActividad: string
  }>
  fotos: Array<{
    id: number
    tipo: string
    ruta: string
    fecha: string
  }>
}

export default function HistorialPage() {
  const [diasTrabajados, setDiasTrabajados] = useState<DiaTrabajado[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchHistorial = async () => {
    try {
      const res = await fetch("/api/tecnico/historial")
      if (res.ok) {
        const data = await res.json()
        setDiasTrabajados(data.diasTrabajados || [])
      } else {
        throw new Error("Error al cargar el historial")
      }
    } catch (error: any) {
      console.error("Error al cargar historial:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el historial",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHistorial()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Historial de Días Trabajados</h1>
        <p className="text-muted-foreground">
          Revisa tus días trabajados y registra las fotos de uniforme y vehículo
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <CardTitle>Días Trabajados</CardTitle>
          </div>
          <CardDescription>
            Total: {diasTrabajados.length} día(s) trabajado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <HistorialList dias={diasTrabajados} onFotoUploaded={fetchHistorial} />
        </CardContent>
      </Card>
    </div>
  )
}

