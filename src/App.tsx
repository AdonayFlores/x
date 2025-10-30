import { useState } from "react";
import { Login } from "./components/Login";
import { Home } from "./components/Home";
import { PersonalDataForm } from "./components/PersonalDataForm";
import { ExplorersList } from "./components/ExplorersList";
import { ExplorerDetail } from "./components/ExplorerDetail";
import { AttendanceTaking } from "./components/AttendanceTaking";
import { AttendanceReport } from "./components/AttendanceReport";
import { FinanceManager } from "./components/FinanceManager";
import { ServiceScheduleCreation } from "./components/ServiceScheduleCreation";
import { ServiceScheduleAttendance } from "./components/ServiceScheduleAttendance";
import { ServiceScheduleReport } from "./components/ServiceScheduleReport";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] =
    useState<string>("home");
  const [selectedExplorerId, setSelectedExplorerId] = useState<
    string | null
  >(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage("home");
    setSelectedExplorerId(null);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    setSelectedExplorerId(null);
  };

  const handleBack = () => {
    setCurrentPage("home");
    setSelectedExplorerId(null);
  };

  const handleViewExplorer = (explorerId: string) => {
    setSelectedExplorerId(explorerId);
    setCurrentPage("explorer-detail");
  };

  const handleBackToList = () => {
    setCurrentPage("explorers-list");
    setSelectedExplorerId(null);
  };

  const handleAddNewExplorer = () => {
    setCurrentPage("personal-data");
  };

  if (!isAuthenticated) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "personal-data") {
    return (
      <>
        <PersonalDataForm onBack={handleBack} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "explorers-list") {
    return (
      <>
        <ExplorersList
          onBack={handleBack}
          onViewExplorer={handleViewExplorer}
          onAddNew={handleAddNewExplorer}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "explorer-detail" && selectedExplorerId) {
    return (
      <>
        <ExplorerDetail
          explorerId={selectedExplorerId}
          onBack={handleBackToList}
        />
        <Toaster />
      </>
    );
  }

  if (currentPage === "attendance-taking") {
    return (
      <>
        <AttendanceTaking onBack={handleBack} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "attendance-report") {
    return (
      <>
        <AttendanceReport onBack={handleBack} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "finance-manager") {
    return (
      <>
        <FinanceManager onBack={handleBack} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "service-schedule" || currentPage === "service-schedule-creation") {
    return (
      <>
        <ServiceScheduleCreation onBack={handleBack} onNavigate={handleNavigate} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "service-schedule-attendance") {
    return (
      <>
        <ServiceScheduleAttendance onBack={() => handleNavigate("service-schedule")} />
        <Toaster />
      </>
    );
  }

  if (currentPage === "service-schedule-report") {
    return (
      <>
        <ServiceScheduleReport onBack={() => handleNavigate("service-schedule")} />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <Home
        onLogout={handleLogout}
        onNavigate={handleNavigate}
      />
      <Toaster />
    </>
  );
}