import React, { useState, useEffect } from 'react';
import '../Admin/admin.css';

const Admin = () => {
  // State quản lý dữ liệu
  const [stats, setStats] = useState({
    totalUsers: 0,
    revenue: 0,
    orders: 0,
    feedback: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch dữ liệu từ API giả lập
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Giả lập API call
        const statsData = {
          totalUsers: 1234,
          revenue: 12345,
          orders: 567,
          feedback: 4.8,
        };
        const activityData = [
          'User John Doe registered',
          'Order #1234 placed',
          'New comment on post',
          'User Jane Smith updated profile',
        ];

        // Cập nhật state
        setStats(statsData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Xử lý các hành động nhanh
  const handleQuickAction = (action) => {
    alert(`Action performed: ${action}`);
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Admin Panel</h1>
        </div>
        <nav className="sidebar-nav">
          <a href="/admin-dashboard" className="sidebar-link">
            <span className="sidebar-icon">📊</span> Dashboard
          </a>
          <a href="/admin-users" className="sidebar-link">
            <span className="sidebar-icon">👥</span> Users
          </a>
          <a href="/admin-analytics" className="sidebar-link">
            <span className="sidebar-icon">📈</span> Analytics
          </a>
          <a href="/admin-settings" className="sidebar-link">
            <span className="sidebar-icon">⚙️</span> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h2>Welcome, Admin</h2>
          </div>
        </header>

        {/* Main */}
        <main className="dashboard-main">
          <h2 className="dashboard-title">Dashboard Overview</h2>

          {/* Stats Grid */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="stats-grid">
              <div className="stats-card">
                <div className="stats-icon">👥</div>
                <div className="stats-content">
                  <h3>Total Users</h3>
                  <p>{stats.totalUsers}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon">💰</div>
                <div className="stats-content">
                  <h3>Revenue</h3>
                  <p>${stats.revenue}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon">📦</div>
                <div className="stats-content">
                  <h3>Orders</h3>
                  <p>{stats.orders}</p>
                </div>
              </div>
              <div className="stats-card">
                <div className="stats-icon">⭐</div>
                <div className="stats-content">
                  <h3>Feedback</h3>
                  <p>{stats.feedback}/5</p>
                </div>
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="activity-card">
            <h3>Recent Activity</h3>
            <ul>
              {recentActivity.map((activity, index) => (
                <li key={index}>{activity}</li>
              ))}
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions-grid">
              <button
                className="action-button"
                onClick={() => handleQuickAction('Add User')}
              >
                Add User
              </button>
              <button
                className="action-button"
                onClick={() => handleQuickAction('Generate Report')}
              >
                Generate Report
              </button>
              <button
                className="action-button"
                onClick={() => handleQuickAction('View Logs')}
              >
                View Logs
              </button>
              <button
                className="action-button"
                onClick={() => handleQuickAction('Manage Settings')}
              >
                Manage Settings
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;