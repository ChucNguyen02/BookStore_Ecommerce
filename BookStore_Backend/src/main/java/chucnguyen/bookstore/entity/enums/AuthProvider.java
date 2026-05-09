package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum AuthProvider {
    LOCAL("Local"),
    GOOGLE("Google");


    private final String message;

    AuthProvider(String message) {
        this.message = message;
    }
}
