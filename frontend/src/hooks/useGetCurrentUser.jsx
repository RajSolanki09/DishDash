import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
          headers: {
            'Accept': 'application/json',
          }
        });

        dispatch(setUserData(data));
      } catch (error) {
        // Only clear user data if specifically unauthenticated (401)
        if (error.response?.status === 401) {
          dispatch(setUserData(null));
        }
        // Minimal error reporting for production
        console.error("Auth sync failed:", error.response?.data?.message || error.message);
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;