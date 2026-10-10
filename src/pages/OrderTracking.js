import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, Clock, ChefHat, Bike, Home as HomeIcon, XCircle, ArrowLeft } from 'lucide-react';

const OrderTracking = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error('Failed to fetch order', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000); // Polling order updates
    return () => clearInterval(interval);
  }, [fetchOrder]);

  if (loading) {
    return <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>Loading order status...</div>;
  }

  if (!order) {
    return <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>Order not found.</div>;
  }

  const steps = [
    { key: 'PENDING', label: 'Order Placed', icon: Clock },
    { key: 'CONFIRMED', label: 'Confirmed', icon: CheckCircle2 },
    { key: 'PREPARING', label: 'Preparing Food', icon: ChefHat },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', icon: Bike },
    { key: 'DELIVERED', label: 'Delivered', icon: HomeIcon }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === order.status);
  const isCancelled = order.status === 'CANCELLED';

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem', maxWidth: '850px' }}>
      <Link to="/orders" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '1.5rem', fontWeight: '600' }}>
        <ArrowLeft size={16} /> Back to My Orders
      </Link>

      <div style={{ background: 'white', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order #{order.id}</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800' }}>{order.restaurant?.name || 'Restaurant Order'}</h1>
          </div>
          <span className={`badge badge-${order.status.toLowerCase().replace(/_/g, '-')}`} style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
            {order.status.replace(/_/g, ' ')}
          </span>
        </div>

        {/* Stepper */}
        {!isCancelled ? (
          <div className="stepper-container">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              const isCompleted = currentStepIndex > idx;
              const isActive = currentStepIndex === idx;
              const statusClass = isCompleted ? 'completed' : isActive ? 'active' : '';

              return (
                <div key={step.key} className={`step-item ${statusClass}`}>
                  <div className="step-circle">
                    <StepIcon size={18} />
                  </div>
                  <span className="step-label">{step.label}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '1.25rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <XCircle size={24} />
            <div>
              <strong>Order Cancelled</strong>
              <p style={{ fontSize: '0.85rem' }}>This order has been cancelled.</p>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.75rem' }}>Items Ordered</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {order.items?.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dark)' }}>
                  <span>{item.quantity} x {item.foodItem?.name}</span>
                  <span style={{ fontWeight: '600' }}>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.6rem', marginTop: '0.4rem', display: 'flex', justifyContent: 'space-between', fontWeight: '800' }}>
                <span>Total Amount Paid</span>
                <span style={{ color: 'var(--primary)' }}>₹{order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', marginBottom: '0.75rem' }}>Delivery Information</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
              <strong>Address:</strong> {order.deliveryAddress}
            </p>
            {order.deliveryPhone && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                <strong>Phone:</strong> {order.deliveryPhone}
              </p>
            )}
            {order.specialInstructions && (
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <strong>Note:</strong> {order.specialInstructions}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
