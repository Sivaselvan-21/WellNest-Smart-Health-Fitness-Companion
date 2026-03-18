package com.healthwellness.service;

import com.healthwellness.model.User;
import com.healthwellness.model.RegisterRequest;
import com.healthwellness.model.ProfileRequest;
import com.healthwellness.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Date;
import java.util.Optional;
import java.util.Random;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    
    // Add this missing method
    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    public User registerUser(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhoneNumber(request.getPhoneNumber());
        user.setCreatedAt(new Date());
        user.setUpdatedAt(new Date());
        
        // Generate and send OTP
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(new Date(System.currentTimeMillis() + 10 * 60 * 1000)); // 10 minutes
        
        user = userRepository.save(user);
        
        // Send OTP email
        emailService.sendOtpEmail(user.getEmail(), otp);
        
        return user;
    }
    
    public User verifyEmail(String email, String otp) {
        Optional<User> userOpt = userRepository.findByEmailAndOtp(email, otp);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid OTP");
        }
        
        User user = userOpt.get();
        if (user.getOtpExpiry().before(new Date())) {
            throw new RuntimeException("OTP expired");
        }
        
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setIsEmailVerified(true);
        user.setUpdatedAt(new Date());
        
        return userRepository.save(user);
    }
    
    public User loginUser(String email, String password) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not registered");
        }
        
        User user = userOpt.get();
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        if (!user.getIsEmailVerified()) {
            throw new RuntimeException("Please verify your email first");
        }
        
        return user;
    }
    
    public void initiatePasswordReset(String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Email not registered");
        }
        
        User user = userOpt.get();
        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(new Date(System.currentTimeMillis() + 10 * 60 * 1000));
        userRepository.save(user);
        
        emailService.sendPasswordResetEmail(email, otp);
    }
    
    public User resetPassword(String email, String otp, String newPassword) {
        Optional<User> userOpt = userRepository.findByEmailAndOtp(email, otp);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Invalid OTP");
        }
        
        User user = userOpt.get();
        if (user.getOtpExpiry().before(new Date())) {
            throw new RuntimeException("OTP expired");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setUpdatedAt(new Date());
        
        return userRepository.save(user);
    }
    
    public User updateProfile(String email, ProfileRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        
        User user = userOpt.get();
        if (request.getHeight() != null) user.setHeight(request.getHeight());
        if (request.getWeight() != null) user.setWeight(request.getWeight());
        if (request.getCaloriesBurnt() != null) user.setCaloriesBurnt(request.getCaloriesBurnt());
        if (request.getAge() != null) user.setAge(request.getAge());
        if (request.getProfilePicture() != null) user.setProfilePicture(request.getProfilePicture());
        
        user.setUpdatedAt(new Date());
        
        return userRepository.save(user);
    }
    
    private String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(999999));
    }
}