import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import Navbar from "../components/NavBar";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL("leaflet/dist/images/marker-icon-2x.png", import.meta.url),
  iconUrl: new URL("leaflet/dist/images/marker-icon.png", import.meta.url),
  shadowUrl: new URL("leaflet/dist/images/marker-shadow.png", import.meta.url),
});

const MarkerClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
};

export default function ChargerMap() {
  const [chargers, setChargers] = useState([]);
  const [newMarker, setNewMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
const fetchChargers = async () => {
  setLoading(true);
  setError(null);

  try {
    const token = localStorage.getItem("token"); // assuming token is stored on login
    const res = await axios.get("http://localhost:4000/api/chargers/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setChargers(res.data);
  } catch (error) {
    console.error("Failed to fetch chargers", error);
    setError("Failed to fetch chargers. Please try again later.");
  } finally {
    setLoading(false);
  }
};


    fetchChargers();
  }, []);

  const handleMapClick = (latlng) => {
    setNewMarker(latlng);
    alert(`Clicked location: ${latlng.lat}, ${latlng.lng}`);
  };

  return (
    <>
      <Navbar />
      <div className="h-[calc(100vh-64px)] w-full">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {loading && <div>Loading chargers...</div>}
          {error && <div>{error}</div>}
{chargers
  .filter(
    (charger) =>
      typeof charger.latitude === "number" &&
      typeof charger.longitude === "number"
  )
  .map((charger) => (
    <Marker
      key={charger._id}
      position={[charger.latitude, charger.longitude]}
    >
      <Popup>
        <strong>{charger.name}</strong><br />
        Location: {charger.location}<br />
        Status: {charger.status}<br />
        Power Output: {charger.powerOutput}<br />
        Connector: {charger.connectorType}
      </Popup>
    </Marker>
))}
          {console.log("Rendering chargers:", chargers)}

          {newMarker && (
            <Marker position={[newMarker.lat, newMarker.lng]}>
              <Popup>New Marker at {newMarker.lat.toFixed(4)}, {newMarker.lng.toFixed(4)}</Popup>
            </Marker>
          )}

          <MarkerClickHandler onMapClick={handleMapClick} />
        </MapContainer>
      </div>
    </>
  );
}

