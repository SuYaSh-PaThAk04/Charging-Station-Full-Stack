import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex flex-col items-center justify-center mt-24 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Charging Station Dashboard</h1>
        <div className="space-x-4">
          <Button onClick={() => navigate("/chargers")} className="bg-blue-600 hover:bg-blue-700">
            View All Chargers
          </Button>
          <Button onClick={() => navigate("/map")} className="bg-green-600 hover:bg-green-700">
            View Map
          </Button>
        </div>
      </div>
    </div>
  );
}
