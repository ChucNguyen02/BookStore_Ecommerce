package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING("Pending"),
    PAYMENT_PENDING("Payment Pending"),
    CONFIRMED("Confirmed"),
    SHIPPING("Shipping"),
    DELIVERED("Delivered"),
    CANCELLED("Cancelled"),
    RETURNED("Returned");

    private final String message;

    OrderStatus(String message) {
        this.message = message;
    }
}