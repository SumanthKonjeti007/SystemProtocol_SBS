package com.securebanking.sbs.controller;

import com.securebanking.sbs.dto.OrderResponseDto;
import com.securebanking.sbs.controller.service.OrderService;
import com.securebanking.sbs.dto.PaymentResponseDto;
import com.securebanking.sbs.model.Order;
import com.securebanking.sbs.model.Payment;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.util.JwtTokenRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping("/orders/requestPayment")
    public ResponseEntity<?> createRequestPaymentOrder(@RequestBody Order orderDetails) {
        try {
            OrderResponseDto orderResponse = orderService.createRequestPaymentOrder(orderDetails);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating request payment order: " + ex.getMessage());
        }
    }
    @GetMapping("/allOrderTransactionbyAccount")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public List<Order> getAllOrderTransactionsUsingaccountNumber(@RequestParam String accNumber) {
        return orderService.getAllOrderTransactionsUsingaccountNumber(accNumber);
    }

    @PostMapping("/orders/paymentGateway")
    @CrossOrigin(origins = "*")
    public ResponseEntity<?> paymentGatewayOrder(@RequestBody Payment paymentDetails) {
        try {
            System.out.println(paymentDetails);
            orderService.paymentGatewayOrder(paymentDetails);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Payment processed successfully.");
            response.put("paymentDetails", "ok");
            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error creating payment order: " + ex.getMessage());
        }
    }
}
