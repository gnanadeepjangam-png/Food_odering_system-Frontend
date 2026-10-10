import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { Store, UtensilsCrossed, Users, Package, Plus, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // orders | restaurants | food | users

  // Data states
  const [orders, setOrders] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foodItems, setFoodItems] = useState([]);
  const [users, setUsers] = useState([]);

  // Form states
  const [selectedRestaurantId, setSelectedRestaurantId] = useState('');
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [showAddFood, setShowAddFood] = useState(false);

  const [newRestaurant, setNewRestaurant] = useState({
    name: '', cuisine: '', address: '', description: '', phone: '', imageUrl: '', rating: 4.5
  });

  const [newFood, setNewFood] = useState({
    name: '', description: '', price: '', category: 'Main Course', imageUrl: '', isVegetarian: false
  });

  const fetchData = useCallback(async () => {
    try {
      if (activeTab === 'orders') {
        const res = await api.get('/admin/orders');
        setOrders(res.data);
      } else if (activeTab === 'restaurants') {
        const res = await api.get('/admin/restaurants');
        setRestaurants(res.data);
      } else if (activeTab === 'food') {
        const resRest = await api.get('/admin/restaurants');
        setRestaurants(resRest.data);
        if (resRest.data.length > 0) {
          const restId = selectedRestaurantId || resRest.data[0].id;
          setSelectedRestaurantId(restId);
          const resFood = await api.get(`/food-items/restaurant/${restId}`);
          setFoodItems(resFood.data);
        }
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      }
    } catch (err) {
      console.error('Failed to load admin data', err);
    }
  }, [activeTab, selectedRestaurantId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      fetchData();
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleCreateRestaurant = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/restaurants', newRestaurant);
      setShowAddRestaurant(false);
      setNewRestaurant({ name: '', cuisine: '', address: '', description: '', phone: '', imageUrl: '', rating: 4.5 });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await api.delete(`/admin/restaurants/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCreateFood = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/admin/restaurants/${selectedRestaurantId}/food-items`, {
        ...newFood,
        price: parseFloat(newFood.price)
      });
      setShowAddFood(false);
      setNewFood({ name: '', description: '', price: '', category: 'Main Course', imageUrl: '', isVegetarian: false });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteFood = async (id) => {
    if (window.confirm('Delete this food item?')) {
      try {
        await api.delete(`/admin/food-items/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Delete this user?')) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const statusOptions = ['PENDING', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: '800' }}>Admin Dashboard</h1>
        <p style={{ color: 'var(--text-muted)' }}>Manage restaurants, food items, orders lifecycle and users</p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
        <button
          onClick={() => setActiveTab('orders')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'orders' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: activeTab === 'orders' ? '700' : '600',
            color: activeTab === 'orders' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <Package size={18} />
          <span>Orders Management</span>
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'restaurants' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: activeTab === 'restaurants' ? '700' : '600',
            color: activeTab === 'restaurants' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <Store size={18} />
          <span>Restaurants</span>
        </button>

        <button
          onClick={() => setActiveTab('food')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'food' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: activeTab === 'food' ? '700' : '600',
            color: activeTab === 'food' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <UtensilsCrossed size={18} />
          <span>Food Menus</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.25rem',
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'users' ? '3px solid var(--primary)' : '3px solid transparent',
            fontWeight: activeTab === 'users' ? '700' : '600',
            color: activeTab === 'users' ? 'var(--primary)' : 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <Users size={18} />
          <span>Users</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>All Customer Orders ({orders.length})</h2>

          <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Order ID</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Customer</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Restaurant</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Items</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Amount</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Current Status</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Change Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '700' }}>#{order.id}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div>{order.user?.name}</div>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{order.deliveryPhone || order.user?.email}</span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>{order.restaurant?.name}</td>
                    <td style={{ padding: '1rem 1.25rem', maxWidth: '200px' }}>
                      {order.items?.map(i => `${i.quantity}x ${i.foodItem?.name}`).join(', ')}
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '700' }}>₹{order.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge badge-${order.status.toLowerCase().replace(/_/g, '-')}`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        style={{ padding: '0.35rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border)', fontSize: '0.85rem' }}
                      >
                        {statusOptions.map(st => (
                          <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Restaurants */}
      {activeTab === 'restaurants' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Registered Restaurants ({restaurants.length})</h2>
            <button onClick={() => setShowAddRestaurant(!showAddRestaurant)} className="btn btn-primary">
              <Plus size={16} /> Add Restaurant
            </button>
          </div>

          {showAddRestaurant && (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>New Restaurant</h3>
              <form onSubmit={handleCreateRestaurant} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Restaurant Name</label>
                  <input
                    required
                    className="form-control"
                    value={newRestaurant.name}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Cuisine Type</label>
                  <input
                    required
                    placeholder="e.g. Italian, North Indian, Chinese"
                    className="form-control"
                    value={newRestaurant.cuisine}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, cuisine: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Address</label>
                  <input
                    required
                    className="form-control"
                    value={newRestaurant.address}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={newRestaurant.description}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    className="form-control"
                    value={newRestaurant.phone}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    className="form-control"
                    value={newRestaurant.imageUrl}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, imageUrl: e.target.value })}
                  />
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddRestaurant(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Restaurant</button>
                </div>
              </form>
            </div>
          )}

          <div className="cards-grid">
            {restaurants.map(rest => (
              <div key={rest.id} className="restaurant-card">
                <div className="card-img-wrapper">
                  <img src={rest.imageUrl || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80'} alt={rest.name} />
                </div>
                <div className="card-body">
                  <h3 className="card-title">{rest.name}</h3>
                  <div className="card-cuisine">{rest.cuisine}</div>
                  <p className="card-desc">{rest.description}</p>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                    <button onClick={() => handleDeleteRestaurant(rest.id)} className="btn btn-danger" style={{ fontSize: '0.8rem', padding: '0.35rem 0.65rem' }}>
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Food Items */}
      {activeTab === 'food' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '700' }}>Manage Food Items</h2>
              <select
                className="form-control"
                style={{ width: '250px' }}
                value={selectedRestaurantId}
                onChange={(e) => setSelectedRestaurantId(e.target.value)}
              >
                {restaurants.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <button onClick={() => setShowAddFood(!showAddFood)} className="btn btn-primary">
              <Plus size={16} /> Add Food Item
            </button>
          </div>

          {showAddFood && (
            <div style={{ background: 'white', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1rem' }}>New Food Item</h3>
              <form onSubmit={handleCreateFood} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Item Name</label>
                  <input
                    required
                    className="form-control"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="form-control"
                    value={newFood.price}
                    onChange={(e) => setNewFood({ ...newFood, price: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Description</label>
                  <textarea
                    rows={2}
                    className="form-control"
                    value={newFood.description}
                    onChange={(e) => setNewFood({ ...newFood, description: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Category</label>
                  <input
                    placeholder="Starters, Main Course, Desserts"
                    className="form-control"
                    value={newFood.category}
                    onChange={(e) => setNewFood({ ...newFood, category: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input
                    className="form-control"
                    value={newFood.imageUrl}
                    onChange={(e) => setNewFood({ ...newFood, imageUrl: e.target.value })}
                  />
                </div>
                <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
                  <input
                    type="checkbox"
                    id="veg"
                    checked={newFood.isVegetarian}
                    onChange={(e) => setNewFood({ ...newFood, isVegetarian: e.target.checked })}
                  />
                  <label htmlFor="veg" style={{ marginBottom: 0, cursor: 'pointer' }}>Vegetarian Dish</label>
                </div>
                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddFood(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Food Item</button>
                </div>
              </form>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {foodItems.map(item => (
              <div key={item.id} className="food-card">
                <div className="food-details">
                  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className={`food-type-icon ${item.isVegetarian ? 'veg' : 'non-veg'}`}></span>
                    <strong style={{ fontSize: '1rem' }}>{item.name}</strong>
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--text-dark)', marginBottom: '0.25rem' }}>₹{item.price.toFixed(2)}</div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{item.description}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                    alt={item.name}
                    style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                  />
                  <button onClick={() => handleDeleteFood(item.id)} className="btn btn-danger" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Users */}
      {activeTab === 'users' && (
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.25rem' }}>Registered Users ({users.length})</h2>

          <div style={{ background: 'white', borderRadius: 'var(--radius)', border: '1px solid var(--border)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
              <thead style={{ background: '#f8fafc', borderBottom: '1px solid var(--border)' }}>
                <tr>
                  <th style={{ padding: '0.85rem 1.25rem' }}>User ID</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Name</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Email</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Role</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Phone</th>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.25rem' }}>#{u.id}</td>
                    <td style={{ padding: '1rem 1.25rem', fontWeight: '600' }}>{u.name}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span className={`badge ${u.role === 'ROLE_ADMIN' ? 'badge-confirmed' : 'badge-delivered'}`}>
                        {u.role.replace('ROLE_', '')}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', color: 'var(--text-muted)' }}>{u.phone || 'N/A'}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button onClick={() => handleDeleteUser(u.id)} className="btn btn-danger" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}>
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
