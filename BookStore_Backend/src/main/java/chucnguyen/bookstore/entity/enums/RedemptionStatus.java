package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum RedemptionStatus {
    PENDING("Pending"),
    PROCESSING("Processing"),
    COMPLETED("Completed"),
    CANCELLED("Cancelled");

    private final String message;

    RedemptionStatus(String message) {
        this.message = message;
    }
}
