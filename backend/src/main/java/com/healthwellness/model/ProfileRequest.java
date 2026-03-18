package com.healthwellness.model;

public class ProfileRequest {
    private Double height;
    private Double weight;
    private Integer caloriesBurnt;
    private Integer age;
    private String profilePicture;

    public ProfileRequest() {
    }

    public ProfileRequest(Double height, Double weight, Integer caloriesBurnt, Integer age, String profilePicture) {
        this.height = height;
        this.weight = weight;
        this.caloriesBurnt = caloriesBurnt;
        this.age = age;
        this.profilePicture = profilePicture;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Integer getCaloriesBurnt() {
        return caloriesBurnt;
    }

    public void setCaloriesBurnt(Integer caloriesBurnt) {
        this.caloriesBurnt = caloriesBurnt;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }
}

