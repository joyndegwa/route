import { useAuth } from "../hooks/useAuth";
import AdminDashboard from "./AdminDashboard";
import ClientDashboard from "./clientdashboard";
import IndustryDashboard from "./industydashboard";

export default function Dashboard() {
  const { role } = useAuth();

  switch (role) {
    case "admin":
      return <AdminDashboard />;
    case "industry":
      return <IndustryDashboard />;
    default:
      return <ClientDashboard />;
  }
}
