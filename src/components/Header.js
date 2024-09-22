import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/authSlice';
import { selectCartCount } from '../redux/cartSlice';
import { FaShoppingCart } from 'react-icons/fa';
import CartPage from '../pages/CartPage';
import './Header.css'; // Ensure you import your CSS file

const Header = () => {
  const token = useSelector((state) => state.auth.token);
  const cartCount = useSelector(selectCartCount);
  const dispatch = useDispatch();
  
  // State to manage the modal visibility
  const [showCartModal, setShowCartModal] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleCartClick = () => {
    setShowCartModal(true);
  };

  const handleClose = () => {
    setShowCartModal(false);
  };

  return (
    <>
  <Navbar bg="light" variant="light" expand="lg" className="shadow">
  <Navbar.Brand as={Link} to="/">E-Shop</Navbar.Brand>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
    <Nav>
      <Nav.Link as={Link} to="/shop">Shop</Nav.Link>
      <Nav.Link as={Link} to="/orders">Orders</Nav.Link>
      <Nav.Link onClick={handleCartClick} className="d-flex align-items-center">
        <FaShoppingCart size={20} />
        {token && cartCount > 0 && <span className="cart-count">{cartCount}</span>}
      </Nav.Link>
      {!token ? (
        <>
          <Nav.Link as={Link} to="/login">Login</Nav.Link>
          <Nav.Link as={Link} to="/register">Register</Nav.Link>
        </>
      ) : (
        <Nav.Link as={Link} to="/" onClick={handleLogout}>Logout</Nav.Link>
      )}
    </Nav>
  </Navbar.Collapse>
</Navbar>


      {/* Cart Modal */}
      <Modal 
        show={showCartModal} 
        onHide={handleClose} 
        dialogClassName="cart-modal"
        aria-labelledby="cart-modal-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="cart-modal-title">Your Cart</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CartPage />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Header;
