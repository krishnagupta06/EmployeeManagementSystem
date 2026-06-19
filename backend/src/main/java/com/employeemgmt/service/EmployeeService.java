package com.employeemgmt.service;

import com.employeemgmt.model.Employee;

import java.util.List;

/**
 * Service interface for Employee business logic.
 *
 * Why use an interface?
 *   - It separates the "what" (method signatures) from the "how" (implementation).
 *   - It makes the code easier to test — you can swap in a mock implementation.
 *   - It follows the Dependency Inversion Principle (the "D" in SOLID).
 */
public interface EmployeeService {

    /**
     * Retrieve every employee from the database.
     *
     * @return list of all employees
     */
    List<Employee> getAllEmployees();

    /**
     * Retrieve a single employee by their unique ID.
     *
     * @param id the employee's ID
     * @return the matching Employee
     * @throws com.employeemgmt.exception.ResourceNotFoundException if no employee is found
     */
    Employee getEmployeeById(String id);

    /**
     * Create (save) a new employee.
     *
     * @param employee the employee data to persist
     * @return the saved employee (now includes a generated ID)
     */
    Employee createEmployee(Employee employee);

    /**
     * Update an existing employee's information.
     *
     * @param id       the ID of the employee to update
     * @param employee the new data to apply
     * @return the updated employee
     * @throws com.employeemgmt.exception.ResourceNotFoundException if no employee is found
     */
    Employee updateEmployee(String id, Employee employee);

    /**
     * Delete an employee by their ID.
     *
     * @param id the ID of the employee to delete
     * @throws com.employeemgmt.exception.ResourceNotFoundException if no employee is found
     */
    void deleteEmployee(String id);

    /**
     * Search employees by a keyword that is matched against
     * first name, last name, and department.
     *
     * @param query the search keyword
     * @return list of matching employees
     */
    List<Employee> searchEmployees(String query);
}
