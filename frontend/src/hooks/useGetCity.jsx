import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentCity, setCurrentState, setCurrentAddress } from '../redux/userSlice';
import { setLocation, setAdress } from '../redux/mapSlice';

const useGetCity = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

 useEffect(() => {
    // Sirf tabhi location maange jab user logged in ho
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lon: position.coords.longitude
          };
          setCoordinates(coords);
          dispatch(setLocation(coords));
        },
        (err) => {
          console.error('Error getting location:', err);
          setError('Unable to get your location');
          setLoading(false);
        }
      );
    }
  }, [dispatch]);

  useEffect(() => {
    if (!coordinates) return;

    const fetchCity = async () => {
      try {
        const { lat, lon } = coordinates;
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        
        // Logic to build a proper address string: Locality + City
        const locality = data.locality || "";
        const city = data.city || data.principalSubdivision || "";
        const state = data.principalSubdivision || "";
        
        // We combine Locality and City for the map address
        const properAddress = [locality, city].filter(Boolean).join(", ");
        
        dispatch(setCurrentCity(city));
        dispatch(setCurrentState(state));
        dispatch(setCurrentAddress(properAddress));
        dispatch(setAdress(properAddress));
        
        localStorage.setItem('userCity', city);
        localStorage.setItem('userState', state);
        localStorage.setItem('userCoordinates', JSON.stringify({ lat, lon }));
        
      } catch (err) {
        console.error('Error fetching city:', err);
        setError(err.message);
        dispatch(setCurrentCity('Location unavailable'));
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchCity();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [coordinates, dispatch]);

  return { loading, error };
};

export default useGetCity;