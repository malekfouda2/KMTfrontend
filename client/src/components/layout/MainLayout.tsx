import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { UserRole } from "@/types";

interface MainLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumb?: string;
  requiredRoles?: UserRole[];
}

export const MainLayout = ({
  children,
  title,
  breadcrumb,
  requiredRoles,
}: MainLayoutProps) => {
  return (
    <ProtectedRoute requiredRoles={requiredRoles}>
      <div className="flex h-screen bg-neutral">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={title} breadcrumb={breadcrumb} />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};
