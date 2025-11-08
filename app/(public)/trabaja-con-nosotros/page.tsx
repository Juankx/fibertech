"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Briefcase, Upload, FileText } from "lucide-react"
import { motion } from "framer-motion"

const cvSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(10, "El teléfono debe tener al menos 10 caracteres"),
  position: z.string().min(3, "El cargo debe tener al menos 3 caracteres"),
  file: z.instanceof(FileList).refine((files) => files.length > 0, "El CV es requerido"),
})

type CvFormData = z.infer<typeof cvSchema>

export default function WorkWithUsPage() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CvFormData>({
    resolver: zodResolver(cvSchema),
  })

  const onSubmit = async (data: CvFormData) => {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("name", data.name)
      formData.append("email", data.email)
      formData.append("phone", data.phone)
      formData.append("position", data.position)
      formData.append("file", data.file[0])

      const response = await fetch("/api/cv", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al enviar el CV")
      }

      toast({
        title: "¡CV enviado exitosamente!",
        description: "Hemos recibido tu postulación. Te contactaremos pronto.",
      })
      reset()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo enviar el CV. Por favor, intenta nuevamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen py-12 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Trabaja con Nosotros</h1>
            <p className="text-lg text-muted-foreground">
              Únete a nuestro equipo y forma parte de la transformación tecnológica
            </p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Briefcase className="h-8 w-8 text-primary" />
                <CardTitle>Envía tu CV</CardTitle>
              </div>
              <CardDescription>
                Completa el formulario y adjunta tu CV en formato PDF
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Tu nombre completo"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    {...register("phone")}
                    placeholder="+593 99 999 9999"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Cargo Deseado *</Label>
                  <Input
                    id="position"
                    {...register("position")}
                    placeholder="Ej: Desarrollador Full Stack, Ingeniero de Redes..."
                  />
                  {errors.position && (
                    <p className="text-sm text-destructive">{errors.position.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="file">CV (PDF) *</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept="application/pdf"
                      {...register("file")}
                      className="cursor-pointer"
                    />
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  {errors.file && (
                    <p className="text-sm text-destructive">{errors.file.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Solo archivos PDF. Tamaño máximo: 10MB
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="mr-2 h-4 w-4 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Enviar CV
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">¿Por qué trabajar con nosotros?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Oportunidades de crecimiento profesional</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Ambiente de trabajo innovador y colaborativo</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Proyectos desafiantes con tecnología de vanguardia</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Capacitación continua y desarrollo de habilidades</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

