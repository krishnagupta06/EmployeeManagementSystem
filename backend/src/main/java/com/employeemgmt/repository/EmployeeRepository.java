package com.employeemgmt.repository;

import com.employeemgmt.model.Employee;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for the Employee document.
 *
 * By extending MongoRepository, Spring Data MongoDB automatically provides
 * implementations for common database operations such as:
 *   - save()      → INSERT or UPDATE
 *   - findById()  → find by _id
 *   - findAll()   → find all documents
 *   - deleteById()→ DELETE by _id
 *   - count()     → count documents
 *
 * You do NOT need to write any queries — Spring generates them from method names.
 *
 * The @Repository annotation is optional here (MongoRepository is already
 * detected), but it makes the purpose of this interface explicit.
 */
@Repository
public interface EmployeeRepository extends MongoRepository<Employee, String> {

    /**
     * Search employees by first name, last name, OR department.
     *
     * Spring Data MongoDB derives the query from this method name:
     *   - "findBy"                            → query filter
     *   - "FirstNameContainingIgnoreCase"      → regex case-insensitive match on first_name
     *   - "Or"                                → $or
     *   - "LastNameContainingIgnoreCase"       → regex case-insensitive match on last_name
     *   - "Or"                                → $or
     *   - "DepartmentContainingIgnoreCase"    → regex case-insensitive match on department
     *
     * All three parameters receive the SAME search string so a single
     * keyword can match against any of the three fields.
     *
     * @param firstName  search keyword matched against first_name
     * @param lastName   search keyword matched against last_name
     * @param department search keyword matched against department
     * @return list of employees matching the search criteria
     */
    List<Employee> findByFirstNameContainingIgnoreCaseOrLastNameContainingIgnoreCaseOrDepartmentContainingIgnoreCase(
            String firstName, String lastName, String department);
}
