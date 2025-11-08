import { AdminSidebar } from "@/components/dashboard/AdminSidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 bg-muted">
        {children}
      </main>
    </div>
  )
}

