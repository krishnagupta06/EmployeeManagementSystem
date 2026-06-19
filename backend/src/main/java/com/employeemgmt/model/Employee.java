package com.employeemgmt.model;

import jakarta.validation.constraints.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDate;

/**
 * Employee document class — represents the "employees" collection in MongoDB.
 *
 * Each field is mapped to a field in the MongoDB document. Validation annotations
 * (like @NotBlank, @Email, etc.) ensure that incoming data is correct
 * before it reaches the database.
 *
 * NOTE: Lombok is NOT used here on purpose so that beginners can see
 * exactly what getters, setters, and constructors look like.
 */
@Document(collection = "employees")
public class Employee {

    // ───────────────────────────── Fields ─────────────────────────────

    /**
     * Primary key — MongoDB uses a String ObjectId by default.
     */
    @Id
    private String id;

    /**
     * Employee's first name.
     * - Cannot be blank (null or empty).
     * - Must be between 2 and 50 characters long.
     */
    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    @Field("first_name")
    private String firstName;

    /**
     * Employee's last name.
     * - Cannot be blank.
     * - Must be between 2 and 50 characters long.
     */
    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    @Field("last_name")
    private String lastName;

    /**
     * Employee's email address.
     * - Cannot be blank.
     * - Must be a valid email format.
     * - Must be unique across all employees.
     */
    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Indexed(unique = true)
    private String email;

    /**
     * Employee's phone number.
     * - Optional, but if provided must match the pattern (10-15 digits, optional leading +).
     */
    @Pattern(regexp = "^[+]?[0-9]{10,15}$", message = "Phone number must be 10-15 digits, optionally starting with +")
    private String phone;

    /**
     * Department the employee belongs to (e.g., "Engineering", "HR").
     */
    @NotBlank(message = "Department is required")
    private String department;

    /**
     * Monthly salary — must be a positive number.
     */
    @NotNull(message = "Salary is required")
    @Positive(message = "Salary must be a positive number")
    private Double salary;

    /**
     * The date the employee joined the company.
     */
    @NotNull(message = "Joining date is required")
    @Field("joining_date")
    private LocalDate joiningDate;

    // ──────────────────────────── Constructors ────────────────────────────

    /**
     * No-argument constructor — required by Spring Data MongoDB.
     */
    public Employee() {
    }

    /**
     * All-arguments constructor — handy for creating Employee objects in code.
     */
    public Employee(String id, String firstName, String lastName, String email,
                    String phone, String department, Double salary, LocalDate joiningDate) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.department = department;
        this.salary = salary;
        this.joiningDate = joiningDate;
    }

    // ──────────────────────────── Getters & Setters ───────────────────────

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Double getSalary() {
        return salary;
    }

    public void setSalary(Double salary) {
        this.salary = salary;
    }

    public LocalDate getJoiningDate() {
        return joiningDate;
    }

    public void setJoiningDate(LocalDate joiningDate) {
        this.joiningDate = joiningDate;
    }

    // ──────────────────────────── toString ────────────────────────────────

    /**
     * Returns a human-readable string representation of this employee.
     * Useful for logging and debugging.
     */
    @Override
    public String toString() {
        return "Employee{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", phone='" + phone + '\'' +
                ", department='" + department + '\'' +
                ", salary=" + salary +
                ", joiningDate=" + joiningDate +
                '}';
    }
}
