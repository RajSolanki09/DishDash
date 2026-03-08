import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setItemsInMyCity, setUserData } from "../redux/userSlice";

const useGetItemsByCity = () => {       
  const dispatch = useDispatch();
  // Get city from the 'user' slice as defined in your store.js
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    // Prevent API call if city is null/undefined
    if (!city) return;

    const fatchItems = async () => {
      try { 
        // Use backticks and the correct variable name 'city'
        const { data } = await axios.get(`${serverUrl}/api/item/get-by-city/${city}`, {
          withCredentials: true,
        });

        dispatch(setItemsInMyCity(data));
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(setUserData(null));
        }
        console.error("Fetch items failed:", error.message);
      }
    };

    fatchItems();
  }, [city, dispatch]); // Corrected dependency array
};

export default useGetItemsByCity;