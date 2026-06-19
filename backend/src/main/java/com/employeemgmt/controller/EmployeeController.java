package com.employeemgmt.controller;

import com.employeemgmt.model.Employee;
import com.employeemgmt.service.EmployeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Employee operations.
 *
 * @RestController   — Combines @Controller + @ResponseBody.
 *                     Every method return value is serialised to JSON automatically.
 * @RequestMapping   — Base URL prefix for all endpoints in this controller.
 * @CrossOrigin      — Allows the React/Vite frontend (running on port 5173)
 *                     to call these endpoints without being blocked by the
 *                     browser's Same-Origin Policy.
 */
@RestController
@RequestMapping("/api/employees")
@CrossOrigin(origins = "http://localhost:5173")
public class EmployeeController {

    // Service that contains the business logic for Employee operations.
    private final EmployeeService employeeService;

    /**
     * Constructor injection — Spring injects the EmployeeService bean automatically.
     */
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    // ──────────────────────────── GET all employees ──────────────────────

    /**
     * GET /api/employees
     *
     * Returns a list of every employee in the database.
     * HTTP 200 (OK) on success.
     */
    @GetMapping
    public ResponseEntity<List<Employee>> getAllEmployees() {
        List<Employee> employees = employeeService.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    // ──────────────────────────── GET single employee ────────────────────

    /**
     * GET /api/employees/{id}
     *
     * Returns the employee with the given ID.
     * HTTP 200 (OK) on success, 404 (Not Found) if the ID doesn't exist.
     *
     * @param id  employee ID extracted from the URL path
     */
    @GetMapping("/{id}")
    public ResponseEntity<Employee> getEmployeeById(@PathVariable String id) {
        Employee employee = employeeService.getEmployeeById(id);
        return ResponseEntity.ok(employee);
    }

    // ──────────────────────────── POST create employee ───────────────────

    /**
     * POST /api/employees
     *
     * Creates a new employee.  The request body must be valid JSON that
     * matches the Employee model.  @Valid triggers the validation
     * annotations on the Employee fields (e.g., @NotBlank, @Email).
     *
     * HTTP 201 (Created) on success.
     */
    @PostMapping
    public ResponseEntity<Employee> createEmployee(@Valid @RequestBody Employee employee) {
        Employee savedEmployee = employeeService.createEmployee(employee);
        return new ResponseEntity<>(savedEmployee, HttpStatus.CREATED);
    }

    // ──────────────────────────── PUT update employee ────────────────────

    /**
     * PUT /api/employees/{id}
     *
     * Updates an existing employee's information.
     * HTTP 200 (OK) on success, 404 if the employee doesn't exist.
     *
     * @param id       employee ID from the URL path
     * @param employee updated employee data from the request body
     */
    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(@PathVariable String id,
                                                   @Valid @RequestBody Employee employee) {
        Employee updatedEmployee = employeeService.updateEmployee(id, employee);
        return ResponseEntity.ok(updatedEmployee);
    }

    // ──────────────────────────── DELETE employee ────────────────────────

    /**
     * DELETE /api/employees/{id}
     *
     * Deletes the employee with the given ID.
     * Returns a JSON object confirming the deletion.
     * HTTP 200 (OK) on success, 404 if the employee doesn't exist.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteEmployee(@PathVariable String id) {
        employeeService.deleteEmployee(id);

        // Build a simple confirmation response
        Map<String, Object> response = new HashMap<>();
        response.put("deleted", true);
        response.put("message", "Employee with ID " + id + " has been deleted successfully");

        return ResponseEntity.ok(response);
    }

    // ──────────────────────────── SEARCH employees ──────────────────────

    /**
     * GET /api/employees/search?query=keyword
     *
     * Searches employees whose first name, last name, or department
     * contains the given keyword (case-insensitive).
     *
     * Example: GET /api/employees/search?query=john
     */
    @GetMapping("/search")
    public ResponseEntity<List<Employee>> searchEmployees(@RequestParam String query) {
        List<Employee> employees = employeeService.searchEmployees(query);
        return ResponseEntity.ok(employees);
    }
}
