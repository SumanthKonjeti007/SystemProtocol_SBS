package com.securebanking.sbs.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.securebanking.sbs.controller.service.RequestService;
import com.securebanking.sbs.dto.TransactionAuthorizationDto;
import com.securebanking.sbs.dto.TransactionDto;
import com.securebanking.sbs.dto.UserProfileUpdateRequestDto;
import com.securebanking.sbs.model.Transaction;
import com.securebanking.sbs.model.UserProfileUpdateRequest;
import com.securebanking.sbs.util.JwtTokenRequired;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transaction")
public class RequestController {

//    @PostMapping("/requestTransaction")
//    @CrossOrigin(origins = "*")
//    public TransactionAuthorizationDto

    @Autowired
    RequestService requestService;

//    @GetMapping("/allTransactionRequests")
//    @CrossOrigin(origins = "*")
//    public TransactionAuthorizationDto getAllTranctionRequests(TransactionAuthorizationDto transactionAuthorizationDto) {
//        return requestService.getAllTranctionRequests(transactionAuthorizationDto);
//    }

    @PostMapping("/request")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public TransactionDto newTransactionRequest(@RequestBody TransactionDto transactionDto){
        return requestService.createTransactionRequest(transactionDto);
    }

    @GetMapping("/pendingProfileRequests")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public List<UserProfileUpdateRequestDto> getPendingUpdateRequests() {
        return requestService.getPendingUpdateRequests();
    }

//    @PostMapping("/{requestId}/approve")
//    public ResponseEntity<String> approveUpdateRequest(@PathVariable Long requestId, @RequestParam Long approverId) {
//        requestService.approveUpdateRequest(requestId, approverId);
//        return ResponseEntity.ok("Request approved successfully.");
//    }
    @PostMapping("/updateUserProfile")  // send data to update as json string of new user data in UpdatdData variable.
    @CrossOrigin(origins =  "*")
    @JwtTokenRequired
    public UserProfileUpdateRequestDto createUpdateProfileRequest(@RequestBody UserProfileUpdateRequestDto userProfileUpdateRequestDto)  {
        return requestService.createUpdateProfileRequest(userProfileUpdateRequestDto);

    }

    @PostMapping("/approveRequest") // POST method for approval of transactions
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<String> approveTransaction(@RequestBody TransactionAuthorizationDto transactionAuthorizationDto) {
        try {
            TransactionAuthorizationDto approvedTransaction = requestService.approveTransactionRequest(transactionAuthorizationDto);
            return ResponseEntity.ok("approvedTransaction");
        } catch (Exception e) {
            // Handle the exception, possibly returning a different HTTP status code
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @PostMapping("/rejectRequest") // POST method for approval of transactions
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public ResponseEntity<String> rejectTransaction(@RequestBody TransactionAuthorizationDto transactionAuthorizationDto) {
        try {
            TransactionAuthorizationDto approvedTransaction = requestService.rejectTransactionRequest(transactionAuthorizationDto);
            return ResponseEntity.ok("rejected Transaction");
        } catch (Exception e) {
            // Handle the exception, possibly returning a different HTTP status code
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.toString());
        }
    }

    @GetMapping("/allTransactions")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public List<Transaction> getAllTransactions() {
        return requestService.getAllTransactions();
    }

//    @PostMapping("/updateProfile/Approve")  // send data to update as json string of new user data in UpdatdData variable.
//    public UserProfileUpdateRequestDto ApproveProfileRequest(@RequestBody UserProfileUpdateRequestDto userProfileUpdateRequestDto) throws JsonProcessingException {
//        return requestService.ApproveProfileRequest(userProfileUpdateRequestDto);
//
//    }
    @GetMapping("/allTransaction")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public List<Transaction> getAllTransactionsUsingSenderId(@RequestParam Integer userId) {
        return requestService.getAllTransactionsUsingSenderId(userId);
}


    @GetMapping("/allTransactionbyAccount")
    @CrossOrigin(origins = "*")
   @JwtTokenRequired
    public List<Transaction> getAllTransactionsUsingaccountNumber(@RequestParam String accNumber) {
        return requestService.getAllTransactionsUsingaccountNumber(accNumber);
    }

    @PostMapping("/updateTransaction")
    @JwtTokenRequired
    @CrossOrigin(origins = "*")
    public ResponseEntity<Object> updateTransaction(@RequestBody TransactionDto updatedTransaction) {
        try {
            // Update the transaction with the provided transactionId using updatedTransaction
            TransactionDto result = requestService.updateTransaction(updatedTransaction);
            return ResponseEntity.ok(result); // Return the updated transaction
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Internal server error");
        }
    }
    @GetMapping("/getUserActivity")
    @CrossOrigin(origins = "*")
    @JwtTokenRequired
    public List<Transaction> getUserActivity(@RequestParam Integer userId) {
        return requestService.getUserActivity(userId);
    }

}
