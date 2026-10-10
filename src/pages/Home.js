import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Search, Star, MapPin } from 'lucide-react';

const Home = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async (search = '') => {
    try {
      setLoading(true);
      const endpoint = search ? `/restaurants/search?query=${search}` : '/restaurants';
      const res = await api.get(endpoint);
      setRestaurants(res.data);
    } catch (err) {
      console.error('Failed to load restaurants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRestaurants(searchTerm);
  };

  return (
    <div>
      <div className="hero-section">
        <div className="container">
          <h1 className="hero-title">Delicious Food, Delivered Fast.</h1>
          <p className="hero-subtitle">
            Explore curated menus from top-rated local restaurants and get your favorite dishes delivered to your doorstep.
          </p>
          <form onSubmit={handleSearch} className="search-bar-container">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>
      </div>

      <div className="container">
        <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Featured Restaurants</h2>
          <span style={{ color: 'var(--text-muted)' }}>{restaurants.length} places available</span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading restaurants...</div>
        ) : (
          <div className="cards-grid">
            {restaurants.map((restaurant) => (
              <Link to={`/restaurant/${restaurant.id}`} key={restaurant.id} className="restaurant-card">
                <div className="card-img-wrapper">
                  <img src={restaurant.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'} alt={restaurant.name} />
                  <div className="card-rating-badge">
                    <Star size={14} fill="#facc15" />
                    <span>{restaurant.rating || '4.5'}</span>
                  </div>
                </div>
                <div className="card-body">
                  <h3 className="card-title">{restaurant.name}</h3>
                  <div className="card-cuisine">{restaurant.cuisine}</div>
                  <p className="card-desc">{restaurant.description}</p>
                  <div className="card-footer">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} />
                      <span style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {restaurant.address}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
