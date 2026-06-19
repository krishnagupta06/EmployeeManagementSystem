import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getEmployeeById, deleteEmployee } from '../api/employeeApi'
import { useToast } from '../components/Toast'
import './ViewEmployee.css'

function ViewEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchEmployee()
  }, [id])

  const fetchEmployee = async () => {
    setLoading(true)
    setNotFound(false)
    try {
      const data = await getEmployeeById(id)
      if (!data) {
        setNotFound(true)
      } else {
        setEmployee(data)
      }
    } catch {
      setNotFound(true)
      addToast('Failed to load employee data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteEmployee(id)
      addToast('Employee deleted successfully', 'success')
      navigate('/employees')
    } catch {
      addToast('Failed to delete employee', 'error')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const getInitials = (firstName, lastName) => {
    return `${(firstName || '')[0] || ''}${(lastName || '')[0] || ''}`.toUpperCase()
  }

  const formatSalary = (salary) => {
    if (!salary && salary !== 0) return '—'
    return '₹' + Number(salary).toLocaleString('en-IN')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // --- Icons ---
  const icons = {
    email: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 6L2 7" />
      </svg>
    ),
    phone: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
    building: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="2" width="16" height="20" rx="2" />
        <path d="M9 22V12h6v10" />
        <path d="M8 6h.01M16 6h.01M12 6h.01M8 10h.01M16 10h.01M12 10h.01" />
      </svg>
    ),
    money: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    calendar: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    hash: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="9" x2="20" y2="9" />
        <line x1="4" y1="15" x2="20" y2="15" />
        <line x1="10" y1="3" x2="8" y2="21" />
        <line x1="16" y1="3" x2="14" y2="21" />
      </svg>
    ),
    clock: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    edit: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
      </svg>
    ),
    back: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    ),
    trash: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    ),
    warning: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    notFound: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="11" x2="14" y2="11" />
      </svg>
    ),
  }

  // --- Loading Skeleton ---
  if (loading) {
    return (
      <div className="view-employee-page page-enter">
        <div className="ve-skeleton">
          <div className="ve-skeleton-card">
            <div className="ve-skeleton-header">
              <div className="skeleton skeleton-circle ve-skeleton-avatar" />
              <div className="skeleton ve-skeleton-name" />
              <div className="skeleton ve-skeleton-badge" />
            </div>
            <div className="ve-skeleton-body">
              <div className="skeleton skeleton-text short" />
              <div className="ve-skeleton-grid">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="skeleton ve-skeleton-item" />
                ))}
              </div>
              <div className="ve-skeleton-actions">
                <div className="skeleton ve-skeleton-btn" />
                <div className="skeleton ve-skeleton-btn" />
                <div className="skeleton ve-skeleton-btn" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // --- Not Found State ---
  if (notFound || !employee) {
    return (
      <div className="view-employee-page page-enter">
        <div className="ve-not-found">
          <div className="ve-not-found-card">
            <div className="ve-not-found-icon">
              {icons.notFound}
            </div>
            <h2>Employee Not Found</h2>
            <p>
              The employee you're looking for doesn't exist or may have been removed.
              Please check the ID and try again.
            </p>
            <Link to="/employees" className="btn btn-primary">
              {icons.back}
              Back to Employees
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // --- Detail items config ---
  const details = [
    {
      icon: icons.email,
      iconColor: 'blue',
      label: 'Email',
      value: employee.email || '—',
    },
    {
      icon: icons.phone,
      iconColor: 'emerald',
      label: 'Phone',
      value: employee.phone || '—',
    },
    {
      icon: icons.building,
      iconColor: 'purple',
      label: 'Department',
      value: employee.department || '—',
    },
    {
      icon: icons.money,
      iconColor: 'amber',
      label: 'Salary',
      value: formatSalary(employee.salary),
    },
    {
      icon: icons.calendar,
      iconColor: 'cyan',
      label: 'Joining Date',
      value: formatDate(employee.joiningDate),
    },
    {
      icon: icons.hash,
      iconColor: 'rose',
      label: 'Employee ID',
      value: `#${employee.id}`,
    },
    {
      icon: icons.clock,
      iconColor: 'blue',
      label: 'Created At',
      value: formatDateTime(employee.createdAt),
    },
    {
      icon: icons.clock,
      iconColor: 'purple',
      label: 'Updated At',
      value: formatDateTime(employee.updatedAt),
    },
  ]

  return (
    <div className="view-employee-page page-enter">
      <div className="ve-profile-card">
        {/* --- Header --- */}
        <div className="ve-header">
          <div className="ve-avatar">
            {getInitials(employee.firstName, employee.lastName)}
          </div>
          <h1 className="ve-name">
            {employee.firstName} {employee.lastName}
          </h1>
          {employee.department && (
            <span className="ve-department-badge">
              {icons.building}
              {employee.department}
            </span>
          )}
        </div>

        {/* --- Body --- */}
        <div className="ve-body">
          <div className="ve-section-title">Employee Details</div>

          <div className="ve-details-grid">
            {details.map((detail, index) => (
              <div className="ve-detail-item" key={index}>
                <div className={`ve-detail-icon ${detail.iconColor}`}>
                  {detail.icon}
                </div>
                <div className="ve-detail-info">
                  <span className="ve-detail-label">{detail.label}</span>
                  <span className="ve-detail-value">{detail.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* --- Action Buttons --- */}
          <div className="ve-actions">
            <Link to={`/employees/edit/${employee.id}`} className="btn btn-primary">
              {icons.edit}
              Edit
            </Link>
            <Link to="/employees" className="btn btn-secondary">
              {icons.back}
              Back to List
            </Link>
            <div className="ve-actions-spacer" />
            <button
              className="btn btn-danger"
              onClick={() => setShowDeleteModal(true)}
            >
              {icons.trash}
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* --- Delete Confirmation Modal --- */}
      {showDeleteModal && (
        <div className="ve-modal-overlay" onClick={() => !deleting && setShowDeleteModal(false)}>
          <div className="ve-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ve-modal-icon">
              {icons.warning}
            </div>
            <h3>Delete Employee</h3>
            <p>
              Are you sure you want to delete <strong>{employee.firstName} {employee.lastName}</strong>?
              This action cannot be undone.
            </p>
            <div className="ve-modal-actions">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? <span className="spinner" /> : icons.trash}
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ViewEmployee
