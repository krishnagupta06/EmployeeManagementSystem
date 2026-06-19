import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createEmployee } from '../api/employeeApi'
import { useToast } from '../components/Toast'
import './AddEmployee.css'

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
  } else if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) {
    errors.phone = 'Phone must be exactly 10 digits'
  }

  if (!form.department) errors.department = 'Please select a department'

  if (!form.salary) {
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

export default function AddEmployee() {
  const navigate = useNavigate()
  const { addToast } = useToast()

  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [touched, setTouched] = useState({})

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
      await createEmployee({
        ...form,
        salary: Number(form.salary),
      })
      addToast('Employee created successfully!', 'success')
      navigate('/employees')
    } catch (err) {
      addToast(err?.response?.data?.message || 'Failed to create employee', 'error')
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
          <h1>Add New Employee</h1>
          <p>Fill in the details to create a new employee record</p>
        </div>
      </div>

      {/* Form Card */}
      <form className="glass-card employee-form-card" onSubmit={handleSubmit} noValidate>
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
                Creating…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Add Employee
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
