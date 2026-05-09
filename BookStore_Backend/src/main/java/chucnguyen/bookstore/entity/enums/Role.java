package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum Role {
    USER("User"),
    ADMIN("Admin");

    private final String message;

    Role(String message) {
        this.message = message;
    }
}
