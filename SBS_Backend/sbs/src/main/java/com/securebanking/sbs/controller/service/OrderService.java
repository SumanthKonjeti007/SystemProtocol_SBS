package com.securebanking.sbs.controller.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.securebanking.sbs.dto.OrderResponseDto; // Make sure to create this DTO
import com.securebanking.sbs.model.Order;
import com.securebanking.sbs.model.Account;
import com.securebanking.sbs.repository.OrderRepo;
import com.securebanking.sbs.repository.UserRepo;
import com.securebanking.sbs.repository.AccountRepo;

import java.time.LocalDateTime;

@Service
public class OrderService {

    @Value("${razorpay.key_id}")
    private String keyId;

    @Value("${razorpay.key_secret}")
    private String keySecret;

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AccountRepo accountRepo;

    @Transactional
    public OrderResponseDto createOrder(Order orderDetails) throws RazorpayException {
        if (orderDetails.getOrderId() == null) {
            // Fetch existing account using the account number, assuming Account entity is correctly set up.
            Account account = accountRepo.findbyaccountnumber(orderDetails.getSenderAcc().getAccountNumber());
            orderDetails.setSenderAcc(account); // Make sure this matches your Order entity's field

            // Initialize the Razorpay client
            RazorpayClient client = new RazorpayClient(keyId, keySecret);

            // Prepare the options for the Razorpay order
            JSONObject options = new JSONObject();
            options.put("amount", Math.round(Double.parseDouble(orderDetails.getAmount()) * 100)); // Convert to smallest currency unit
            options.put("currency", "INR");
            options.put("receipt", "order_rcptid_" + System.currentTimeMillis());

            // Create a Razorpay order
            com.razorpay.Order razorpayOrder = client.orders.create(options);

            // Store the Razorpay order ID in your Order entity
            orderDetails.setRazorpayOrderId(razorpayOrder.get("id"));

            // Set the rest of the properties for the Order entity
            orderDetails.setStatus("CREATED");
            orderDetails.setCreatedtime(LocalDateTime.now());

            // Save the order to your database
            Order savedOrder = orderRepo.save(orderDetails);

            // Return a response containing the Razorpay order ID
            return new OrderResponseDto(savedOrder.getRazorpayOrderId(), "Order created successfully using Razorpay.");
        } else {
            throw new IllegalArgumentException("Order ID should be null for new order creation");
        }
    }
}

