import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import markerRetina from "leaflet/dist/images/marker-icon-2x.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerRetina,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

import { useAddress } from "../../../context/AddressContext";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";

function Recenter({ lat, lng }) {
  const map = useMap();
  map.setView([lat, lng], 13);
  return null;
}

function Map() {
  const { data } = useAddress();

  if (!data) return null;

  const { lat, lng } = data.location;

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]}>
        <Popup>You are here!</Popup>
      </Marker>
      <Recenter lat={lat} lng={lng} />
    </MapContainer>
  );
}
export default Map;
