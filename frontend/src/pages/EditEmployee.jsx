import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { getEmployeeById, updateEmployee } from '../api/employeeApi'
import { useToast } from '../components/Toast'
import './EditEmployee.css'

const DEPARTMENTS = [
  'Engineering',
  'Marketing',
  'HR',
  'Sales',
  'Finance',
  'Design',
  'Operations',
  'Product',
]

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  department: '',
  salary: '',
  joiningDate: '',
}

function validate(form) {
  const errors = {}

  if (!form.firstName.trim()) errors.firstName = 'First name is required'
  if (!form.lastName.trim()) errors.lastName = 'Last name is required'

  if (!form.email.trim()) {
    errors.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address'
  }

  if (!form.phone.trim()) {
    errors.phone = 'Phone number is required'
  } else if (!/^\d{10}$/.test(String(form.phone).replace(/\D/g, ''))) {
    errors.phone = 'Phone must be exactly 10 digits'
  }

  if (!form.department) errors.department = 'Please select a department'

  if (!form.salary && form.salary !== 0) {
    errors.salary = 'Salary is required'
  } else if (Number(form.salary) <= 0) {
    errors.salary = 'Salary must be greater than 0'
  }

  if (!form.joiningDate) errors.joiningDate = 'Joining date is required'

  return errors
}

const ErrorIcon = () => (
  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none" />
    <path d="M10 6.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
  </svg>
)

function FormSkeleton() {
  return (
    <div className="form-skeleton">
      {Array.from({ length: 7 }).map((_, i) => (
        <div className="skeleton-field" key={i}>
          <div className="skeleton skeleton-label" />
          <div className="skeleton skeleton-input" />
        </div>
      ))}
      <div className="skeleton-btn-row">
        <div className="skeleton skeleton-btn" style={{ borderRadius: 'var(--radius-sm)' }} />
        <div className="skeleton skeleton-btn" style={{ borderRadius: 'var(--radius-sm)' }} />
      </div>
    </div>
  )
}

