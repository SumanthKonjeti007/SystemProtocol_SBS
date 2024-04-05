package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.Account;
import com.securebanking.sbs.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepo extends JpaRepository<Transaction, Integer> {

    @Query("SELECT t FROM Transaction t WHERE t.senderAcc = :account AND t.status = :status")
    List<Transaction> findByAccountAndStatus(@Param("account") Account account, @Param("status") String status);

    @Query("SELECT t FROM Transaction t WHERE t.user.userId = :id")
    List<Transaction> findAllTransactionsByAccountId(Integer id);

    @Query("SELECT t FROM Transaction t WHERE t.senderAcc.accountId = :accId or t.receiverAcc.accountId = :accId")
    List<Transaction> findAllTransactionsByAccountNumber(Integer accId);


}
