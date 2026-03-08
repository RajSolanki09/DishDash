import { useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setMyOrders } from "../redux/userSlice";

const useGetMyOrders = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    // FIX 1: was skipping entirely if role !== "owner".
    // Now we fetch for BOTH "user" and "owner" roles.
    if (!userData || (userData.role !== "owner" && userData.role !== "user")) return;

    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
          headers: {
            Accept: "application/json",
          },
        });

        // FIX 2: backend returns { orders: [...] } for both roles now (unified key).
        // Previously dispatched `data.shop || data` which was wrong.
        dispatch(setMyOrders(data.orders));
        console.log("Orders data fetched:", data);
      } catch (error) {
        if (error.response?.status === 404 || error.response?.status === 401) {
          dispatch(setMyOrders(null));
        } else {
          console.error(
            "Orders fetch failed:",
            error.response?.data?.message || error.message
          );
        }
      }
    };

    fetchOrders();
  }, [dispatch, userData]);
};

export default useGetMyOrders;