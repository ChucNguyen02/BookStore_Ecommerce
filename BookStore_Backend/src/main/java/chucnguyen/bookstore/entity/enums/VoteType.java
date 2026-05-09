package chucnguyen.bookstore.entity.enums;


import lombok.Getter;

@Getter
public enum VoteType {
    HELPFUL("Helpful"),
    UNHELPFUL("Unhelpful");

    private final String message;

    VoteType(String message) {
        this.message = message;
    }
}
