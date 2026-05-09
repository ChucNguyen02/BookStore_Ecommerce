package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.PaymentRequest;
import chucnguyen.bookstore.dto.response.PaymentResponse;
import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.PaymentStatus;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocalPaymentService {

    private final OrderRepository orderRepository;

    @Value("${payment.local.enabled:false}")
    private boolean localPaymentEnabled;

    @Transactional
    public PaymentResponse createPayment(PaymentRequest request) {
        if (!localPaymentEnabled) {
            throw new AppException(ErrorCode.INVALID_PAYMENT_METHOD, "Local payment is disabled");
        }

        Order order = orderRepository.findByOrderCodeWithLock(request.getOrderCode())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getPaymentStatus() == PaymentStatus.PAID) {
            throw new AppException(ErrorCode.ORDER_ALREADY_PAID);
        }

        order.setPaymentStatus(PaymentStatus.PAID);
        order.setStatus(OrderStatus.CONFIRMED);
        order.setTransactionId("LOCAL-" + System.currentTimeMillis());
        order.setConfirmedAt(LocalDateTime.now());
        orderRepository.save(order);

        log.info("Local payment confirmed for order: {}", order.getOrderCode());

        return PaymentResponse.builder()
                .orderCode(order.getOrderCode())
                .amount(order.getTotalAmount())
                .message("Local payment confirmed")
                .build();
    }
}
