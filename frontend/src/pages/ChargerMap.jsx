import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import axios from "axios";
import Navbar from "../components/Navbar";

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

  useEffect(() => {
    const fetchChargers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/chargers/all");
        setChargers(res.data);
      } catch (error) {
        console.error("Failed to fetch chargers", error);
      }
    };

    fetchChargers();
  }, []);

  const handleMapClick = (latlng) => {
    setNewMarker(latlng);
    alert(`Clicked location: ${latlng.lat}, ${latlng.lng}`);
    // You can open a modal/form here to create a new charger
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

          {/* Existing Chargers */}
          {chargers.map((charger) => (
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

          {/* Clicked Location Marker */}
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
