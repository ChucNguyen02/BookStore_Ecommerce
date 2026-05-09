package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum Tier {
    BRONZE("Broze"),
    SILVER("Silver"),
    GOLD("Gold"),
    PLATINUM("Platinum");

    private final String message;

    Tier(String message) {
        this.message = message;
    }
}
