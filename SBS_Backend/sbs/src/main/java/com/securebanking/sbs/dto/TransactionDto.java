package com.securebanking.sbs.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.securebanking.sbs.enums.RequestStatus;
import com.securebanking.sbs.model.Account;
import com.securebanking.sbs.model.User;


public class TransactionDto {

    private Integer transactionId;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User user;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Account receiverAcc;

    private String transactionType;

    private String amount;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Account senderAcc;

    private RequestStatus status;

    public Integer getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Integer transactionId) {
        this.transactionId = transactionId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Account getReceiverAcc() {
        return receiverAcc;
    }

    public void setReceiverAcc(Account receiverAcc) {
        this.receiverAcc = receiverAcc;
    }

    public String getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(String transactionType) {
        this.transactionType = transactionType;
    }

    public String getAmount() {
        return amount;
    }

    public void setAmount(String amount) {
        this.amount = amount;
    }

    public RequestStatus getStatus() {
        return status;
    }

    public void setStatus(RequestStatus status) {
        this.status = status;
    }

    public Account getSenderAcc() {
        return senderAcc;
    }

    public void setSenderAcc(Account senderAcc) {
        this.senderAcc = senderAcc;
    }
}
