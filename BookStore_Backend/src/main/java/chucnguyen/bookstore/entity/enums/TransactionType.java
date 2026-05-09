package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum TransactionType {
    EARN("Earn"),
    REDEEM("Redeem"),
    EXPIRE("Expire"),
    REFUND("Refund"),
    BONUS("Bonus");

    private final String message;

    TransactionType(String message) {
        this.message = message;
    }
}
