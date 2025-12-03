"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ClipboardList, Plus, X } from "lucide-react"

const actividadSchema = z.object({
  fecha: z.string().min(1, "La fecha es requerida"),
  numeroOrden: z.string().min(1, "El número de orden es requerido"),
  tipoActividad: z.string().min(1, "El tipo de actividad es requerido"),
  datosCliente: z.object({
    nombre: z.string().min(1, "El nombre del cliente es requerido"),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    email: z.string().email().optional().or(z.literal(""))
  }),
  novedades: z.string().optional()
})

type ActividadFormData = z.infer<typeof actividadSchema>

interface ActividadFormProps {
  cuadrillaId?: number
  proyectoId?: number
  onSuccess?: () => void
}

export function ActividadForm({ cuadrillaId, proyectoId, onSuccess }: ActividadFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<ActividadFormData>({
    resolver: zodResolver(actividadSchema),
    defaultValues: {
      fecha: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Ayer
      datosCliente: {
        nombre: "",
        direccion: "",
        telefono: "",
        email: ""
      }
    }
  })

  const onSubmit = async (data: ActividadFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tecnico/actividades", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fecha: data.fecha,
          numeroOrden: data.numeroOrden,
          tipoActividad: data.tipoActividad,
          datosCliente: data.datosCliente,
          novedades: data.novedades || null,
          cuadrillaId: cuadrillaId || null,
          proyectoId: proyectoId || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al registrar la actividad")
      }

      toast({
        title: "¡Actividad registrada!",
        description: "La actividad se ha registrado exitosamente.",
      })

      reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo registrar la actividad. Por favor, intenta nuevamente.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          <CardTitle>Registrar Actividad</CardTitle>
        </div>
        <CardDescription>
          Registra las actividades realizadas el día anterior
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fecha">Fecha de la Actividad *</Label>
            <Input
              id="fecha"
              type="date"
              {...register("fecha")}
            />
            {errors.fecha && (
              <p className="text-sm text-destructive">{errors.fecha.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="numeroOrden">Número de Orden *</Label>
            <Input
              id="numeroOrden"
              {...register("numeroOrden")}
              placeholder="Ej: ORD-2024-001"
            />
            {errors.numeroOrden && (
              <p className="text-sm text-destructive">{errors.numeroOrden.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tipoActividad">Tipo de Actividad *</Label>
            <Input
              id="tipoActividad"
              {...register("tipoActividad")}
              placeholder="Ej: Instalación, Reparación, Mantenimiento"
            />
            {errors.tipoActividad && (
              <p className="text-sm text-destructive">{errors.tipoActividad.message}</p>
            )}
          </div>

          <div className="space-y-4 p-4 border rounded-lg">
            <Label className="text-base font-semibold">Datos del Cliente *</Label>
            
            <div className="space-y-2">
              <Label htmlFor="clienteNombre">Nombre del Cliente *</Label>
              <Input
                id="clienteNombre"
                {...register("datosCliente.nombre")}
                placeholder="Nombre completo del cliente"
              />
              {errors.datosCliente?.nombre && (
                <p className="text-sm text-destructive">{errors.datosCliente.nombre.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clienteDireccion">Dirección</Label>
              <Input
                id="clienteDireccion"
                {...register("datosCliente.direccion")}
                placeholder="Dirección del cliente"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clienteTelefono">Teléfono</Label>
                <Input
                  id="clienteTelefono"
                  {...register("datosCliente.telefono")}
                  placeholder="Teléfono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clienteEmail">Email</Label>
                <Input
                  id="clienteEmail"
                  type="email"
                  {...register("datosCliente.email")}
                  placeholder="Email"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="novedades">Novedades</Label>
            <Textarea
              id="novedades"
              {...register("novedades")}
              placeholder="Observaciones o novedades sobre la actividad..."
              rows={4}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ClipboardList className="mr-2 h-4 w-4 animate-spin" />
                Registrando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Registrar Actividad
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

