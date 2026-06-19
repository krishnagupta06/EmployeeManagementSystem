-- ============================================
-- Employee Management System - Database Setup
-- ============================================
-- Run this script in MySQL to create the database and seed data.
-- 
-- How to run:
--   1. Open MySQL command line or MySQL Workbench
--   2. Execute: source /path/to/setup.sql
--   OR copy and paste the contents into the MySQL console
-- ============================================

-- Create the database
CREATE DATABASE IF NOT EXISTS employee_management;

-- Use the database
USE employee_management;

-- Create the employees table
-- Note: Spring Boot JPA with ddl-auto=update will also create this table
-- automatically, but this script ensures the schema is correct.
CREATE TABLE IF NOT EXISTS employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(15),
    department VARCHAR(50) NOT NULL,
    salary DOUBLE NOT NULL,
    joining_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ============================================
-- Seed Data - Sample Employees
-- ============================================
INSERT INTO employees (first_name, last_name, email, phone, department, salary, joining_date) VALUES
('Rajesh', 'Kumar', 'rajesh.kumar@company.com', '9876543210', 'Engineering', 85000, '2023-01-15'),
('Priya', 'Sharma', 'priya.sharma@company.com', '9876543211', 'Marketing', 72000, '2023-03-20'),
('Amit', 'Patel', 'amit.patel@company.com', '9876543212', 'Engineering', 92000, '2022-11-10'),
('Sneha', 'Reddy', 'sneha.reddy@company.com', '9876543213', 'HR', 68000, '2023-06-01'),
('Vikram', 'Singh', 'vikram.singh@company.com', '9876543214', 'Sales', 76000, '2023-02-14'),
('Ananya', 'Gupta', 'ananya.gupta@company.com', '9876543215', 'Finance', 81000, '2022-09-05'),
('Rahul', 'Verma', 'rahul.verma@company.com', '9876543216', 'Engineering', 95000, '2022-07-22'),
('Kavitha', 'Nair', 'kavitha.nair@company.com', '9876543217', 'Design', 71000, '2023-04-18'),
('Suresh', 'Menon', 'suresh.menon@company.com', '9876543218', 'Operations', 69000, '2023-08-30'),
('Deepika', 'Joshi', 'deepika.joshi@company.com', '9876543219', 'Product', 88000, '2022-12-01');

-- Verify the data
SELECT COUNT(*) AS total_employees FROM employees;
SELECT * FROM employees;

-- ============================================
-- Useful queries for testing
-- ============================================
-- Search by name:
-- SELECT * FROM employees WHERE first_name LIKE '%raj%' OR last_name LIKE '%raj%';

-- Search by department:
-- SELECT * FROM employees WHERE department LIKE '%eng%';

-- Get department statistics:
-- SELECT department, COUNT(*) as count, AVG(salary) as avg_salary
-- FROM employees GROUP BY department;
