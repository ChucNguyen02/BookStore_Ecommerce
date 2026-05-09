package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum ReferenceType {
    ORDER("Oder"),
    REVIEW("Review"),
    DAILY_CHECK_IN("Daily check in"),
    REFERRAL("Referral"),
    REWARD_REDEMPTION("Reward redemption"),
    ADMIN_ADJUSTMENT("Admin adjustment");

    private final String message;

    ReferenceType(String message) {
        this.message = message;
    }
}
