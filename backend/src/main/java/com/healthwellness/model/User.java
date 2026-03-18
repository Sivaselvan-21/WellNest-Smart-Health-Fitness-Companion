package com.healthwellness.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;
import java.util.Date;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    
    @Indexed(unique = true)
    private String email;
    
    private String username;
    private String password;
    private String phoneNumber;
    private String profilePicture;
    
    // Health metrics
    private Double height;
    private Double weight;
    private Integer caloriesBurnt;
    private Integer age;
    
    // Email verification
    private String otp;
    private Date otpExpiry;
    private Boolean isEmailVerified = false;
    
    // Timestamps
    private Date createdAt;
    private Date updatedAt;
    
    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    
    public String getProfilePicture() { return profilePicture; }
    public void setProfilePicture(String profilePicture) { this.profilePicture = profilePicture; }
    
    public Double getHeight() { return height; }
    public void setHeight(Double height) { this.height = height; }
    
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    
    public Integer getCaloriesBurnt() { return caloriesBurnt; }
    public void setCaloriesBurnt(Integer caloriesBurnt) { this.caloriesBurnt = caloriesBurnt; }
    
    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }
    
    public String getOtp() { return otp; }
    public void setOtp(String otp) { this.otp = otp; }
    
    public Date getOtpExpiry() { return otpExpiry; }
    public void setOtpExpiry(Date otpExpiry) { this.otpExpiry = otpExpiry; }
    
    public Boolean getIsEmailVerified() { return isEmailVerified; }
    public void setIsEmailVerified(Boolean isEmailVerified) { this.isEmailVerified = isEmailVerified; }
    
    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }
    
    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }
}