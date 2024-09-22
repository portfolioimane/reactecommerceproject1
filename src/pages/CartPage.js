import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCart, getCartSuccess, getCartFailure, removeFromCart } from '../redux/cartSlice';
import axios from '../axios';
import './CartPage.css';

const CartPage = () => {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items || []);
  const loading = useSelector(state => state.cart.loading);
  const error = useSelector(state => state.cart.error);

  useEffect(() => {
    const fetchCart = async () => {
      dispatch(getCart());
      try {
        const response = await axios.get('/api/cart');
        const items = response.data.items || [];
        dispatch(getCartSuccess(items));
      } catch (err) {
        dispatch(getCartFailure(err.message));
      }
    };

    fetchCart();
  }, [dispatch]);

  const handleRemoveFromCart = async (id) => {
    try {
      await axios.delete(`/api/cart/${id}`);
      dispatch(removeFromCart(id));
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const calculateTotalPrice = () => {
    return cart.reduce((total, item) => total + (Number(item.price) * item.quantity), 0);
  };

  const totalPrice = calculateTotalPrice().toFixed(2); // Format to two decimal places

  if (loading) return <p className="loading">Loading cart...</p>;
  if (error) return <p className="error">Error loading cart: {error}</p>;

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p className="empty-cart">Cart is empty</p>
      ) : (
        <>
          <ul className="cart-list">
            {cart.map(item => (
              <li key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-details">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  <p>Price: {Number(item.price).toFixed(2)} MAD</p> {/* Ensure price is a number */}
                </div>
                <button className="remove-button" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div className="total-price">
            <h3>Total Price: {totalPrice} MAD</h3>
          </div>
          <button className="checkout-button" onClick={() => {/* Handle checkout logic here */}}>
            Proceed to Checkout
          </button>
        </>
      )}
    </div>
  );
};

export default CartPage;
