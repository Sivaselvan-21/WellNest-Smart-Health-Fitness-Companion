package com.healthwellness.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    
    @Autowired
    private JavaMailSender mailSender;
    
    @Async
    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom("Vd98847@gmail.com");
        message.setSubject("Health Wellness App - OTP Verification");
        message.setText("Your OTP for verification is: " + otp + 
                       "\nThis OTP is valid for 10 minutes." +
                       "\n\nBest Regards,\nHealth Wellness Team");
        
        mailSender.send(message);
    }
    
    @Async
    public void sendPasswordResetEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setFrom("Vd98847@gmail.com");
        message.setSubject("Health Wellness App - Password Reset OTP");
        message.setText("Your password reset OTP is: " + otp + 
                       "\nThis OTP is valid for 10 minutes." +
                       "\n\nIf you didn't request this, please ignore this email." +
                       "\n\nBest Regards,\nHealth Wellness Team");
        
        mailSender.send(message);
    }
}
