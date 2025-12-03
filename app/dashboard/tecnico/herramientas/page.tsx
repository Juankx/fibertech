"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CameraCapture } from "@/components/tecnico/CameraCapture"
import { Wrench, Camera, Plus, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Herramienta {
  id: number
  nombre: string
  descripcion: string | null
  fotoPath: string | null
  fechaRegistro: string
  createdAt: string
}

export default function HerramientasPage() {
  const [herramientas, setHerramientas] = useState<Herramienta[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedHerramienta, setSelectedHerramienta] = useState<number | null>(null)
  const [formData, setFormData] = useState({ nombre: "", descripcion: "" })
  const { toast } = useToast()

  const fetchHerramientas = async () => {
    try {
      const res = await fetch("/api/tecnico/herramientas")
      if (res.ok) {
        const data = await res.json()
        setHerramientas(data)
      }
    } catch (error) {
      console.error("Error al cargar herramientas:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHerramientas()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/tecnico/herramientas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || "Error al registrar la herramienta")
      }

      toast({
        title: "Herramienta registrada",
        description: "La herramienta se ha registrado exitosamente.",
      })

      setFormData({ nombre: "", descripcion: "" })
      setShowForm(false)
      fetchHerramientas()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar la herramienta.",
        variant: "destructive"
      })
    }
  }

  const handleFotoUpload = async (file: File) => {
    if (!selectedHerramienta) return

    try {
      // Primero subir la foto
      const fotoFormData = new FormData()
      fotoFormData.append("tipo", "HERRAMIENTA")
      fotoFormData.append("file", file)

      const fotoRes = await fetch("/api/tecnico/fotos", {
        method: "POST",
        body: fotoFormData
      })

      if (!fotoRes.ok) {
        const errorData = await fotoRes.json()
        throw new Error(errorData.error || "Error al subir la foto")
      }

      const fotoData = await fotoRes.json()

      // Actualizar herramienta con la ruta de la foto
      const updateRes = await fetch("/api/tecnico/herramientas", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          id: selectedHerramienta,
          fotoPath: fotoData.foto.ruta
        })
      })

      if (!updateRes.ok) {
        throw new Error("Error al actualizar la herramienta")
      }

      toast({
        title: "Foto registrada",
        description: "La foto de la herramienta se ha guardado exitosamente.",
      })

      setShowCamera(false)
      setSelectedHerramienta(null)
      fetchHerramientas()
    } catch (error: any) {
      throw error
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
          <h1 className="text-3xl font-bold text-primary mb-2">Herramientas de Trabajo</h1>
          <p className="text-muted-foreground">
            Gestiona tus herramientas y toma fotos de verificación
          </p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Registrar Herramienta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nueva Herramienta</DialogTitle>
              <DialogDescription>
                Registra una nueva herramienta de trabajo
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Herramienta *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Taladro, Multímetro, etc."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Descripción de la herramienta..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  Registrar
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {showCamera && selectedHerramienta && (
        <div className="mb-6">
          <CameraCapture
            tipo="HERRAMIENTA"
            label="Herramienta"
            onCapture={handleFotoUpload}
            onCancel={() => {
              setShowCamera(false)
              setSelectedHerramienta(null)
            }}
          />
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {herramientas.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center text-muted-foreground">
              No hay herramientas registradas aún
            </CardContent>
          </Card>
        ) : (
          herramientas.map((herramienta) => (
            <Card key={herramienta.id}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Wrench className="h-5 w-5 text-primary" />
                  <CardTitle>{herramienta.nombre}</CardTitle>
                </div>
                <CardDescription>
                  Registrada: {new Date(herramienta.fechaRegistro).toLocaleDateString("es-ES")}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {herramienta.descripcion && (
                  <p className="text-sm text-muted-foreground">{herramienta.descripcion}</p>
                )}
                {herramienta.fotoPath ? (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground">Foto registrada</p>
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <img
                        src={herramienta.fotoPath}
                        alt={herramienta.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setSelectedHerramienta(herramienta.id)
                      setShowCamera(true)
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    Tomar Foto
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}

