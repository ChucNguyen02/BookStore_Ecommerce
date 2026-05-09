package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum PaymentStatus {
    PENDING("Pending"),
    PAID("Paid"),
    FAILED("Failed"),
    REFUNDED("Refunded");

    private final String message;

    PaymentStatus(String message) {
        this.message = message;
    }
}
