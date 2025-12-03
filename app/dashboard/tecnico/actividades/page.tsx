"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ActividadForm } from "@/components/tecnico/ActividadForm"
import { ClipboardList, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Actividad {
  id: number
  fecha: string
  numeroOrden: string
  tipoActividad: string
  datosCliente: any
  novedades: string | null
  cuadrilla: {
    id: number
    nombre: string
  } | null
}

export default function ActividadesPage() {
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [cuadrilla, setCuadrilla] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const { toast } = useToast()

  const fetchActividades = async () => {
    try {
      // Obtener cuadrilla
      const cuadrillaRes = await fetch("/api/tecnico/cuadrilla")
      if (cuadrillaRes.ok) {
        const cuadrillaData = await cuadrillaRes.json()
        setCuadrilla(cuadrillaData.cuadrilla)
      } else if (cuadrillaRes.status !== 404) {
        // Solo mostrar error si no es 404 (no hay cuadrilla asignada)
        console.error("Error al obtener cuadrilla:", cuadrillaRes.status)
      }

      // Obtener actividades
      const res = await fetch("/api/tecnico/actividades")
      if (res.ok) {
        const data = await res.json()
        setActividades(data)
      }
    } catch (error) {
      console.error("Error al cargar actividades:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchActividades()
  }, [])

  const handleSuccess = () => {
    setRefreshing(true)
    fetchActividades()
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  // Agrupar actividades por fecha
  const actividadesPorFecha = actividades.reduce((acc: any, actividad) => {
    const fechaKey = new Date(actividad.fecha).toLocaleDateString("es-ES")
    if (!acc[fechaKey]) {
      acc[fechaKey] = []
    }
    acc[fechaKey].push(actividad)
    return acc
  }, {})

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Registro de Actividades</h1>
        <p className="text-muted-foreground">
          Registra las actividades y proyectos realizados el día anterior
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <ActividadForm
          cuadrillaId={cuadrilla?.id}
          onSuccess={handleSuccess}
        />

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <CardTitle>Actividades Registradas</CardTitle>
            </div>
            <CardDescription>
              Historial de actividades registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {actividades.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No hay actividades registradas aún
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(actividadesPorFecha).map(([fecha, actividadesFecha]: [string, any]) => (
                  <div key={fecha}>
                    <h3 className="font-semibold mb-3 text-primary">{fecha}</h3>
                    <div className="space-y-3">
                      {actividadesFecha.map((actividad: Actividad) => (
                        <div
                          key={actividad.id}
                          className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="h-4 w-4 text-primary" />
                              <span className="font-medium">Orden: {actividad.numeroOrden}</span>
                            </div>
                            {actividad.cuadrilla && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                                {actividad.cuadrilla.nombre}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            Tipo: {actividad.tipoActividad}
                          </p>
                          {actividad.datosCliente && (
                            <p className="text-sm">
                              Cliente: <span className="font-medium">{actividad.datosCliente.nombre}</span>
                            </p>
                          )}
                          {actividad.novedades && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {actividad.novedades}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

