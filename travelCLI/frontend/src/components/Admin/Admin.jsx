import React from 'react';
import '../Admin/admin.css'; 

const Admin = () => {
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
          <a href="#" className="sidebar-link">
            <span className="sidebar-icon">👥</span> Users
          </a>
          <a href="#" className="sidebar-link">
            <span className="sidebar-icon">📈</span> Analytics
          </a>
          <a href="#" className="sidebar-link">
            <span className="sidebar-icon">⚙️</span> Settings
          </a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
          </div>
        </header>

        {/* Main */}
        <main className="dashboard-main">
          <h2 className="dashboard-title">Dashboard</h2>
          <div className="stats-grid">
            {/* Stats Card 1 */}
            <div className="stats-card">
              <div className="stats-icon">👥</div>
              <div className="stats-content">
                <h3>Total Users</h3>
                <p>1,234</p>
              </div>
            </div>
            {/* Stats Card 2 */}
            <div className="stats-card">
              <div className="stats-icon">💰</div>
              <div className="stats-content">
                <h3>Revenue</h3>
                <p>$12,345</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="activity-card">
            <h3>Recent Activity</h3>
            <ul>
              <li>User John Doe registered</li>
              <li>Order #1234 placed</li>
              <li>New comment on post</li>
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;