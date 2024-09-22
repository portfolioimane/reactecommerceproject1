import { createSlice } from '@reduxjs/toolkit';

// Load initial cart state from local storage
const loadCartFromLocalStorage = () => {
  const storedCart = localStorage.getItem('cart');
  return storedCart ? JSON.parse(storedCart) : [];
};

// Initial state of the cart
const initialState = {
  items: loadCartFromLocalStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    getCart: (state) => {
      state.loading = true;
    },
    getCartSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload; // Store fetched items
      localStorage.setItem('cart', JSON.stringify(state.items)); // Save to local storage
    },
    getCartFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Store error message
    },
    addToCart: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(i => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += item.quantity; // Update quantity
      } else {
        state.items.push({ ...item, quantity: item.quantity || 1 }); // Add new item
      }
      localStorage.setItem('cart', JSON.stringify(state.items)); // Save to local storage
    },
    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId); // Remove item
      localStorage.setItem('cart', JSON.stringify(state.items)); // Save to local storage
    },
    clearCart: (state) => {
      state.items = []; // Clear cart
      localStorage.removeItem('cart'); // Remove from local storage
    },
  },
});

// Exporting actions
export const {
  getCart,
  getCartSuccess,
  getCartFailure,
  addToCart,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

// Selector to get the total count of items in the cart
export const selectCartCount = (state) => {
  return state.cart.items.reduce((total, item) => total + item.quantity, 0);
};

// Exporting the reducer
export default cartSlice.reducer;
