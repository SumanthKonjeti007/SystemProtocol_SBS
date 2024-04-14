package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.Order;
import com.securebanking.sbs.model.TransactionAuthorization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer> {

    @Query("SELECT o FROM Order o WHERE o.orderId = :orderId")
    Order findByOrderId(@Param("orderId") Integer orderId);

//    @Query("SELECT t FROM TransactionAuthorization t WHERE t.transaction.transactionId = :transactionId")
//    TransactionAuthorization findByTransactionId(Integer transactionId);
    @Query("SELECT o FROM Order o WHERE o.senderAcc.accountId = :accId")
    List<Order> findAllOrderTransactionsUsingaccountNumber(Integer accId);

//    @Query("SELECT t FROM Transaction t WHERE t.senderAcc.accountId = :accId or t.receiverAcc.accountId = :accId")
//    List<Transaction> findAllTransactionsByAccountNumber(Integer accId);
}
