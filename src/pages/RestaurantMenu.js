import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Star, MapPin, Phone, Plus, Check } from 'lucide-react';

const RestaurantMenu = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  const [restaurant, setRestaurant] = useState(null);
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItemMap, setAddedItemMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resDetails, resItems] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/food-items/restaurant/${id}`)
        ]);
        setRestaurant(resDetails.data);
        setFoodItems(resItems.data);
      } catch (err) {
        console.error('Failed to load menu', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = async (item) => {
    if (!user) {
      navigate('/login');
      return;
    }
    const success = await addToCart(item.id, 1);
    if (success) {
      setAddedItemMap(prev => ({ ...prev, [item.id]: true }));
      setTimeout(() => {
        setAddedItemMap(prev => ({ ...prev, [item.id]: false }));
      }, 1200);
    }
  };

  if (loading) {
    return <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>Loading restaurant menu...</div>;
  }

  if (!restaurant) {
    return <div className="container" style={{ padding: '3rem 0', textAlign: 'center' }}>Restaurant not found.</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      {/* Restaurant Header */}
      <div style={{
        background: 'white',
        borderRadius: 'var(--radius)',
        padding: '1.5rem',
        marginBottom: '2rem',
        border: '1px solid var(--border)',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <img
          src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'}
          alt={restaurant.name}
          style={{ width: '180px', height: '140px', objectFit: 'cover', borderRadius: '10px' }}
        />
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>{restaurant.name}</h1>
          <p style={{ color: 'var(--primary)', fontWeight: '600', marginBottom: '0.5rem' }}>{restaurant.cuisine}</p>
          <p style={{ color: 'var(--text-muted)', marginBottom: '0.75rem' }}>{restaurant.description}</p>
          <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={16} /> {restaurant.address}</span>
            {restaurant.phone && <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={16} /> {restaurant.phone}</span>}
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#eab308', fontWeight: '700' }}><Star size={16} fill="#eab308" /> {restaurant.rating}</span>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.25rem' }}>Menu Items</h2>

      {foodItems.length === 0 ? (
        <p style={{ color: 'var(--text-muted)' }}>No items currently available in this menu.</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {foodItems.map(item => (
            <div key={item.id} className="food-card">
              <div className="food-details">
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span className={`food-type-icon ${item.isVegetarian ? 'veg' : 'non-veg'}`}></span>
                  <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>{item.name}</span>
                </div>
                <div style={{ fontWeight: '800', color: 'var(--text-dark)', marginBottom: '0.35rem' }}>
                  ₹{item.price.toFixed(2)}
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.description}</p>
              </div>
              <div className="food-img-container">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                  alt={item.name}
                />
                <button
                  className="food-add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  {addedItemMap[item.id] ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#10b981' }}><Check size={14} /> Added</span>
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}><Plus size={14} /> ADD</span>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantMenu;
