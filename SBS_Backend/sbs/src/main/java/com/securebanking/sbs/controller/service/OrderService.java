package com.securebanking.sbs.controller.service;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.securebanking.sbs.dto.PaymentResponseDto;
import com.securebanking.sbs.enums.ApprovalStatus;
import com.securebanking.sbs.enums.RequestStatus;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.repository.PaymentRepo;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.securebanking.sbs.dto.OrderResponseDto; // Make sure to create this DTO
import com.securebanking.sbs.model.Order;
import com.securebanking.sbs.model.Payment;
import com.securebanking.sbs.model.Account;
import com.securebanking.sbs.repository.OrderRepo;
import com.securebanking.sbs.repository.UserRepo;
import com.securebanking.sbs.repository.AccountRepo;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepo orderRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private AccountRepo accountRepo;

    @Autowired
    private PaymentRepo paymentRepo;

    @Transactional
    public OrderResponseDto createRequestPaymentOrder(Order orderDetails){
        if (orderDetails.getOrderId() == null) {
            // Fetch existing account using the account number, assuming Account entity is correctly set up.
            Account account = accountRepo.findbyaccountnumber(orderDetails.getSenderAcc().getAccountNumber());
            orderDetails.setSenderAcc(account); // Make sure this matches your Order entity's field
            // Set the rest of the properties for the Order entity
            orderDetails.setStatus("CREATED");
            orderDetails.setCreatedtime(LocalDateTime.now());

            // Save the order to your database
            Order savedOrder = orderRepo.save(orderDetails);

            // Return a response containing the Razorpay order ID
            return new OrderResponseDto(savedOrder.getOrderId().toString(), "Order created successfully using Razorpay.");
        } else {
            throw new IllegalArgumentException("Order ID should be null for new order creation");
        }
    }

    public List<Order> getAllOrderTransactionsUsingaccountNumber(String accNumber) {
        Account account = accountRepo.findbyaccountnumber(accNumber);
        return orderRepo.findAllOrderTransactionsUsingaccountNumber(account.getAccountId());
    }


//    public void transferFunds(Transaction transaction) {
//        BigDecimal amount = new BigDecimal(transaction.getAmount());
//
//        Account senderAccount = transaction.getSenderAcc();
//        Account receiverAccount = transaction.getReceiverAcc();
//
//        BigDecimal senderBalance = new BigDecimal(senderAccount.getBalance());
//        if (senderBalance.compareTo(amount) < 0) {
//            throw new RuntimeException("Insufficient funds in the sender account");
//        }
//
//        BigDecimal newSenderBalance = senderBalance.subtract(amount);
//        BigDecimal newReceiverBalance = new BigDecimal(receiverAccount.getBalance()).add(amount);
//
//        senderAccount.setBalance(newSenderBalance.toString());
//        receiverAccount.setBalance(newReceiverBalance.toString());
//        accountRepo.save(senderAccount);
//        accountRepo.save(receiverAccount);
//        transaction.setStatus(ApprovalStatus.COMPLETED.toString()); // use the appropriate status
//        transactionRepo.save(transaction);
//    }
    @Transactional
    public void paymentGatewayOrder(Payment paymentDetail) {
        BigDecimal amount = new BigDecimal(paymentDetail.getAmount());
        Account senderAccount = accountRepo.findbyaccountnumber(paymentDetail.getCustomerAccountNumber());
        // Validate the sender's account balance
//        validateAccountBalance(senderAccount, amount);
        BigDecimal senderAccountBalance = new BigDecimal(senderAccount.getBalance());
        // Deduct the amount from sender's account
        BigDecimal finalsenderAccountBalance = senderAccountBalance.subtract(amount);
        senderAccount.setBalance(finalsenderAccountBalance.toString());
        accountRepo.save(senderAccount);

        Account receiverAccount = accountRepo.findbyaccountnumber(paymentDetail.getSenderAcc().getAccountNumber());
        if (receiverAccount == null || receiverAccount.getAccountId() == null) {
            throw new IllegalStateException("Receiver account does not exist or is not saved");
        }
        // Credit the receiver's account
        BigDecimal ReceiverAccountBalance = new BigDecimal(receiverAccount.getBalance());
        BigDecimal finalreceviverAccountBalance = ReceiverAccountBalance.add(amount);
        receiverAccount.setBalance(finalreceviverAccountBalance.toString());
        accountRepo.save(receiverAccount);

        Payment payment = new Payment();
        payment.setCustomerAccountNumber(paymentDetail.getCustomerAccountNumber());
        payment.setSenderAcc(paymentDetail.getSenderAcc());

        payment.setOrderId(paymentDetail.getOrderId());
        payment.setTransactionType(paymentDetail.getTransactionType());
        payment.setAmount(paymentDetail.getAmount());
        payment.setCurrency(paymentDetail.getCurrency());
        payment.setUser(payment.getUser());
        //paymentRepo.save(payment);

        Order order = orderRepo.findByOrderId(paymentDetail.getOrderId());
        order.setStatus("PAID");
        orderRepo.save(order);

        // Create and save the payment entity
//        Payment payment = convertToPaymentEntity(paymentDetails, senderAccount, receiverAccount);
//        Payment savedPayment = paymentRepo.save(payment);
//
//        // Update the order status to PAID
//        Order order = orderRepo.findByOrderId(paymentDetails.getOrderId())
//                .orElseThrow(() -> new RuntimeException("Order not found"));
//        order.setStatus("PAID");
//        orderRepo.save(order);
//
//        // Prepare the response DTO
//        PaymentResponseDto responseDto = new PaymentResponseDto();
//        responseDto.setPaymentId(savedPayment.getId().toString());
//        return responseDto;
    }

//    private void validateAccountBalance(Account account, BigDecimal amount) {
//        if (account.getBalance().compareTo(amount) < 0) {
//            throw new RuntimeException("Insufficient funds in the account");
//        }
//    }

//    private Payment convertToPaymentEntity(Payment dto, Account senderAccount, Account receiverAccount) {
//        Payment payment = new Payment();
//        // Set the properties from dto to payment entity
//        payment.setAmount(dto.getAmount());
//        payment.setSenderAcc(senderAccount);
////        payment.setReceiverAcc(receiverAccount);
//        // ... set other properties
//        return payment;
//    }

    }

