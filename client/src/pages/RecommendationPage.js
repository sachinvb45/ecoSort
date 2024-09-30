import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RecommendationPage.css';

const RecommendationPage = () => {
    const { requestId } = useParams();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [locationName, setLocationName] = useState('');
    console.log('hell5');
    useEffect(() => {
        const getUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        console.log('hello3')
                        fetchNearbyPlaces(latitude, longitude);
                        fetchLocationName(latitude, longitude);
                    },
                    (error) => {
                        setError("Unable to retrieve location. " + error.message);
                        setLoading(false);
                    }
                );
            } else {
                setError("Geolocation is not supported by this browser.");
                setLoading(false);
            }
        };

        const fetchNearbyPlaces = async (latitude, longitude) => {
            console.log('hello2')
            try {
                const response = await fetch(`https://waste-disposal-v1cm.onrender.com/gMapRt/nearby`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ latitude, longitude, requestId })
                });
                const data = await response.json();
                setPlaces(data);
                await storeRecommendations(data);  // Store recommendations on the backend
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchLocationName = async (latitude, longitude) => {
            console.log('hello4')
            try {
                const apiKey = 'AIzaSyCdcf2_kH9AMW5RJQ8IqYx571SIPohc64M';
                const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`);
                const data = await response.json();
                if (data.results.length > 0) {
                    setLocationName(data.results[0].formatted_address);
                } else {
                    setLocationName('Location not found');
                }
            } catch (err) {
                setError('Failed to fetch location name.',err);
            }
        };

        getUserLocation();
    }, [requestId]);

    // Store recommendations for tracking history
    const storeRecommendations = async (places) => {
        const email=localStorage.getItem('userData');
        console.log("hello",email)
        try {
            const response = await fetch('http://localhost:8000/recommendationsRt/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: requestId,
                    email:email,
                    places: places,  // Pass the places array
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to store recommendations');
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Track user clicks on Google Maps links
    const handleLocationClick = async (place) => {
        try {
            const response = await fetch('/api/track-click', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: requestId,
                    placeId: place.place_id,
                    placeName: place.name,
                    timestamp: new Date(),
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to track the clicked location');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const generateMapPreview = (lat, lng) => {
        const apiKey = 'AIzaSyCdcf2_kH9AMW5RJQ8IqYx571SIPohc64M';
        const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=15&size=600x300&markers=color:red%7C${lat},${lng}&key=${apiKey}`;
        return url;
    };

    if (loading) return <p>Loading recommendations...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <h2>Your location: {locationName}</h2>
            <div className="recommendation-container">
                <h2>Nearby Service Providers</h2>
                <ul className="recommendation-list">
                    {places.map(place => (
                        <li key={place.place_id} className="recommendation-item">
                            <img
                                className="place-map-preview"
                                src={generateMapPreview(place.geometry.location.lat, place.geometry.location.lng)}
                                alt={`Map preview of ${place.name}`}
                            />
                            <div className="place-details">
                                <h3>{place.name}</h3>
                                <p className="place-vicinity">{place.vicinity}</p>
                                <p className="place-rating">Rating: {place.rating} ★</p>
                                <p className="place-contact">Contact: {place.formatted_phone_number || 'Not available'}</p>
                                <a
                                    className="place-map-link"
                                    href={`https://www.google.com/maps/search/?api=1&query=${place.geometry.location.lat},${place.geometry.location.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => handleLocationClick(place)}  // Track click
                                >
                                    View on Google Maps
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RecommendationPage;
