package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum NotificationType {
    ORDER("Order"),
    PROMOTION("Promotion"),
    SYSTEM("System"),
    REVIEW("Review"),
    WISHLIST("Wishlist"),
    POINTS("Points"),
    QUESTION("Question");

    private final String message;

    NotificationType(String message) {
        this.message = message;
    }
}
