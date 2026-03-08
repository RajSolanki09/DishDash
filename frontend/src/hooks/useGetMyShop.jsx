import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import { setMyShopData } from "../redux/ownerSlice";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user); // 👇 added this

  useEffect(() => {
    // 👇 skip entirely if no user yet, or if user is not an owner
    if (!userData || userData.role !== "owner") return;

    const fetchShop = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/shop/get-my`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
          }
        });

        dispatch(setMyShopData(data.shop || data));
        console.log("Shop data fetched:", data);
      } catch (error) {
        if (error.response?.status === 404) {
          dispatch(setMyShopData(null));
        }
        if (error.response?.status === 401) {
          dispatch(setUserData(null));
        }
        if (error.response?.status !== 404) {
          console.error("Shop fetch failed:", error.response?.data?.message || error.message);
        }
      }
    };

    fetchShop();
  }, [dispatch, userData]); // 👇 userData in dependency array so it re-runs once userData loads
};

export default useGetMyShop;