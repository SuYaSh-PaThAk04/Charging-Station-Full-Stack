import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(""); 
      const res = await fetch("https://charging-station-backend-o9ky.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("refreshToken", data.data.refreshToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <Card className="w-full max-w-md shadow-lg border border-gray-200 rounded-xl bg-white">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-gray-800">Welcome Back</CardTitle>
          <p className="text-sm text-gray-500">Please login to continue</p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
              autoComplete="email"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-sm text-gray-700">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Logging in...
              </div>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">New user?</p>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="mt-2 w-full border-blue-600 text-blue-600 hover:bg-blue-50"
            >
              Register
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
