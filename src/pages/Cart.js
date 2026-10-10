import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          maxWidth: '500px',
          margin: '0 auto',
          padding: '3rem 2rem',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border)'
        }}>
          <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Your cart is empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/" className="btn btn-primary">Browse Restaurants</Link>
        </div>
      </div>
    );
  }

  const deliveryFee = 40.0;
  const taxes = Number((cartTotal * 0.05).toFixed(2));
  const grandTotal = Number((cartTotal + deliveryFee + taxes).toFixed(2));

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>Your Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '2rem' }}>
        {/* Cart Items List */}
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
            Selected Items ({cart.items.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {cart.items.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={item.foodItem.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.foodItem.name}
                    style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <div>
                    <h4 style={{ fontWeight: '700', fontSize: '1rem' }}>{item.foodItem.name}</h4>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>₹{item.foodItem.price.toFixed(2)} each</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      style={{ padding: '0.35rem 0.6rem', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ padding: '0 0.5rem', fontWeight: '700', fontSize: '0.9rem' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      style={{ padding: '0.35rem 0.6rem', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <span style={{ fontWeight: '700', minWidth: '70px', textAlign: 'right' }}>
                    ₹{(item.foodItem.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bill Summary */}
        <div>
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1.25rem' }}>Bill Details</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Item Total</span>
                <span>₹{cartTotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Delivery Fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Govt Taxes & Charges (5%)</span>
                <span>₹{taxes.toFixed(2)}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', margin: '0.5rem 0' }}></div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.15rem' }}>
                <span>To Pay</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
