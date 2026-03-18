package com.healthwellness.repository;

import com.healthwellness.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    
    @Query("{ 'email': ?0, 'otp': ?1 }")
    Optional<User> findByEmailAndOtp(String email, String otp);
}