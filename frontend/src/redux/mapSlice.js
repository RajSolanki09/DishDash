import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "map",
  initialState: {
    location: {
      lat: null,
      lon: null,
    },
    address: null,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location.lat = action.payload.lat;
      state.location.lon = action.payload.lon;
    },
    setAdress: (state, action) => {
      state.address = action.payload;
    },
    resetMap: (state) => {
      state.location = { lat: null, lon: null };
      state.address = null;
    }
  },
});

export const { setLocation, setAdress, resetMap } = mapSlice.actions;
export default mapSlice.reducer;