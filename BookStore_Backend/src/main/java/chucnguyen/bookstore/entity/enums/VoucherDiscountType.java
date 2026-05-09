package chucnguyen.bookstore.entity.enums;


import lombok.Getter;

@Getter
public enum VoucherDiscountType {
    PERCENTAGE("Percentage"),
    FIXED_AMOUNT("Fixed amount");

    private final String message;

    VoucherDiscountType(String message) {
        this.message = message;
    }
}
