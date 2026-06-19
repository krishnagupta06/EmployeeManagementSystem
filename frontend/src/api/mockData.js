// ============================================
// MOCK DATA STORE
// Simulates backend with localStorage persistence
// Used when backend is not available (e.g., Vercel deployment)
// ============================================

const STORAGE_KEY = 'employee_management_data';

const defaultEmployees = [
  {
    id: 1,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'rajesh.kumar@company.com',
    phone: '9876543210',
    department: 'Engineering',
    salary: 85000,
    joiningDate: '2023-01-15',
    createdAt: '2023-01-15T10:00:00',
    updatedAt: '2023-01-15T10:00:00',
  },
  {
    id: 2,
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya.sharma@company.com',
    phone: '9876543211',
    department: 'Marketing',
    salary: 72000,
    joiningDate: '2023-03-20',
    createdAt: '2023-03-20T10:00:00',
    updatedAt: '2023-03-20T10:00:00',
  },
  {
    id: 3,
    firstName: 'Amit',
    lastName: 'Patel',
    email: 'amit.patel@company.com',
    phone: '9876543212',
    department: 'Engineering',
    salary: 92000,
    joiningDate: '2022-11-10',
    createdAt: '2022-11-10T10:00:00',
    updatedAt: '2022-11-10T10:00:00',
  },
  {
    id: 4,
    firstName: 'Sneha',
    lastName: 'Reddy',
    email: 'sneha.reddy@company.com',
    phone: '9876543213',
    department: 'HR',
    salary: 68000,
    joiningDate: '2023-06-01',
    createdAt: '2023-06-01T10:00:00',
    updatedAt: '2023-06-01T10:00:00',
  },
  {
    id: 5,
    firstName: 'Vikram',
    lastName: 'Singh',
    email: 'vikram.singh@company.com',
    phone: '9876543214',
    department: 'Sales',
    salary: 76000,
    joiningDate: '2023-02-14',
    createdAt: '2023-02-14T10:00:00',
    updatedAt: '2023-02-14T10:00:00',
  },
  {
    id: 6,
    firstName: 'Ananya',
    lastName: 'Gupta',
    email: 'ananya.gupta@company.com',
    phone: '9876543215',
    department: 'Finance',
    salary: 81000,
    joiningDate: '2022-09-05',
    createdAt: '2022-09-05T10:00:00',
    updatedAt: '2022-09-05T10:00:00',
  },
  {
    id: 7,
    firstName: 'Rahul',
    lastName: 'Verma',
    email: 'rahul.verma@company.com',
    phone: '9876543216',
    department: 'Engineering',
    salary: 95000,
    joiningDate: '2022-07-22',
    createdAt: '2022-07-22T10:00:00',
    updatedAt: '2022-07-22T10:00:00',
  },
  {
    id: 8,
    firstName: 'Kavitha',
    lastName: 'Nair',
    email: 'kavitha.nair@company.com',
    phone: '9876543217',
    department: 'Design',
    salary: 71000,
    joiningDate: '2023-04-18',
    createdAt: '2023-04-18T10:00:00',
    updatedAt: '2023-04-18T10:00:00',
  },
  {
    id: 9,
    firstName: 'Suresh',
    lastName: 'Menon',
    email: 'suresh.menon@company.com',
    phone: '9876543218',
    department: 'Operations',
    salary: 69000,
    joiningDate: '2023-08-30',
    createdAt: '2023-08-30T10:00:00',
    updatedAt: '2023-08-30T10:00:00',
  },
  {
    id: 10,
    firstName: 'Deepika',
    lastName: 'Joshi',
    email: 'deepika.joshi@company.com',
    phone: '9876543219',
    department: 'Product',
    salary: 88000,
    joiningDate: '2022-12-01',
    createdAt: '2022-12-01T10:00:00',
    updatedAt: '2022-12-01T10:00:00',
  },
];

function getEmployees() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultEmployees));
  return [...defaultEmployees];
}

function saveEmployees(employees) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
}

// Simulate async delay
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export async function mockGetAllEmployees() {
  await delay();
  return getEmployees();
}

export async function mockGetEmployeeById(id) {
  await delay();
  const employees = getEmployees();
  const emp = employees.find(e => e.id === Number(id));
  if (!emp) throw new Error('Employee not found');
  return emp;
}

export async function mockCreateEmployee(data) {
  await delay();
  const employees = getEmployees();
  const maxId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) : 0;
  const now = new Date().toISOString();
  const newEmployee = {
    id: maxId + 1,
    ...data,
    salary: Number(data.salary),
    createdAt: now,
    updatedAt: now,
  };
  employees.push(newEmployee);
  saveEmployees(employees);
  return newEmployee;
}

export async function mockUpdateEmployee(id, data) {
  await delay();
  const employees = getEmployees();
  const index = employees.findIndex(e => e.id === Number(id));
  if (index === -1) throw new Error('Employee not found');
  employees[index] = {
    ...employees[index],
    ...data,
    salary: Number(data.salary),
    updatedAt: new Date().toISOString(),
  };
  saveEmployees(employees);
  return employees[index];
}

export async function mockDeleteEmployee(id) {
  await delay();
  const employees = getEmployees();
  const filtered = employees.filter(e => e.id !== Number(id));
  saveEmployees(filtered);
  return { message: 'Employee deleted successfully' };
}

export async function mockSearchEmployees(query) {
  await delay();
  const employees = getEmployees();
  const q = query.toLowerCase();
  return employees.filter(
    e =>
      e.firstName.toLowerCase().includes(q) ||
      e.lastName.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q)
  );
}
