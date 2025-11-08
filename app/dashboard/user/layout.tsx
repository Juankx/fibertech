import { Sidebar } from "@/components/dashboard/Sidebar"

export default function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-muted">
        {children}
      </main>
    </div>
  )
}