export default function EditEmployee() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function fetchEmployee() {
      setLoading(true)
      setFetchError(null)
      try {
        const data = await getEmployeeById(id)
        if (cancelled) return
        // Normalise joining date to YYYY-MM-DD for the date input
        let joiningDate = data.joiningDate || ''
        if (joiningDate && !joiningDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
          const d = new Date(joiningDate)
          if (!isNaN(d)) {
            joiningDate = d.toISOString().split('T')[0]
          }
        }
        setForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          department: data.department || '',
          salary: data.salary != null ? String(data.salary) : '',
          joiningDate,
        })
      } catch (err) {
        if (!cancelled) {
          setFetchError(err?.response?.data?.message || 'Failed to load employee data')
          addToast('Could not load employee data', 'error')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchEmployee()
    return () => { cancelled = true }
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleBlur = (e) => {
    const { name } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    const fieldErrors = validate(form)
    if (fieldErrors[name]) {
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(form)
    setErrors(validationErrors)
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      department: true,
      salary: true,
      joiningDate: true,
    })

    if (Object.keys(validationErrors).length > 0) {
      addToast('Please fix the errors before submitting', 'warning')
      return
    }

    setSubmitting(true)
    try {
      await updateEmployee(id, {
        ...form,
        salary: Number(form.salary),
      })
      addToast('Employee updated successfully!', 'success')
      navigate('/employees')
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to update employee', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const showError = (field) => touched[field] && errors[field]

  return (
    <div className="page-enter employee-form-page">
      {/* Header */}
      <div className="employee-form-header">
        <Link to="/employees" className="employee-form-back" title="Back to employees">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15l-5-5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="employee-form-header-text">
          <h1>Edit Employee</h1>
          <p>Update the employee's information below</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="glass-card employee-form-card">
        {loading ? (
          <FormSkeleton />
        ) : fetchError ? (
          <div className="fetch-error-container">
            <div className="fetch-error-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Unable to Load Employee</h2>
            <p>{fetchError}</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <Link to="/employees" className="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 10H5M5 10l4-4M5 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Go Back
              </Link>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M4 10a6 6 0 0110.65-3.83M16 10a6 6 0 01-10.65 3.83" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M15 3v4h-4M5 17v-4h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Retry
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className="employee-form-grid">
              {/* --- Personal Info Section --- */}
              <div className="form-section-label">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Personal Information
              </div>

              {/* First Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="firstName">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  First Name <span className="required">*</span>
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  className={`form-input${showError('firstName') ? ' input-error' : ''}`}
                  placeholder="e.g. John"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="given-name"
                />
                {showError('firstName') && (
                  <span className="field-error"><ErrorIcon /> {errors.firstName}</span>
                )}
              </div>

              {/* Last Name */}
              <div className="form-group">
                <label className="form-label" htmlFor="lastName">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM3 18c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  Last Name <span className="required">*</span>
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  className={`form-input${showError('lastName') ? ' input-error' : ''}`}
                  placeholder="e.g. Doe"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="family-name"
                />
                {showError('lastName') && (
                  <span className="field-error"><ErrorIcon /> {errors.lastName}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label className="form-label" htmlFor="email">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M2 6l8 5 8-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Email <span className="required">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`form-input${showError('email') ? ' input-error' : ''}`}
                  placeholder="e.g. john.doe@company.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="email"
                />
                {showError('email') && (
                  <span className="field-error"><ErrorIcon /> {errors.email}</span>
                )}
              </div>

              {/* Phone */}
              <div className="form-group">
                <label className="form-label" htmlFor="phone">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M3 4.5C3 3.67 3.67 3 4.5 3h2.83a1 1 0 01.95.68l1.07 3.2a1 1 0 01-.27 1.03l-1.45 1.45a10.65 10.65 0 004.52 4.52l1.45-1.45a1 1 0 011.03-.27l3.2 1.07a1 1 0 01.68.95v2.83c0 .83-.67 1.5-1.5 1.5A14.5 14.5 0 013 4.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    </svg>
                  </span>
                  Phone <span className="required">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={`form-input${showError('phone') ? ' input-error' : ''}`}
                  placeholder="e.g. 9876543210"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  autoComplete="tel"
                />
                {showError('phone') && (
                  <span className="field-error"><ErrorIcon /> {errors.phone}</span>
                )}
              </div>

              {/* --- Job Details Section --- */}
              <div className="form-section-label">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                  <path d="M7 6V4a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                Job Details
              </div>

              {/* Department */}
              <div className="form-group">
                <label className="form-label" htmlFor="department">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M2 8h16" stroke="currentColor" strokeWidth="1.5" />
                      <path d="M7 8v9" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  Department <span className="required">*</span>
                </label>
                <select
                  id="department"
                  name="department"
                  className={`form-select${showError('department') ? ' input-error' : ''}`}
                  value={form.department}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
                {showError('department') && (
                  <span className="field-error"><ErrorIcon /> {errors.department}</span>
                )}
              </div>

              {/* Salary */}
              <div className="form-group">
                <label className="form-label" htmlFor="salary">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2v16M14 5H8a3 3 0 000 6h4a3 3 0 010 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  Salary <span className="required">*</span>
                </label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="1"
                  className={`form-input${showError('salary') ? ' input-error' : ''}`}
                  placeholder="e.g. 75000"
                  value={form.salary}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {showError('salary') && (
                  <span className="field-error"><ErrorIcon /> {errors.salary}</span>
                )}
              </div>

              {/* Joining Date */}
              <div className="form-group">
                <label className="form-label" htmlFor="joiningDate">
                  <span className="label-icon">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                      <rect x="2" y="3" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none" />
                      <path d="M2 8h16M6 1v4M14 1v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </span>
                  Joining Date <span className="required">*</span>
                </label>
                <input
                  id="joiningDate"
                  name="joiningDate"
                  type="date"
                  className={`form-input${showError('joiningDate') ? ' input-error' : ''}`}
                  value={form.joiningDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {showError('joiningDate') && (
                  <span className="field-error"><ErrorIcon /> {errors.joiningDate}</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="employee-form-actions">
              <Link to="/employees" className="btn btn-secondary">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 10H5M5 10l4-4M5 10l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Cancel
              </Link>
              <button
                type="submit"
                className={`btn btn-primary${submitting ? ' btn-submit-loading' : ''}`}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                      <path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="2" y="2" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
