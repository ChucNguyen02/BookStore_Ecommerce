package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum DiscountType {
    PERCENTAGE("Percentage"),
    FIXED_AMOUNT("Fixed amount");

    private final String message;

    DiscountType(String message) {
        this.message = message;
    }
}
