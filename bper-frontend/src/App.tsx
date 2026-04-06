import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { Dashboard } from "./components/Dashboard";
import { FormWizard } from "./components/FormWizard/FormWizard";
import { ProcessAnalytics } from "./components/ProcessAnalytics";
import { AdminUsers } from "./components/AdminUsers";
import { BperFormStatus } from "./components/BperFormStatus";
import { EmployeeSidebar } from "./components/EmployeeSidebar";
import { Employee360 } from "./components/Employee360";

// New pages
import { EperDashboard } from "./components/EperDashboard";
import { WdtReview } from "./components/WdtReview";
import { SixBySixScoring } from "./components/SixBySixScoring";
import { FitmentScoring } from "./components/FitmentScoring";
import { DeepReports } from "./components/DeepReports";

function App() {
  const [activePage, setActivePage] = useState("eperDashboard");

  const isEmployeePortal = activePage === "bperStatus" || activePage === "wizard";

  // Pages that don't need the TopNav
  const noTopNav = ["fitmentScoring", "eperDashboard", "users", "fitment", "wdtReview", "sixbySixScoring", "deepReports", "employee360"];
  const showTopNav = !isEmployeePortal && !noTopNav.includes(activePage);

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans">
      {isEmployeePortal ? (
        <EmployeeSidebar activePage={activePage} setActivePage={setActivePage} />
      ) : (
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
      )}

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {showTopNav && <TopNav />}

        {/* Existing pages */}
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "wizard" && <FormWizard />}
        {activePage === "analytics" && <ProcessAnalytics />}
        {activePage === "employee360" && <Employee360 />}
        {activePage === "users" && <AdminUsers />}
        {activePage === "bperStatus" && <BperFormStatus />}

        {/* New ePER pages */}
        {activePage === "eperDashboard" && <EperDashboard setActivePage={setActivePage} />}
        {activePage === "wdtReview" && <WdtReview />}
        {activePage === "sixbySixScoring" && <SixBySixScoring />}
        {activePage === "fitmentScoring" && <FitmentScoring />}
        {activePage === "deepReports" && <DeepReports />}
      </div>
    </div>
  );
}

export default App;
