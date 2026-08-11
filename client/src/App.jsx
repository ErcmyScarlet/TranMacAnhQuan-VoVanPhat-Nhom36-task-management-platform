import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import ProjectList from "./pages/ProjectList";
import Dashboard from "./pages/Dashboard";
import Reminders from "./pages/Reminders";

function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Reminders />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;