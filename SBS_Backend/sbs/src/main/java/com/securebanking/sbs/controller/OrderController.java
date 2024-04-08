package com.securebanking.sbs.controller;

import com.razorpay.RazorpayException;
import com.securebanking.sbs.dto.OrderResponseDto; // Ensure you import the correct OrderResponse DTO
import com.securebanking.sbs.controller.service.OrderService;
import com.securebanking.sbs.model.Order;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestBody Order orderDetails) {
        try {
            // The OrderService now returns an OrderResponse
            OrderResponseDto orderResponse = orderService.createOrder(orderDetails);
            return ResponseEntity.ok(orderResponse); // Send the OrderResponse back to the client
        } catch (RazorpayException ex) {
            // Handle Razorpay specific exceptions here
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Razorpay error: " + ex.getMessage());
        } catch (Exception ex) {
            // Handle other exceptions here
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating order: " + ex.getMessage());
        }
    }
}

