package com.employeemgmt.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.employeemgmt.model.User;

/**
 * Spring Data MongoDB repository for {@link User} documents.
 * Provides built-in CRUD operations plus custom query methods.
 */
public interface UserRepository extends MongoRepository<User, String> {

    /**
     * Finds a user by their email address.
     *
     * @param email the email to search for
     * @return an Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Checks whether a user with the given email already exists.
     *
     * @param email the email to check
     * @return true if a user with that email exists
     */
    boolean existsByEmail(String email);
}
