import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getAllEmployees, searchEmployees, deleteEmployee } from '../api/employeeApi'
import { useToast } from '../components/Toast'
import './EmployeeList.css'

const DEPT_BADGE_MAP = {
  Engineering: 'badge-blue',
  Marketing: 'badge-purple',
  HR: 'badge-emerald',
  Sales: 'badge-amber',
  Finance: 'badge-cyan',
  Design: 'badge-rose',
  Operations: 'badge-amber',
  Product: 'badge-purple',
}

function getDeptBadge(dept) {
  return DEPT_BADGE_MAP[dept] || 'badge-blue'
}

function formatSalary(amount) {
  return '₹' + Number(amount).toLocaleString('en-IN')
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ─── Inline SVG Icons ───────────────────────────────────────────

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <path d="M21 21l-4.35-4.35" />
  </svg>
)

const ClearIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6L6 18" />
    <path d="M6 6l12 12" />
  </svg>
)

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
)

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const PencilIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
  </svg>
)

const EmptyIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 00-3-3.87" />
    <path d="M16 3.13a4 4 0 010 7.75" />
  </svg>
)

const WarningIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
)

// ─── Skeleton Rows ──────────────────────────────────────────────

function SkeletonRows({ count = 6 }) {
  return Array.from({ length: count }, (_, i) => (
    <tr key={i} className="el-skeleton-row">
      <td><div className="el-skeleton-cell w-10" /></td>
      <td><div className="el-skeleton-cell w-40" /></td>
      <td><div className="el-skeleton-cell w-60" /></td>
      <td><div className="el-skeleton-cell w-badge" /></td>
      <td><div className="el-skeleton-cell w-30" /></td>
      <td><div className="el-skeleton-cell w-30" /></td>
      <td><div className="el-skeleton-cell w-30" /></td>
      <td><div className="el-skeleton-cell w-actions" /></td>
    </tr>
  ))
}

// ─── Delete Confirmation Modal ──────────────────────────────────

function DeleteModal({ employee, onConfirm, onCancel, isDeleting }) {
  // Close on Escape
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onCancel])

  return (
    <div className="el-modal-overlay" onClick={onCancel}>
      <div className="el-modal" onClick={(e) => e.stopPropagation()}>
        <div className="el-modal-icon">
          <WarningIcon />
        </div>
        <h3>Delete Employee</h3>
        <p>
          Are you sure you want to delete{' '}
          <span className="el-modal-name">
            {employee.firstName} {employee.lastName}
          </span>
          ? This action cannot be undone.
        </p>
        <div className="el-modal-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={isDeleting}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? <span className="spinner" /> : null}
            {isDeleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────

export default function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { addToast } = useToast()
  const navigate = useNavigate()

  // ── Fetch employees ───────────────────────────────────────────
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllEmployees()
      setEmployees(data)
    } catch {
      addToast('Failed to load employees', 'error')
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchEmployees()
  }, [fetchEmployees])

  // ── Search handler (debounced) ────────────────────────────────
  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetchEmployees()
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)
        const data = await searchEmployees(searchQuery)
        setEmployees(data)
      } catch {
        addToast('Search failed', 'error')
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery])

  // ── Delete handler ────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      setIsDeleting(true)
      await deleteEmployee(deleteTarget.id)
      addToast(`${deleteTarget.firstName} ${deleteTarget.lastName} deleted successfully`, 'success')
      setDeleteTarget(null)
      fetchEmployees()
    } catch {
      addToast('Failed to delete employee', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div className="page-enter">
      {/* Header */}
      <div className="el-header">
        <div className="el-header-left">
          <h1>Employees</h1>
          {!loading && (
            <span className="el-count-badge">{employees.length}</span>
          )}
        </div>
        <Link to="/employees/add" className="btn btn-primary">
          <PlusIcon />
          Add Employee
        </Link>
      </div>

      {/* Search Bar */}
      <div className="el-search-wrapper">
        <div className="el-search-bar">
          <span className="el-search-icon">
            <SearchIcon />
          </span>
          <input
            type="text"
            placeholder="Search by name, email, or department…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="el-search-clear" onClick={clearSearch} aria-label="Clear search">
              <ClearIcon />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="el-table-container">
        <div className="el-table-scroll">
          <table className="el-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Phone</th>
                <th>Salary</th>
                <th>Joining Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <SkeletonRows />
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: 0, border: 'none' }}>
                    <div className="el-empty">
                      <div className="el-empty-icon">
                        <EmptyIcon />
                      </div>
                      <h3>No employees found</h3>
                      <p>
                        {searchQuery
                          ? 'No results match your search. Try a different keyword.'
                          : 'Get started by adding your first employee to the system.'}
                      </p>
                      {!searchQuery && (
                        <Link to="/employees/add" className="btn btn-primary">
                          <PlusIcon />
                          Add Employee
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                employees.map((emp, idx) => (
                  <tr key={emp.id}>
                    <td>{idx + 1}</td>
                    <td className="el-name">{emp.firstName} {emp.lastName}</td>
                    <td className="el-email">{emp.email}</td>
                    <td>
                      <span className={`badge ${getDeptBadge(emp.department)}`}>
                        {emp.department}
                      </span>
                    </td>
                    <td>{emp.phone || '—'}</td>
                    <td className="el-salary">{formatSalary(emp.salary)}</td>
                    <td className="el-date">{formatDate(emp.joiningDate)}</td>
                    <td>
                      <div className="el-actions">
                        <button
                          className="btn-icon view"
                          title="View"
                          onClick={() => navigate(`/employees/${emp.id}`)}
                        >
                          <EyeIcon />
                        </button>
                        <button
                          className="btn-icon edit"
                          title="Edit"
                          onClick={() => navigate(`/employees/edit/${emp.id}`)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="btn-icon delete"
                          title="Delete"
                          onClick={() => setDeleteTarget(emp)}
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <DeleteModal
          employee={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  )
}
