"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, Plus } from "lucide-react"

const adelantoSchema = z.object({
  tipo: z.enum(["COMBUSTIBLE", "SUELDO"], {
    required_error: "El tipo de adelanto es requerido"
  }),
  monto: z.string().min(1, "El monto es requerido").refine(
    (val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0,
    "El monto debe ser un número mayor a 0"
  ),
  motivo: z.string().min(10, "El motivo debe tener al menos 10 caracteres")
})

type AdelantoFormData = z.infer<typeof adelantoSchema>

interface AdelantoFormProps {
  onSuccess?: () => void
}

export function AdelantoForm({ onSuccess }: AdelantoFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch
  } = useForm<AdelantoFormData>({
    resolver: zodResolver(adelantoSchema)
  })

  const tipo = watch("tipo")

  const onSubmit = async (data: AdelantoFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/tecnico/adelantos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          tipo: data.tipo,
          monto: parseFloat(data.monto),
          motivo: data.motivo
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al solicitar el adelanto")
      }

      toast({
        title: "¡Adelanto solicitado!",
        description: "Tu solicitud ha sido enviada. Los administradores serán notificados.",
      })

      reset()
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo solicitar el adelanto. Por favor, intenta nuevamente.",
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
          <DollarSign className="h-5 w-5 text-primary" />
          <CardTitle>Solicitar Adelanto</CardTitle>
        </div>
        <CardDescription>
          Solicita un adelanto de combustible o sueldo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Adelanto *</Label>
            <Select
              onValueChange={(value) => setValue("tipo", value as "COMBUSTIBLE" | "SUELDO")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="COMBUSTIBLE">Combustible</SelectItem>
                <SelectItem value="SUELDO">Sueldo</SelectItem>
              </SelectContent>
            </Select>
            {errors.tipo && (
              <p className="text-sm text-destructive">{errors.tipo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="monto">Monto *</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              {...register("monto")}
              placeholder="0.00"
            />
            {errors.monto && (
              <p className="text-sm text-destructive">{errors.monto.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Monto en dólares
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo *</Label>
            <Textarea
              id="motivo"
              {...register("motivo")}
              placeholder="Explica el motivo de la solicitud del adelanto..."
              rows={4}
            />
            {errors.motivo && (
              <p className="text-sm text-destructive">{errors.motivo.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Mínimo 10 caracteres
            </p>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <DollarSign className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Solicitar Adelanto
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

