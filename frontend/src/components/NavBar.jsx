import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import ThemeToggle from "./DarkMode";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      <div className="text-xl font-semibold">
        <Link to="/">⚡ EV Charger Portal</Link>
      </div>

      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" className="text-white hover:bg-gray-700">Dashboard</Button>
        </Link>
        <Link to="/chargers">
          <Button variant="ghost" className="text-white hover:bg-gray-700">Chargers</Button>
        </Link>
        <Link to="/map">
          <Button variant="ghost" className="text-white hover:bg-gray-700">Map</Button>
        </Link>
         <ThemeToggle /> 
        <Button variant="destructive" onClick={handleLogout}>Logout</Button>
      </div>
    </nav>
  );
}
