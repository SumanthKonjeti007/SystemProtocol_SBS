package com.securebanking.sbs.dto;

public class OrderResponseDto {
    private String razorpayOrderId;
    private String status;

    // Constructors, getters, and setters
    public OrderResponseDto(String razorpayOrderId, String status) {
        this.razorpayOrderId = razorpayOrderId;
        this.status = status;
    }

    public String getRazorpayOrderId() {
        return razorpayOrderId;
    }

    public void setRazorpayOrderId(String razorpayOrderId) {
        this.razorpayOrderId = razorpayOrderId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

