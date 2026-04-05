import { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { TopNav } from "./components/TopNav";
import { Dashboard } from "./components/Dashboard";
import { FormWizard } from "./components/FormWizard/FormWizard";
import { FitmentMain } from "./components/Fitment/FitmentMain";
import { ProcessAnalytics } from "./components/ProcessAnalytics";
import { AdminUsers } from "./components/AdminUsers";
import { BperFormStatus } from "./components/BperFormStatus";
import { EmployeeSidebar } from "./components/EmployeeSidebar";
import { Employee360 } from "./components/Employee360";

function App() {
  const [activePage, setActivePage] = useState("fitment"); // Default to fitment for demo purposes

  const isEmployeePortal = activePage === "bperStatus" || activePage === "wizard";

  return (
    <div className="flex bg-slate-100 min-h-screen font-sans">
      {isEmployeePortal ? (
         <EmployeeSidebar activePage={activePage} setActivePage={setActivePage} />
      ) : (
         <Sidebar activePage={activePage} setActivePage={setActivePage} />
      )}
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {!isEmployeePortal && activePage !== "fitment" && activePage !== "employee360" && activePage !== "users" && <TopNav />}
        
        {activePage === "dashboard" ? <Dashboard /> : null}
        {activePage === "wizard" ? <FormWizard /> : null}
        {activePage === "fitment" ? <FitmentMain /> : null}
        {activePage === "analytics" ? <ProcessAnalytics /> : null}
        {activePage === "employee360" ? <Employee360 /> : null}
        {activePage === "users" ? <AdminUsers /> : null}
        {activePage === "bperStatus" ? <BperFormStatus /> : null}
      </div>
    </div>
  );
}

export default App;
