"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CameraCapture } from "@/components/tecnico/CameraCapture"
import { AlertTriangle, Camera, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Incidencia {
  id: number
  tipo: "PERSONAL" | "VEHICULO"
  descripcion: string
  fecha: string
  fotoPath: string | null
  createdAt: string
}

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [formData, setFormData] = useState({
    tipo: "" as "PERSONAL" | "VEHICULO" | "",
    descripcion: "",
    fecha: new Date().toISOString().split('T')[0]
  })
  const [fotoFile, setFotoFile] = useState<File | null>(null)
  const { toast } = useToast()

  const fetchIncidencias = async () => {
    try {
      const res = await fetch("/api/tecnico/incidencias")
      if (res.ok) {
        const data = await res.json()
        setIncidencias(data)
      }
    } catch (error) {
      console.error("Error al cargar incidencias:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncidencias()
  }, [])

  const handleFotoCapture = (file: File) => {
    setFotoFile(file)
    setShowCamera(false)
    toast({
      title: "Foto capturada",
      description: "La foto se ha capturado. Puedes enviar el reporte.",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.tipo || !formData.descripcion || !formData.fecha) {
      toast({
        title: "Error",
        description: "Todos los campos requeridos deben estar completos.",
        variant: "destructive"
      })
      return
    }

    try {
      // Si hay foto, subirla primero
      let fotoPath = null
      if (fotoFile) {
        const fotoFormData = new FormData()
        // Para incidencias usamos HERRAMIENTA como tipo temporal
        // En el futuro se puede agregar un tipo específico para incidencias
        fotoFormData.append("tipo", "HERRAMIENTA")
        fotoFormData.append("file", fotoFile)

        const fotoRes = await fetch("/api/tecnico/fotos", {
          method: "POST",
          body: fotoFormData
        })

        if (fotoRes.ok) {
          const fotoData = await fotoRes.json()
          fotoPath = fotoData.foto.ruta
        }
      }

      // Crear incidencia
      const res = await fetch("/api/tecnico/incidencias", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: formData.tipo,
          descripcion: formData.descripcion,
          fecha: formData.fecha,
          fotoPath
        })
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al registrar la incidencia")
      }

      toast({
        title: "Incidencia registrada",
        description: "La incidencia se ha registrado exitosamente.",
      })

      setFormData({
        tipo: "" as "PERSONAL" | "VEHICULO" | "",
        descripcion: "",
        fecha: new Date().toISOString().split('T')[0]
      })
      setFotoFile(null)
      setShowForm(false)
      fetchIncidencias()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar la incidencia.",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Incidencias</h1>
          <p className="text-muted-foreground">
            Reporta incidencias personales o del vehículo para justificar faltas
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Reportar Incidencia
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Reportar Incidencia</DialogTitle>
              <DialogDescription>
                Registra una incidencia personal o del vehículo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Incidencia *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value as "PERSONAL" | "VEHICULO" })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERSONAL">Personal</SelectItem>
                    <SelectItem value="VEHICULO">Vehículo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha de la Incidencia *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe la incidencia y cómo afecta tu jornada de trabajo..."
                  rows={5}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Esta descripción servirá como justificación para la falta a la jornada.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Foto (Opcional)</Label>
                {!fotoFile && !showCamera && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCamera(true)}
                    className="w-full"
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Tomar Foto
                  </Button>
                )}
                {showCamera && (
                  <CameraCapture
                    tipo="HERRAMIENTA"
                    label="Foto de la Incidencia"
                    onCapture={handleFotoCapture}
                    onCancel={() => setShowCamera(false)}
                  />
                )}
                {fotoFile && !showCamera && (
                  <div className="flex items-center gap-2 p-3 border rounded-lg">
                    <span className="text-sm flex-1">Foto capturada</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFotoFile(null)
                        setShowCamera(true)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Registrar Incidencia
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setFormData({
                      tipo: "" as "PERSONAL" | "VEHICULO" | "",
                      descripcion: "",
                      fecha: new Date().toISOString().split('T')[0]
                    })
                    setFotoFile(null)
                    setShowCamera(false)
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {incidencias.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay incidencias registradas
            </CardContent>
          </Card>
        ) : (
          incidencias.map((incidencia) => (
            <Card key={incidencia.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-secondary" />
                    <CardTitle>
                      Incidencia {incidencia.tipo === "PERSONAL" ? "Personal" : "del Vehículo"}
                    </CardTitle>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(incidencia.fecha).toLocaleDateString("es-ES")}
                  </span>
                </div>
                <CardDescription>
                  Registrada: {new Date(incidencia.createdAt).toLocaleDateString("es-ES")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4">{incidencia.descripcion}</p>
                {incidencia.fotoPath && (
                  <div className="mt-4">
                    <p className="text-xs text-muted-foreground mb-2">Foto adjunta:</p>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden max-w-md">
                      <img
                        src={incidencia.fotoPath}
                        alt="Incidencia"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

