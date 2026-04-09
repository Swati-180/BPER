import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/Dashboard";
import { FormWizard } from "./components/FormWizard/FormWizard";
import { ProcessAnalytics } from "./components/ProcessAnalytics";
import { AdminUsers } from "./components/AdminUsers";
import { BperFormStatus } from "./components/BperFormStatus";
import { Employee360 } from "./components/Employee360";
import { EperDashboard } from "./components/EperDashboard";
import { WdtReview } from "./components/WdtReview";
import { SixBySixScoring } from "./components/SixBySixScoring";
import { FitmentScoring } from "./components/FitmentScoring";
import { DeepReports } from "./components/DeepReports";
import { PendingUsers } from "./components/PendingUsers";
import { LoginPage } from "./pages/LoginPage";
import { RequestAccessPage } from "./pages/RequestAccessPage";
import { ProfilePage } from "./pages/ProfilePage";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { useAuth } from "./auth/AuthProvider";
import { EmployeeLayout } from "./layouts/EmployeeLayout";
import { AdminLayout } from "./layouts/AdminLayout";

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return user.role === "employee" ? <Navigate to="/dashboard" replace /> : <Navigate to="/admin/dashboard" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/request-access" element={<RequestAccessPage />} />

      <Route element={<ProtectedRoute allowedRoles={["employee"]} />}>
        <Route element={<EmployeeLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/form" element={<FormWizard />} />
          <Route path="/form-status" element={<BperFormStatus />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["admin", "tower_lead", "supervisor"]} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<EperDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/pending-users" element={<PendingUsers />} />
          <Route path="/admin/forms" element={<WdtReview />} />
          <Route path="/admin/analytics" element={<ProcessAnalytics />} />
          <Route path="/admin/employee-360" element={<Employee360 />} />

          <Route path="/admin/wdt-review" element={<WdtReview />} />
          <Route path="/admin/six-by-six" element={<SixBySixScoring />} />
          <Route path="/admin/fitment" element={<FitmentScoring />} />
          <Route path="/admin/reports" element={<DeepReports />} />
        </Route>
      </Route>

      <Route path="/wizard" element={<Navigate to="/form" replace />} />
      <Route path="/bper-status" element={<Navigate to="/form-status" replace />} />

      <Route path="/" element={<HomeRedirect />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
