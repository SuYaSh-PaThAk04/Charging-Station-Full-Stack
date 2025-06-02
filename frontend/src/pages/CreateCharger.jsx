import { useState } from "react";

export function CreateCharger({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: "",
    longitude: "",
   locationName: "",
    powerOutput: "",
    status: "available",
    connectorType: "Type2",
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");

    if (!formData.name || !formData.latitude || !formData.longitude || !formData.powerOutput) {
      alert("Please fill in all fields");
      return;
    }

    const payload = {
      name: formData.name,
      status: formData.status,
      powerOutput: formData.powerOutput,
      connectorType: formData.connectorType,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude),
      location: {
        type: "Point",
        coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)],
      },
        locationName: formData.locationName, 
    };

    try {
      const res = await fetch("https://charging-station-backend-o9ky.onrender.com/api/chargers/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create charger");
      alert("Charger created successfully!");
      if (onClose) onClose();
    } catch (err) {
      alert("Error: " + err.message);
      console.error("Create charger error:", err);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-md space-y-4 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold text-center">Add New Charger</h2>

      <input
        name="name"
        placeholder="Charger Name"
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      <input
        name="latitude"
        placeholder="Latitude (e.g. 20.4356)"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      <input
        name="longitude"
        placeholder="Longitude (e.g. 74.8932)"
        type="number"
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />
      <input
  name="locationName"
  placeholder="Location (e.g., Pune, Maharashtra)"
  onChange={handleChange}
  className="w-full p-2 border rounded-md"
        />
      <input
        name="powerOutput"
        placeholder="Power Output (e.g. 100kW)"
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      />

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="available">Available</option>
        <option value="In Use">In Use</option>
        <option value="unavailable">Unavailable</option>
      </select>

      <select
        name="connectorType"
        value={formData.connectorType}
        onChange={handleChange}
        className="w-full p-2 border rounded-md"
      >
        <option value="Type2">Type2</option>
        <option value="CCS">CCS</option>
        <option value="CHAdeMO">CHAdeMO</option>
      </select>

      <div className="flex justify-between gap-4">
        <button
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Create
        </button>
        <button
          onClick={onClose}
          className="w-full bg-gray-300 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
