package com.healthwellness.model;

public class RegisterRequest {
    private String email;
    private String username;
    private String password;
    private String confirmPassword;
    private String phoneNumber;

    public RegisterRequest() {
    }

    public RegisterRequest(String email, String username, String password, String confirmPassword, String phoneNumber) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.phoneNumber = phoneNumber;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getConfirmPassword() {
        return confirmPassword;
    }

    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
}

