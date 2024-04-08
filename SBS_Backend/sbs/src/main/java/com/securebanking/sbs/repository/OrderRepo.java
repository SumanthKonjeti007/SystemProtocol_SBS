package com.securebanking.sbs.repository;

import com.securebanking.sbs.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepo extends JpaRepository<Order, Integer>{
}
