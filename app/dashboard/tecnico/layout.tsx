import { TecnicoSidebar } from "@/components/dashboard/TecnicoSidebar"

export default function TecnicoDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <TecnicoSidebar />
      <main className="flex-1 bg-muted">
        {children}
      </main>
    </div>
  )
}

