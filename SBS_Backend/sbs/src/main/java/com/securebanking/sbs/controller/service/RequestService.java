package com.securebanking.sbs.controller.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.dto.UserDto;
import com.securebanking.sbs.dto.UserProfileUpdateRequestDto;
import com.securebanking.sbs.enums.ApprovalStatus;
import com.securebanking.sbs.enums.RequestStatus;
import com.securebanking.sbs.iservice.IRequest;
import com.securebanking.sbs.model.*;
import com.securebanking.sbs.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class RequestService implements IRequest {

    @Autowired
    UserRepo userRepo;

    @Autowired
    UserService userService;

    @Autowired
    TransactionAuthorizationRepo transactionAuthorizationRepo;

    @Autowired
    AccountRepo accountRepo;

    @Autowired
    TransactionRepo transactionRepo;

    @Autowired
    AccountService accountService;

    public TransactionAuthorizationDto getAllTranctionRequests(TransactionAuthorizationDto transactionAuthorizationDto) {

        return transactionAuthorizationDto;
    }
//    transactionId,user,Acc-recAcc,tranctiontype,amount, status

    @Autowired
    private UserProfileUpdateRequestRepo userProfileUpdateRequestRepo;


    public List<UserProfileUpdateRequestDto> getPendingUpdateRequests() {
        List<UserProfileUpdateRequest> userProfileUpdateRequest = userProfileUpdateRequestRepo.findByStatus(ApprovalStatus.PENDING);
        List<UserProfileUpdateRequestDto> userProfileUpdateRequestDto= new ArrayList<>();
        userProfileUpdateRequest.forEach(req -> {
            UserProfileUpdateRequestDto singleReq = new UserProfileUpdateRequestDto();
            BeanUtils.copyProperties(req,singleReq);
            User user = req.getUser();
            UserRole userRole = user.getRole();
            Set<User> empty = new HashSet<>();
            userRole.setUsers(empty);
            user.setRole(userRole);
            req.setUser(user);
            userProfileUpdateRequestDto.add(singleReq);
        });
        return userProfileUpdateRequestDto;
    }


    public UserProfileUpdateRequestDto createUpdateProfileRequest(UserProfileUpdateRequestDto userProfileUpdateRequestDto) {
        UserProfileUpdateRequest userProfileUpdateRequest = new UserProfileUpdateRequest();
        if(userProfileUpdateRequestDto.getId() != null){
            userProfileUpdateRequest = userProfileUpdateRequestRepo.findById(userProfileUpdateRequestDto.getId()).get();
            if(userProfileUpdateRequest.getApprovalStatus() == ApprovalStatus.PENDING && userProfileUpdateRequestDto.getApprovalStatus()==ApprovalStatus.APPROVED){
                userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.APPROVED);
                userProfileUpdateRequest.setApprover(userProfileUpdateRequestDto.getApprover());
                userProfileUpdateRequest.setApprovalDate(LocalDateTime.now());

                ObjectMapper mapper = new ObjectMapper();
                UserDto updatedUserData = null;
                try {
                    updatedUserData = mapper.readValue(userProfileUpdateRequest.getUpdateData(), UserDto.class);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
                HttpStatus userUpdateStatus= userService.createOrUpdateUser(updatedUserData);
                if(userUpdateStatus.equals(HttpStatus.OK)){
                    userProfileUpdateRequest.setStatus(RequestStatus.UPDATED);
                }
                else{
                    userProfileUpdateRequest.setStatus(RequestStatus.PENDING);
                }

                userProfileUpdateRequest.setLastModifiedtime(LocalDateTime.now());
                userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
            }
            else if (userProfileUpdateRequest.getApprovalStatus() == ApprovalStatus.PENDING && userProfileUpdateRequestDto.getApprovalStatus()==ApprovalStatus.REJECTED){
                userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.REJECTED);
                userProfileUpdateRequest.setApprovalDate(LocalDateTime.now());
                userProfileUpdateRequest.setStatus(RequestStatus.REJECTED);
                userProfileUpdateRequest.setLastModifiedtime(LocalDateTime.now());
                userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
            }


        }
        else{
            BeanUtils.copyProperties(userProfileUpdateRequestDto,userProfileUpdateRequest);
            userProfileUpdateRequest.setUser(userRepo.findById(userProfileUpdateRequestDto.getUser().getUserId()).get());
            userProfileUpdateRequest.setStatus(RequestStatus.CREATED);
            userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.PENDING);
            userProfileUpdateRequest.setRequestDate(LocalDateTime.now());
            userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
        }

        BeanUtils.copyProperties(userProfileUpdateRequest,userProfileUpdateRequestDto);
        return userProfileUpdateRequestDto;
    }

