package com.employeemgmt.service;

import com.employeemgmt.exception.ResourceNotFoundException;
import com.employeemgmt.model.Employee;
import com.employeemgmt.repository.EmployeeRepository;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Implementation of {@link EmployeeService}.
 *
 * @Service   — Marks this class as a Spring-managed service bean so it can
 *              be injected wherever an EmployeeService is needed.
 */
@Service
public class EmployeeServiceImpl implements EmployeeService {

    // The repository that handles all database operations for Employee documents.
    private final EmployeeRepository employeeRepository;

    /**
     * Constructor-based dependency injection.
     *
     * Spring automatically injects the EmployeeRepository bean here.
     * Constructor injection is the recommended approach because:
     *   - Dependencies are clearly visible.
     *   - The object is always in a valid state after construction.
     *   - It makes unit testing straightforward (just pass a mock).
     */
    public EmployeeServiceImpl(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    // ──────────────────────────── CRUD Operations ────────────────────────

    /**
     * Fetch all employees from the database.
     */
    @Override
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    /**
     * Fetch a single employee by ID.
     * Throws ResourceNotFoundException if the ID does not exist.
     */
    @Override
    public Employee getEmployeeById(String id) {
        return employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));
    }

    /**
     * Save a new employee to the database.
     * The returned object will contain the auto-generated ID.
     */
    @Override
    public Employee createEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    /**
     * Update an existing employee.
     *
     * Steps:
     *   1. Look up the employee by ID (throws 404 if not found).
     *   2. Copy the new values onto the existing entity.
     *   3. Save the updated entity back to the database.
     */
    @Override
    public Employee updateEmployee(String id, Employee employeeDetails) {
        // Step 1: Find existing employee or throw 404
        Employee existingEmployee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        // Step 2: Update fields with new values
        existingEmployee.setFirstName(employeeDetails.getFirstName());
        existingEmployee.setLastName(employeeDetails.getLastName());
        existingEmployee.setEmail(employeeDetails.getEmail());
        existingEmployee.setPhone(employeeDetails.getPhone());
        existingEmployee.setDepartment(employeeDetails.getDepartment());
        existingEmployee.setSalary(employeeDetails.getSalary());
        existingEmployee.setJoiningDate(employeeDetails.getJoiningDate());

        // Step 3: Save and return the updated employee
        return employeeRepository.save(existingEmployee);
    }

    /**
     * Delete an employee by ID.
     * Throws ResourceNotFoundException if the ID does not exist.
     */
    @Override
    public void deleteEmployee(String id) {
        // First check that the employee exists; if not, throw 404
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee", "id", id));

        employeeRepository.delete(employee);
    }

    // ──────────────────────────── Search ──────────────────────────────────

    /**
     * Search employees by keyword.
     * The same keyword is matched against first name, last name, AND department
     * (case-insensitive, partial match).
     */
    @Override
    public List<Employee> searchEmployees(String query) {
        return employeeRepository
                .findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
                        query, query, query);
    }
}
