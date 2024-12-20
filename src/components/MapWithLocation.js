import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon issues in Leaflet (React-specific)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Helper component to recenter the map
const RecenterMap = ({ latitude, longitude }) => {
  const map = useMap();
  useEffect(() => {
    if (latitude && longitude) {
      const newLatLng = L.latLng(latitude, longitude);
      map.setView(newLatLng, 18); // Set the view with full zoom
    }
  }, [latitude, longitude, map]);

  return null;
};

const MapWithLocation = ({ latitude, longitude }) => {
  const position = [latitude, longitude]; // Lat and Lng passed as props

  return (
    <MapContainer
      center={position}
      zoom={18} // Maximum zoom level
      style={{ height: '500px', width: '100%' }}
    >
      {/* Tile Layer: OpenStreetMap */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {/* Marker for the location */}
      <Marker position={position}>
        <Popup>
          Latitude: {latitude} <br />
          Longitude: {longitude}
        </Popup>
      </Marker>
      {/* Recenter map when location changes */}
      <RecenterMap latitude={latitude} longitude={longitude} />
    </MapContainer>
  );
};

export default MapWithLocation;