//    public UserProfileUpdateRequestDto ApproveProfileRequest(UserProfileUpdateRequestDto userProfileUpdateRequestDto) {
//        UserProfileUpdateRequest userProfileUpdateRequest = userProfileUpdateRequestRepo.findById(userProfileUpdateRequestDto.getId()).get();
//        userProfileUpdateRequest.setApprovalStatus(ApprovalStatus.APPROVED);
//        User aprrover= userRepo.findById(userProfileUpdateRequestDto.getApprover().getUserId()).get();
//        userProfileUpdateRequest.setApprover(aprrover);
//        userProfileUpdateRequest.setApprovalDate(LocalDateTime.now());
//        userProfileUpdateRequest.setLastModifiedtime(LocalDateTime.now());
//        userProfileUpdateRequest = userProfileUpdateRequestRepo.save(userProfileUpdateRequest);
//        BeanUtils.copyProperties(userProfileUpdateRequest,userProfileUpdateRequestDto);
//    return userProfileUpdateRequestDto;
//    }
public TransactionDto createTransactionRequest(TransactionDto transactionDto) {
    Transaction transaction =new Transaction();
    if (transactionDto.getTransactionId() == null) {
        //creation of request
        //GET SENDER,RECEIVER ACCOUNT DETAILS,user,transaction type,amount
        User user = userRepo.findById(transactionDto.getUser().getUserId()).get();

        Account senderAcc = accountRepo.findbyaccountnumber(transactionDto.getSenderAcc().getAccountNumber());
        Account receiverAcc = accountRepo.findbyaccountnumber(transactionDto.getReceiverAcc().getAccountNumber());
        transaction.setSenderAcc(senderAcc);
        transaction.setReceiverAcc(receiverAcc);
        transaction.setUser(user);
        transaction.setTransactionType(transactionDto.getTransactionType());
        transaction.setAmount(transactionDto.getAmount());
        transaction.setStatus(RequestStatus.CREATED.toString());
        transaction.setCreatedtime(LocalDateTime.now());

        transaction=transactionRepo.save(transaction);
//        BeanUtils.copyProperties(transaction,transactionDto);
        if (transaction.getTransactionId() == null){
            throw new RuntimeException("Error saving transaction");
        }
        TransactionAuthorization transactionAuthorization = new TransactionAuthorization();
        transactionAuthorization.setTransaction(transaction);
        transactionAuthorization.setStatus(ApprovalStatus.PENDING.toString());
        transactionAuthorization.setCreatedtime(LocalDateTime.now());
        transactionAuthorization=transactionAuthorizationRepo.save(transactionAuthorization);

        if (transactionAuthorization.getAuthorizationId() == null){
            throw new RuntimeException("Error creating transaction request");
        }
        transaction.setStatus(RequestStatus.PENDING.toString());
        transaction.setLastModifiedtime(LocalDateTime.now());
        transaction=transactionRepo.save(transaction);
        BeanUtils.copyProperties(transaction,transactionDto);
    }
    return transactionDto;
}

    public TransactionDto createDeleteTransactionRequest(TransactionDto transactionDto, String TransactionType) {
        Transaction transaction =new Transaction();
        if (transactionDto.getTransactionId() == null) {
            //creation of request
            //GET SENDER,RECEIVER ACCOUNT DETAILS,user,transaction type,amount
            User user = userRepo.findById(transactionDto.getUser().getUserId()).get();

            Account senderAcc = accountRepo.findbyaccountnumber(transactionDto.getSenderAcc().getAccountNumber());
            //Account receiverAcc = accountRepo.findbyaccountnumber(transactionDto.getReceiverAcc().getAccountNumber());
            transaction.setSenderAcc(senderAcc);
            //transaction.setReceiverAcc(receiverAcc);
            transaction.setUser(user);
            transaction.setTransactionType(transactionDto.getTransactionType());
            transaction.setAmount(transactionDto.getAmount());
            transaction.setStatus(RequestStatus.CREATED.toString());
            transaction.setCreatedtime(LocalDateTime.now());

            transaction=transactionRepo.save(transaction);
//        BeanUtils.copyProperties(transaction,transactionDto);
            if (transaction.getTransactionId() == null){
                throw new RuntimeException("Error saving transaction");
            }
            TransactionAuthorization transactionAuthorization = new TransactionAuthorization();
            transactionAuthorization.setTransaction(transaction);
            transactionAuthorization.setStatus(ApprovalStatus.PENDING.toString());
            transactionAuthorization.setCreatedtime(LocalDateTime.now());
            transactionAuthorization=transactionAuthorizationRepo.save(transactionAuthorization);

            if (transactionAuthorization.getAuthorizationId() == null){
                throw new RuntimeException("Error creating transaction request");
            }
            transaction.setStatus(RequestStatus.PENDING.toString());
            transaction.setLastModifiedtime(LocalDateTime.now());
            transaction=transactionRepo.save(transaction);
            BeanUtils.copyProperties(transaction,transactionDto);
        }
        return transactionDto;
    }

    public TransactionAuthorizationDto approveTransactionRequest(TransactionAuthorizationDto transactionAuthorizationDto) {
        TransactionAuthorization transactionAuthorization = new TransactionAuthorization();
        transactionAuthorization= transactionAuthorizationRepo.findByTransactionId(transactionAuthorizationDto.getTransaction().getTransactionId());
        Transaction transaction=transactionRepo.findById(transactionAuthorization.getTransaction().getTransactionId()).get();
        if (transaction.getStatus().equals(RequestStatus.PENDING.toString())  && transactionAuthorization.getStatus().equals(ApprovalStatus.PENDING.toString())){
            User approver = userRepo.findByUsername(transactionAuthorizationDto.getUser().getUsername());
            if (approver == null) {
                throw new RuntimeException("Approver user not found");
            }
            transactionAuthorization.setTransaction(transaction);
            transactionAuthorization.setStatus(ApprovalStatus.APPROVED.toString());
            transactionAuthorization.setLastModifiedtime(LocalDateTime.now());
            transactionAuthorization.setUser(approver);

            switch (transaction.getTransactionType()) {
                case "TRANSFER_FUNDS":
                    accountService.transferFunds(transaction);
                    break;
                case "DEBIT":
                case "CREDIT": // Both "DEBIT" and "CREDIT" will execute this code
                    accountService.executeTransaction(transaction);
                    break;
                case "DELETE":
                    accountService.setAccountInactive(transaction);
                    break;
                default:
                    throw new RuntimeException("Unsupported transaction type");
            }
            transactionAuthorization=transactionAuthorizationRepo.save(transactionAuthorization);
            BeanUtils.copyProperties(transactionAuthorizationDto,transactionAuthorization);
        }
        else{
            throw new RuntimeException( "check the request again");
        }

        return transactionAuthorizationDto;
    }

    public TransactionAuthorizationDto rejectTransactionRequest(TransactionAuthorizationDto transactionAuthorizationDto) {

        TransactionAuthorization transactionAuthorization = new TransactionAuthorization();
        transactionAuthorization= transactionAuthorizationRepo.findByTransactionId(transactionAuthorizationDto.getTransaction().getTransactionId());
        Transaction transaction=transactionRepo.findById(transactionAuthorization.getTransaction().getTransactionId()).get();
        if (transaction.getStatus().equals(RequestStatus.PENDING.toString())  && transactionAuthorization.getStatus().equals(ApprovalStatus.PENDING.toString())){
            User approver = userRepo.findByUsername(transactionAuthorizationDto.getUser().getUsername());
            transactionAuthorization.setTransaction(transaction);
            transactionAuthorization.setStatus(ApprovalStatus.REJECTED.toString());
            transactionAuthorization.setLastModifiedtime(LocalDateTime.now());
            transactionAuthorization.setUser(approver);
            transactionAuthorization=transactionAuthorizationRepo.save(transactionAuthorization);
            BeanUtils.copyProperties(transactionAuthorizationDto,transactionAuthorization);
        }
        else{
            throw new RuntimeException( "check the request again");
        }

        return transactionAuthorizationDto;
    }

    public List<Transaction> getAllTransactions() {
        List<Transaction> transactions = transactionRepo.findAll();
//        List<TransactionDto> transactionsDto = new ArrayList<>();
//        transactions.forEach(req -> {
//            TransactionDto transaction = new TransactionDto();
//            BeanUtils.copyProperties(req,transaction);
////            User user = req.getUser();
////            UserRole userRole = user.getRole();
////            Set<User> empty = new HashSet<>();
////            userRole.setUsers(empty);
////            user.setRole(userRole);
////            req.setUser(user);
//            transactionsDto.add(transaction);
//        });

        return transactions;
    }
    public List<Transaction> getAllTransactionsUsingSenderId(Integer id) {
        return transactionRepo.findAllTransactionsByAccountId(id);
    }

    public List<Transaction> getAllTransactionsUsingaccountNumber(String accNumber) {
        Account account = accountRepo.findbyaccountnumber(accNumber);
        return transactionRepo.findAllTransactionsByAccountNumber(account.getAccountId());
    }


    public TransactionDto updateTransaction(TransactionDto updatedTransaction) {
        Transaction transaction = transactionRepo.findById(updatedTransaction.getTransactionId()).get();

        if(!updatedTransaction.getSenderAcc().getAccountNumber().equals(transaction.getSenderAcc().getAccountNumber())){
            transaction.setSenderAcc(accountRepo.findbyaccountnumber(updatedTransaction.getSenderAcc().getAccountNumber()));
        }
        if(!updatedTransaction.getReceiverAcc().getAccountNumber().equals(transaction.getReceiverAcc().getAccountNumber())){
            transaction.setReceiverAcc(accountRepo.findbyaccountnumber(updatedTransaction.getReceiverAcc().getAccountNumber()));
        }
        //sender, receiver, type, amount, status.

        if(!updatedTransaction.getTransactionType().equals(transaction.getTransactionType())){
            transaction.setTransactionType(updatedTransaction.getTransactionType());
        }
        if(!updatedTransaction.getAmount().equals(transaction.getAmount())) {
            transaction.setAmount(updatedTransaction.getAmount());
        }

        if(!updatedTransaction.getStatus().equals(transaction.getStatus())){
            transaction.setStatus(updatedTransaction.getStatus().toString());
        }
        transaction.setLastModifiedtime(LocalDateTime.now());
        System.out.println(transaction);
        transaction = transactionRepo.save(transaction);


        BeanUtils.copyProperties(transaction,updatedTransaction);
        return updatedTransaction;
    }

}

