import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import ownerSlice from "./ownerSlice";   
import mapSlice from "./mapSlice";   

export const store = configureStore({
    reducer: {
        user: userSlice,
        owner: ownerSlice,
        map: mapSlice
    },
    // This part clears the "Non-serializable" console error
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ['user.socket', 'map.location'], 
                ignoredActionTypes: ['user/setSocket'],
            },
        }),
});