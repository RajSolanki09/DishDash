import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    currentState: null,
    currentAddress: null,
    shopsInMyCity: null,
    itemsInMyCity: null,
    cartItems: [],
    totalAmount: 0,
    myOrders: [],
    notifications: [],
    searchResults:[],
    socket:null,
    favoriteItems:[]  // ✅ Populated favorites with full item + shop data
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCurrentCity: (state, action) => {
      state.city = action.payload;
    },
    setCurrentState: (state, action) => {
      state.currentState = action.payload;
    },
    setCurrentAddress: (state, action) => {
      state.currentAddress = action.payload;
    },
    setShopsInMyCity: (state, action) => {
      state.shopsInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setCartItems: (state, action) => {
      state.cartItems = Array.isArray(action.payload) ? action.payload : [];
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
    },
    addToCart: (state, action) => {
      const cartItem = action.payload;
      // Use id or _id as fallback
      const itemId = cartItem.id || cartItem._id;
      
      if (!itemId || !cartItem.price || !cartItem.quantity) {
        console.warn("Invalid cart item:", cartItem);
        return;
      }

      const existingItem = state.cartItems.find((i) => (i.id || i._id) === itemId);
      
      if (existingItem) {
        existingItem.quantity += Number(cartItem.quantity);
      } else {
        // Ensure the item in cart definitely has an 'id' property for consistency
        state.cartItems.push({ 
          ...cartItem, 
          id: itemId,
          quantity: Number(cartItem.quantity)
        });
      }

      // Recalculate total amount
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      
      if (!id) {
        console.warn("No ID provided to updateQuantity");
        return;
      }

      // Match against both id and _id
      const item = state.cartItems.find((i) => (i.id || i._id) === id);

      if (item) {
        const newQuantity = Number(quantity);
        
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or negative
          state.cartItems = state.cartItems.filter((i) => (i.id || i._id) !== id);
        } else {
          // Update quantity
          item.quantity = newQuantity;
        }
      } else {
        console.warn("Item not found in cart:", id);
      }

      // Recalculate total amount
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
    },
    removeCartItem: (state, action) => {
      const id = action.payload.id || action.payload;
      
      if (!id) {
        console.warn("No ID provided to removeCartItem");
        return;
      }

      const initialLength = state.cartItems.length;
      state.cartItems = state.cartItems.filter((i) => (i.id || i._id) !== id);
      
      if (state.cartItems.length === initialLength) {
        console.warn("Item not found for removal:", id);
      }
      
      // Recalculate total amount
      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + (Number(item.price) || 0) * (Number(item.quantity) || 0),
        0
      );
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.totalAmount = 0;
    },
    setMyOrders: (state, action) => {
      state.myOrders = Array.isArray(action.payload) ? action.payload : [];
    },
    addMyOrder: (state, action) => {
      const newOrder = action.payload;
      if (!newOrder || !newOrder._id) {
        console.warn("Invalid order:", newOrder);
        return;
      }
      const orderExists = state.myOrders.some((o) => o._id === newOrder._id);
      if (!orderExists) {
        state.myOrders = [newOrder, ...state.myOrders];
      }
    },
    updateOrderStatus: (state, action) => {
      const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);
      if (order) {
        if (order.shopOrders) {
          const target = order.shopOrders.find((so) => (so.shop?._id || so.shop) === shopId);
          if (target) target.status = status;
        } else if (order.shopOrder && (order.shopOrder.shop?._id || order.shopOrder.shop) === shopId) {
          order.shopOrder.status = status;
        }
      }
    },
    updateRealtimeOrderStatus:(state,action)=>{
       const { orderId, shopId, status } = action.payload;
      const order = state.myOrders.find((o) => o._id === orderId);
      if (order) {
       const shopOrder=order.shopOrders.find((so)=>so.shop._id===shopId)
       if(shopOrder){
        shopOrder.status=status
       }
      }
    }

    ,
    setSearchResults:(state,action)=>{
      state.searchResults=action.payload
    },
    addNotification: (state, action) => {
      state.notifications = [{ ...action.payload, id: Date.now(), read: false }, ...state.notifications].slice(0, 20);
    },
    markNotificationsRead: (state) => {
      state.notifications = state.notifications.map(n => ({ ...n, read: true }));
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    setFavoriteItems: (state, action) => {
      state.favoriteItems = Array.isArray(action.payload) ? action.payload : [];
    }
  },
});

export const {
  setUserData,
  setCurrentCity,
  setCurrentState,
  setCurrentAddress,
  setShopsInMyCity,
  setItemsInMyCity,
  setCartItems,
  addToCart,
  updateQuantity,
  removeCartItem,
  clearCart,
  setMyOrders,
  addMyOrder,
  updateOrderStatus,
  setSearchResults
      ,setSocket,
      updateRealtimeOrderStatus,
      addNotification,
      markNotificationsRead,
      clearNotifications,
      setFavoriteItems
} = userSlice.actions;

export default userSlice.reducer;