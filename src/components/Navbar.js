import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Utensils, ShoppingBag, LogOut, LayoutDashboard, Clock } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <Utensils size={28} />
          <span>Foodies</span>
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">Restaurants</Link>
          
          {user ? (
            <>
              {isAdmin ? (
                <Link to="/admin" className="nav-link" style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                  <LayoutDashboard size={18} />
                  <span>Admin Panel</span>
                </Link>
              ) : (
                <>
                  <Link to="/orders" className="nav-link">
                    <Clock size={18} />
                    <span>My Orders</span>
                  </Link>
                  <Link to="/cart" className="cart-icon-btn">
                    <ShoppingBag size={20} />
                    {cartCount > 0 && <span className="cart-badge-count">{cartCount}</span>}
                  </Link>
                </>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
