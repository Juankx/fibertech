import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth-config"
import { Role } from "@prisma/client"

export async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  return session?.user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error("No autenticado")
  }
  return user
}

export async function requireAdmin() {
  const user = await requireAuth()
  if (user.role !== Role.ADMIN) {
    throw new Error("Acceso denegado: se requiere rol de administrador")
  }
  return user
}

