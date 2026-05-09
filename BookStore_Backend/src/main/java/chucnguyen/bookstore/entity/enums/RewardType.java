package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum RewardType {
    BOOK("Book"),
    VOUCHER("Voucher"),
    GIFT("Gift");

    private final String message;

    RewardType(String message) {
        this.message = message;
    }
}
