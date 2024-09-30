import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
  const [historyData, setHistoryData] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get('/recommendationsRt/getHist'); // Update the URL to your actual endpoint
        // console.log()
        setHistoryData(response.data);
      } catch (error) {
        console.error('Error fetching history data:', error);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div>
      <h1>History</h1>
      {historyData.map((item) => (
        <div key={item._id}>
          <h2>Email: {item.email}</h2>
          <p>Created At: {item.createdAt}</p>
          <h3>Places:</h3>
          <ul>
            {item.places.map((place, index) => (
              <li key={index}>
                <h4>{place.name}</h4>
                <p>Status: {place.business_status}</p>
                <p>Rating: {place.rating}</p>
                <p>Vicinity: {place.vicinity}</p>
                {place.photos && place.photos.length > 0 && (
                  <img
                    src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=YOUR_API_KEY`} // Add your Google API key
                    alt={place.name}
                  />
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default History;
