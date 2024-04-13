package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepo extends JpaRepository<Payment, Integer> {
}
