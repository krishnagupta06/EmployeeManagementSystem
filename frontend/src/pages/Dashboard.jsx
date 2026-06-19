import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { getAllEmployees } from '../api/employeeApi';
import { useToast } from '../components/Toast';
import './Dashboard.css';

// ---------- helpers ----------
function formatSalary(num) {
  if (!num && num !== 0) return '₹0';
  return '₹' + Number(num).toLocaleString('en-IN');
}

function getInitials(first = '', last = '') {
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
}

const avatarColors = [
  'var(--gradient-blue)',
  'var(--gradient-purple)',
  'var(--gradient-emerald)',
  'var(--gradient-amber)',
  'var(--gradient-rose)',
];

function avatarBg(id) {
  return avatarColors[(id ?? 0) % avatarColors.length];
}

const deptBadgeMap = {
  Engineering: 'badge-blue',
  Design: 'badge-purple',
  Marketing: 'badge-amber',
  HR: 'badge-emerald',
  Finance: 'badge-rose',
  Sales: 'badge-cyan',
};

function deptBadge(dept) {
  return deptBadgeMap[dept] || 'badge-blue';
}

// ---------- component ----------
export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await getAllEmployees();
        if (!cancelled) setEmployees(data);
      } catch {
        if (!cancelled) addToast('Failed to load dashboard data', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derived stats
  const stats = useMemo(() => {
    const total = employees.length;
    const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))].length;
    const avgSalary = total
      ? Math.round(employees.reduce((sum, e) => sum + (Number(e.salary) || 0), 0) / total)
      : 0;

    const now = new Date();
    const newThisMonth = employees.filter((e) => {
      if (!e.joiningDate) return false;
      const d = new Date(e.joiningDate);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    return { total, departments, avgSalary, newThisMonth };
  }, [employees]);

  const recentEmployees = useMemo(() => {
    return [...employees]
      .sort((a, b) => new Date(b.joiningDate || b.createdAt) - new Date(a.joiningDate || a.createdAt))
      .slice(0, 5);
  }, [employees]);

  // ---------- skeleton ----------
  if (loading) {
    return (
      <div className="page-enter">
        <div className="dashboard-header">
          <div className="skeleton skeleton-text" style={{ width: 200, height: 28 }} />
          <div className="skeleton skeleton-text short" style={{ marginTop: 8, width: 300, height: 14 }} />
        </div>

        <div className="skeleton-stats">
          {[1, 2, 3, 4].map((i) => (
            <div className="skeleton-stat-card glass-card" key={i}>
              <div className="skeleton skeleton-stat-icon" />
              <div className="skeleton-stat-lines">
                <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                <div className="skeleton skeleton-text" style={{ width: '70%', height: 28 }} />
                <div className="skeleton skeleton-text" style={{ width: '80%' }} />
              </div>
            </div>
          ))}
        </div>

        <div className="dashboard-grid">
          <div className="glass-card dashboard-section" style={{ opacity: 1 }}>
            <div className="section-header">
              <div className="skeleton skeleton-text" style={{ width: 160 }} />
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div className="skeleton-table-row" key={i}>
                <div className="skeleton skeleton-circle" style={{ width: 34, height: 34 }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                  <div className="skeleton skeleton-text" style={{ width: '60%', height: 10 }} />
                </div>
                <div className="skeleton skeleton-text" style={{ width: 60 }} />
              </div>
            ))}
          </div>
          <div className="glass-card dashboard-section" style={{ opacity: 1 }}>
            <div className="section-header">
              <div className="skeleton skeleton-text" style={{ width: 120 }} />
            </div>
            <div className="quick-actions-list">
              {[1, 2].map((i) => (
                <div key={i} style={{ display: 'flex', gap: 14, padding: 16, alignItems: 'center' }}>
                  <div className="skeleton" style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                    <div className="skeleton skeleton-text" style={{ width: '80%', height: 10 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- render ----------
  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back — here's what's happening with your team today.</p>
      </div>

      {/* Stat Cards */}
      <div className="dashboard-stats">
        {/* Total Employees */}
        <div className="stat-card glass-card">
          <div className="stat-icon blue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Employees</span>
            <span className="stat-value">{stats.total}</span>
            <span className="stat-desc">
              <span className="trend up">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M7 17l5-5 5 5"/><path d="M7 7h10"/></svg>
              </span>
              Active workforce
            </span>
          </div>
        </div>

        {/* Departments */}
        <div className="stat-card glass-card">
          <div className="stat-icon purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Departments</span>
            <span className="stat-value">{stats.departments}</span>
            <span className="stat-desc">Across the organization</span>
          </div>
        </div>

        {/* Average Salary */}
        <div className="stat-card glass-card">
          <div className="stat-icon emerald">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="1" x2="12" y2="23" />
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">Average Salary</span>
            <span className="stat-value">{formatSalary(stats.avgSalary)}</span>
            <span className="stat-desc">Per employee / month</span>
          </div>
        </div>

        {/* New This Month */}
        <div className="stat-card glass-card">
          <div className="stat-icon amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="12" y1="14" x2="12" y2="18" />
              <line x1="10" y1="16" x2="14" y2="16" />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-label">New This Month</span>
            <span className="stat-value">{stats.newThisMonth}</span>
            <span className="stat-desc">
              Joined in {new Date().toLocaleString('default', { month: 'long' })}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="dashboard-grid">
        {/* Recent Employees Table */}
        <div className="glass-card dashboard-section">
          <div className="section-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v4l3 3" />
                <circle cx="12" cy="12" r="10" />
              </svg>
              Recent Employees
            </h2>
            <Link to="/employees" className="view-all-link">
              View all
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
            </Link>
          </div>

          {recentEmployees.length === 0 ? (
            <div className="dashboard-empty">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="11" x2="23" y2="11" />
              </svg>
              <h3>No employees yet</h3>
              <p>Add your first employee to get started and see them listed here.</p>
              <Link to="/employees/add" className="btn btn-primary" style={{ marginTop: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add Employee
              </Link>
            </div>
          ) : (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Salary</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-name-cell">
                        <div
                          className="employee-avatar"
                          style={{ background: avatarBg(emp.id) }}
                        >
                          {getInitials(emp.firstName, emp.lastName)}
                        </div>
                        <div className="employee-name-text">
                          <strong>{emp.firstName} {emp.lastName}</strong>
                          <span>{emp.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${deptBadge(emp.department)}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td>{formatSalary(emp.salary)}</td>
                    <td>
                      {emp.joiningDate
                        ? new Date(emp.joiningDate).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td>
                      <Link to={`/employees/${emp.id}`} className="table-view-link">
                        View
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="M12 5l7 7-7 7"/></svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass-card dashboard-section delay-2">
          <div className="section-header">
            <h2>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Quick Actions
            </h2>
          </div>

          <div className="quick-actions-list">
            <Link to="/employees/add" className="quick-action-card">
              <div className="qa-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <div className="qa-info">
                <h3>Add Employee</h3>
                <p>Register a new team member</p>
              </div>
              <span className="qa-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            </Link>

            <Link to="/employees" className="quick-action-card">
              <div className="qa-icon purple">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="8" y1="6" x2="21" y2="6" />
                  <line x1="8" y1="12" x2="21" y2="12" />
                  <line x1="8" y1="18" x2="21" y2="18" />
                  <line x1="3" y1="6" x2="3.01" y2="6" />
                  <line x1="3" y1="12" x2="3.01" y2="12" />
                  <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
              </div>
              <div className="qa-info">
                <h3>View All Employees</h3>
                <p>Browse &amp; manage your team</p>
              </div>
              <span className="qa-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
