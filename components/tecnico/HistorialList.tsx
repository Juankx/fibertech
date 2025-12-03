"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ClipboardList, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { CameraCapture } from "./CameraCapture"

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

interface HistorialListProps {
  dias: DiaTrabajado[]
  onFotoUploaded: () => void
}

export function HistorialList({ dias, onFotoUploaded }: HistorialListProps) {
  const [selectedDia, setSelectedDia] = useState<string | null>(null)
  const [showUniforme, setShowUniforme] = useState(false)
  const [showVehiculo, setShowVehiculo] = useState(false)

  const handleFotoUpload = async (tipo: "UNIFORME" | "VEHICULO", file: File) => {
    try {
      const formData = new FormData()
      formData.append("tipo", tipo)
      formData.append("file", file)

      const response = await fetch("/api/tecnico/fotos", {
        method: "POST",
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al subir la foto")
      }

      if (tipo === "UNIFORME") {
        setShowUniforme(false)
      } else {
        setShowVehiculo(false)
      }

      onFotoUploaded()
    } catch (error: any) {
      throw error
    }
  }

  const dia = dias.find(d => d.fecha === selectedDia)

  const tieneUniforme = dia?.fotos.some(f => f.tipo === "UNIFORME")
  const tieneVehiculo = dia?.fotos.some(f => f.tipo === "VEHICULO")

  return (
    <div className="space-y-4">
      {dias.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No hay días trabajados registrados
          </CardContent>
        </Card>
      ) : (
        dias.map((dia) => (
          <Card key={dia.fecha}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <CardTitle>
                    {new Date(dia.fecha).toLocaleDateString("es-ES", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDia(selectedDia === dia.fecha ? null : dia.fecha)}
                >
                  {selectedDia === dia.fecha ? "Ocultar" : "Ver Detalles"}
                </Button>
              </div>
              <CardDescription>
                {dia.actividades.length} actividad(es) registrada(s)
              </CardDescription>
            </CardHeader>
            {selectedDia === dia.fecha && (
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <ClipboardList className="h-4 w-4" />
                    Actividades Realizadas
                  </h4>
                  {dia.actividades.length > 0 ? (
                    <div className="space-y-2">
                      {dia.actividades.map((actividad) => (
                        <div key={actividad.id} className="p-3 border rounded-lg">
                          <p className="font-medium">Orden: {actividad.numeroOrden}</p>
                          <p className="text-sm text-muted-foreground">
                            {actividad.tipoActividad}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No hay actividades registradas</p>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Fotos del Día
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {!tieneUniforme && !showUniforme && (
                      <Button
                        variant="outline"
                        onClick={() => setShowUniforme(true)}
                        className="h-32"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Tomar Foto del Uniforme
                      </Button>
                    )}
                    {showUniforme && (
                      <CameraCapture
                        tipo="UNIFORME"
                        label="Uniforme"
                        onCapture={(file) => handleFotoUpload("UNIFORME", file)}
                        onCancel={() => setShowUniforme(false)}
                        required
                      />
                    )}
                    {tieneUniforme && !showUniforme && (
                      <div className="p-4 border rounded-lg bg-green-50">
                        <p className="text-sm font-medium text-green-700">
                          ✓ Foto de uniforme registrada
                        </p>
                      </div>
                    )}

                    {!tieneVehiculo && !showVehiculo && (
                      <Button
                        variant="outline"
                        onClick={() => setShowVehiculo(true)}
                        className="h-32"
                      >
                        <Camera className="mr-2 h-4 w-4" />
                        Tomar Foto del Vehículo
                      </Button>
                    )}
                    {showVehiculo && (
                      <CameraCapture
                        tipo="VEHICULO"
                        label="Vehículo"
                        onCapture={(file) => handleFotoUpload("VEHICULO", file)}
                        onCancel={() => setShowVehiculo(false)}
                        required
                      />
                    )}
                    {tieneVehiculo && !showVehiculo && (
                      <div className="p-4 border rounded-lg bg-green-50">
                        <p className="text-sm font-medium text-green-700">
                          ✓ Foto de vehículo registrada
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        ))
      )}
    </div>
  )
}

