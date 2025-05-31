import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LoginPage } from "./pages/login";
import RegisterPage from "./pages/Auth";
import Dashboard from "./pages/dashBoarrd";
import ChargerList from "./pages/ChargerList";
import ChargerMap from "./pages/ChargerMap";
import { Toaster } from "@/components/ui/sonner";

function App() {
  console.log("App is rendering");

  return (
    <Router>
      <Routes>
        
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<RegisterPage />} />

        {/* Dashboard after login */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chargers" element={<ChargerList />} />
        <Route path="/map" element={<ChargerMap />} />
      </Routes>

      {/* ShadCN toaster for notifications */}
      <Toaster />
    </Router>
  );
}

export default App;
