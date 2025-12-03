"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck } from "lucide-react"

interface CuadrillaInfoProps {
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

export function CuadrillaInfo({ cuadrilla }: CuadrillaInfoProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <CardTitle>Mi Cuadrilla</CardTitle>
        </div>
        <CardDescription>{cuadrilla.nombre}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="h-4 w-4 text-primary" />
            <span className="font-semibold">Técnico Titular:</span>
          </div>
          <p className="text-sm text-muted-foreground ml-6">
            {cuadrilla.tecnicoTitular.name} ({cuadrilla.tecnicoTitular.email})
          </p>
        </div>
        {cuadrilla.tecnicoAuxiliar && (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="font-semibold">Técnico Auxiliar:</span>
            </div>
            <p className="text-sm text-muted-foreground ml-6">
              {cuadrilla.tecnicoAuxiliar.name} ({cuadrilla.tecnicoAuxiliar.email})
            </p>
          </div>
        )}
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground">
            Tu rol: <span className="font-semibold">{cuadrilla.esTitular ? "Titular" : "Auxiliar"}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

