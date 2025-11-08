"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Download } from "lucide-react"

interface Cv {
  id: number
  name: string
  email: string
  phone: string
  position: string
  createdAt: string
}

export default function CVsPage() {
  const [cvs, setCvs] = useState<Cv[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/data?type=cvs")
      .then((res) => res.json())
      .then((data) => {
        setCvs(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const exportData = () => {
    const csv = [
      ["ID", "Nombre", "Email", "Teléfono", "Cargo", "Fecha"],
      ...cvs.map((cv) => [
        cv.id.toString(),
        cv.name,
        cv.email,
        cv.phone,
        cv.position,
        new Date(cv.createdAt).toLocaleDateString("es-ES"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `cvs_${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">CVs Recibidos</h1>
          <p className="text-muted-foreground">
            Lista de todas las postulaciones recibidas
          </p>
        </div>
        <Button variant="outline" onClick={exportData}>
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Postulaciones</CardTitle>
          <CardDescription>
            {cvs.length} CV(s) recibido(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Cargo Deseado</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cvs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No hay CVs recibidos
                  </TableCell>
                </TableRow>
              ) : (
                cvs.map((cv) => (
                  <TableRow key={cv.id}>
                    <TableCell>{cv.id}</TableCell>
                    <TableCell>{cv.name}</TableCell>
                    <TableCell>{cv.email}</TableCell>
                    <TableCell>{cv.phone}</TableCell>
                    <TableCell>{cv.position}</TableCell>
                    <TableCell>
                      {new Date(cv.createdAt).toLocaleDateString("es-ES")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

