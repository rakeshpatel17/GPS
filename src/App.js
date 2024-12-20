import React, { useState, useEffect } from 'react';
import './App.css';
import MapWithLocation from './components/MapWithLocation';

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);

  const CHANNEL_ID = "2781696";
  const READ_API_KEY = "A57EWJUAYFB5MI5F";
  const BASE_URL = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json`;

  // Function to fetch latitude and longitude from ThingSpeak
  const fetchCoordinates = async () => {
    const params = new URLSearchParams({
      api_key: READ_API_KEY,
      results: 1 // Fetch the latest entry
    });

    try {
          const response = await fetch(`${BASE_URL}?${params.toString()}`);
          
          if (response.ok) {
              const data = await response.json();
              const feeds = data.feeds;

              if (feeds && feeds.length > 0) {
                  const latestFeed = feeds[0];
                  console.log("Latest Data from ThingSpeak:");
                  console.log(`Latitude: ${latestFeed.field1}`);
                  console.log(`Longitude: ${latestFeed.field2}`);
                  console.log(`Created At: ${latestFeed.created_at}`);
                  const newLatitude = parseFloat(latestFeed.field1); 
                  const newLongitude = parseFloat(latestFeed.field2);
                  // Update state only if coordinates have changed
                  if (newLatitude !== latitude || newLongitude !== longitude) {
                    setLatitude(newLatitude);
                    setLongitude(newLongitude);
                  }
              } else {
                  console.log("No data found in the channel.");
              }
          } 
          else {
            console.error(`Failed to fetch data. Status code: ${response.status}`);
          }
      } 
      catch (error) {
          console.error("An error occurred:", error);
      }
  };

  // Fetch data initially and every 10 seconds
  useEffect(() => {
    fetchCoordinates(); // Fetch initially
    const interval = setInterval(fetchCoordinates, 1000); // Refresh every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [latitude, longitude]);

  return (
    <div>
      <h1>Current Location</h1>
      <p>Latitude: {latitude} | Longitude: {longitude}</p>
      <MapWithLocation latitude={latitude} longitude={longitude} />
    </div>
  );
}

export default App;
