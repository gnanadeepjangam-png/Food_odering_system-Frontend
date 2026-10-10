import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ChevronRight, ShoppingBag } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>Loading your orders...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ background: 'white', maxWidth: '500px', margin: '0 auto', padding: '3rem 2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <ShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>No orders yet</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>You haven't placed any food orders yet.</p>
          <Link to="/" className="btn btn-primary">Find Restaurants</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '850px' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '1.5rem' }}>Your Order History</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {orders.map(order => (
          <div key={order.id} style={{
            background: 'white',
            borderRadius: 'var(--radius)',
            padding: '1.5rem',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>{order.restaurant?.name || 'Restaurant Order'}</h3>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <span className={`badge badge-${order.status.toLowerCase().replace(/_/g, '-')}`}>
                {order.status.replace(/_/g, ' ')}
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              {order.items?.map(i => `${i.quantity}x ${i.foodItem?.name}`).join(', ')}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Total Amount: </span>
                <strong style={{ fontSize: '1.05rem', color: 'var(--text-dark)' }}>₹{order.totalAmount.toFixed(2)}</strong>
              </div>

              <Link to={`/orders/${order.id}`} className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                <span>Track / View Order</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
