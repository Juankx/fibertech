"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, AlertTriangle, DollarSign, TrendingUp } from "lucide-react"
import { CuadrillaInfo } from "@/components/tecnico/CuadrillaInfo"
import { useToast } from "@/hooks/use-toast"

interface CuadrillaData {
  cuadrilla: {
    id: number
    nombre: string
    tecnicoTitular: {
      id: number
      name: string
      email: string
    }
    tecnicoAuxiliar: {
      id: number
      name: string
      email: string
    } | null
    esTitular: boolean
  }
}

interface Actividad {
  id: number
  fecha: string
  numeroOrden: string
  tipoActividad: string
  datosCliente: any
  novedades: string | null
}

interface DashboardData {
  cuadrilla: CuadrillaData
  actividadesAyer: Actividad[]
  totalActividadesMes: number
  incidenciasPendientes: number
  adelantosPendientes: number
}

export default function TecnicoDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener cuadrilla
        const cuadrillaRes = await fetch("/api/tecnico/cuadrilla")
        if (!cuadrillaRes.ok) {
          const errorData = await cuadrillaRes.json().catch(() => ({}))
          // Si no hay cuadrilla asignada, continuar sin error
          if (cuadrillaRes.status === 404) {
            console.warn("No hay cuadrilla asignada")
            // Continuar sin cuadrilla para permitir que el dashboard se muestre
          } else {
            throw new Error(errorData.error || "Error al obtener cuadrilla")
          }
        }
        const cuadrillaData = cuadrillaRes.ok ? await cuadrillaRes.json() : null

        // Obtener fecha de ayer
        const ayer = new Date()
        ayer.setDate(ayer.getDate() - 1)
        const fechaAyer = ayer.toISOString().split('T')[0]

        // Obtener actividades de ayer
        const actividadesRes = await fetch(`/api/tecnico/actividades?fecha=${fechaAyer}`)
        const actividadesAyer = actividadesRes.ok ? await actividadesRes.json() : []

        // Obtener total de actividades del mes
        const inicioMes = new Date()
        inicioMes.setDate(1)
        inicioMes.setHours(0, 0, 0, 0)
        const actividadesMesRes = await fetch(`/api/tecnico/actividades`)
        const todasActividades = actividadesMesRes.ok ? await actividadesMesRes.json() : []
        const actividadesMes = todasActividades.filter((a: Actividad) => {
          const fechaAct = new Date(a.fecha)
          return fechaAct >= inicioMes
        })

        // Obtener incidencias
        const incidenciasRes = await fetch("/api/tecnico/incidencias")
        const incidencias = incidenciasRes.ok ? await incidenciasRes.json() : []
        const incidenciasPendientes = incidencias.filter((i: any) => {
          const fechaInc = new Date(i.fecha)
          const hoy = new Date()
          return fechaInc.toDateString() === hoy.toDateString()
        }).length

        // Obtener adelantos
        const adelantosRes = await fetch("/api/tecnico/adelantos")
        const adelantos = adelantosRes.ok ? await adelantosRes.json() : []
        const adelantosPendientes = adelantos.filter((a: any) => a.estado === "PENDIENTE").length

        setData({
          cuadrilla: cuadrillaData || { cuadrilla: null },
          actividadesAyer,
          totalActividadesMes: actividadesMes.length,
          incidenciasPendientes,
          adelantosPendientes
        })
      } catch (error: any) {
        console.error("Error al cargar datos:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del dashboard",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [toast])

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <div className="text-center text-destructive">Error al cargar los datos</div>
      </div>
    )
  }

  const ayer = new Date()
  ayer.setDate(ayer.getDate() - 1)
  const fechaAyerFormatted = ayer.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  })

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">
          Bienvenido, {data.cuadrilla?.cuadrilla?.tecnicoTitular?.name || "Técnico"}
        </h1>
        <p className="text-muted-foreground">
          Panel de control del técnico - Actividades del día anterior
        </p>
        {!data.cuadrilla?.cuadrilla && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ No tienes una cuadrilla asignada. Contacta al administrador para que te asigne a una cuadrilla.
            </p>
          </div>
        )}
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividades Ayer</CardTitle>
            <ClipboardList className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.actividadesAyer.length}</div>
            <p className="text-xs text-muted-foreground">
              {fechaAyerFormatted}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actividades del Mes</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalActividadesMes}</div>
            <p className="text-xs text-muted-foreground">
              Total registradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Incidencias</CardTitle>
            <AlertTriangle className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.incidenciasPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Hoy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Adelantos</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.adelantosPendientes}</div>
            <p className="text-xs text-muted-foreground">
              Pendientes
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {data.cuadrilla?.cuadrilla ? (
          <CuadrillaInfo cuadrilla={data.cuadrilla.cuadrilla} />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Mi Cuadrilla</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                No hay cuadrilla asignada. Contacta al administrador.
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Actividades del Día Anterior</CardTitle>
            <CardDescription>
              {fechaAyerFormatted}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {data.actividadesAyer.length > 0 ? (
              <div className="space-y-4">
                {data.actividadesAyer.map((actividad) => (
                  <div
                    key={actividad.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Orden: {actividad.numeroOrden}</p>
                      <p className="text-sm text-muted-foreground">
                        {actividad.tipoActividad}
                      </p>
                      {actividad.novedades && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {actividad.novedades}
                        </p>
                      )}
                    </div>
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay actividades registradas para el día anterior
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

