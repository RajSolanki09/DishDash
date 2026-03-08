import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setShopsInMyCity, setUserData } from "../redux/userSlice";

const useGetShopByCity = () => {       
  const dispatch = useDispatch();
  const { city } = useSelector((state) => state.user);

  useEffect(() => {
    if (!city) return;

    const fetchShop = async () => {
      try { 
        const { data } = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`, {
          withCredentials: true,
        });

        // Your backend returns { success: true, shops: [...] }
        dispatch(setShopsInMyCity(data.shops));
      } catch (error) {
        if (error.response?.status === 401) {
          dispatch(setUserData(null));
        }
        console.error("Fetch shops failed:", error.message);
      }
    };

    fetchShop();
  }, [city, dispatch]);
};

export default useGetShopByCity;