import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { MapPin, ShieldCheck } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryPhone, setDeliveryPhone] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!cart.items || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const deliveryFee = 40.0;
  const taxes = Number((cartTotal * 0.05).toFixed(2));
  const grandTotal = Number((cartTotal + deliveryFee + taxes).toFixed(2));

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!deliveryAddress) {
      setError('Please provide a delivery address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await api.post('/orders', {
        deliveryAddress,
        deliveryPhone,
        specialInstructions
      });
      clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      console.error('Order placement failed:', err);
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>Checkout & Delivery</h1>

      {error && (
        <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MapPin size={20} color="var(--primary)" />
            Delivery Address
          </h2>

          <div className="form-group">
            <label>Complete Street Address *</label>
            <textarea
              required
              rows={3}
              className="form-control"
              placeholder="Flat / Building name, Street, Landmark, Area, City & Pincode"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Contact Phone Number</label>
            <div style={{ position: 'relative' }}>
              <input
                type="tel"
                className="form-control"
                placeholder="10-digit mobile number"
                value={deliveryPhone}
                onChange={(e) => setDeliveryPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Special Instructions (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Leave with security / Ring the bell twice"
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
            />
          </div>
        </div>

        {/* Order Summary & Confirm */}
        <div style={{ background: 'white', padding: '1.75rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem' }}>Order Total Summary</h2>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Items ({cart.items.length})</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>
            <span>Delivery & Taxes</span>
            <span>₹{(deliveryFee + taxes).toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '1.2rem', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.75rem' }}>
            <span>Amount to Pay</span>
            <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', color: '#16a34a', fontSize: '0.85rem' }}>
            <ShieldCheck size={18} />
            <span>Cash on Delivery / UPI on Delivery enabled</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem' }}
          >
            {loading ? 'Processing Order...' : `Confirm & Place Order (₹${grandTotal.toFixed(2)})`}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
