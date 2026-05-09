package chucnguyen.bookstore.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ErrorCode {

    //Chung
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid message key", HttpStatus.BAD_REQUEST),
    INVALID_REQUEST(1002, "Invalid request", HttpStatus.BAD_REQUEST),

    // authentication
    UNAUTHENTICATED(2001, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(2002, "You do not have permission", HttpStatus.FORBIDDEN),
    INVALID_CREDENTIALS(2003, "Invalid email or password", HttpStatus.UNAUTHORIZED),
    TOKEN_INVALID(2004, "Token is invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(2005, "Token has expired", HttpStatus.UNAUTHORIZED),

    // user
    USER_NOT_FOUND(3001, "User not found", HttpStatus.NOT_FOUND),
    USER_ALREADY_EXISTS(3002, "User already exists", HttpStatus.CONFLICT),
    EMAIL_ALREADY_EXISTS(3003, "Email is already registered", HttpStatus.CONFLICT),
    USER_INACTIVE(3004, "User account is inactive", HttpStatus.FORBIDDEN),

    // book
    BOOK_NOT_FOUND(4001, "Book not found", HttpStatus.NOT_FOUND),
    BOOK_OUT_OF_STOCK(4002, "Book is out of stock", HttpStatus.BAD_REQUEST),
    INSUFFICIENT_STOCK(4003, "Insufficient stock quantity", HttpStatus.BAD_REQUEST),
    BOOK_ALREADY_EXISTS(4004, "Book with this ISBN already exists", HttpStatus.CONFLICT),

    // category
    CATEGORY_NOT_FOUND(4101, "Category not found", HttpStatus.NOT_FOUND),
    CATEGORY_ALREADY_EXISTS(4102, "Category already exists", HttpStatus.CONFLICT),

    // author
    AUTHOR_NOT_FOUND(4201, "Author not found", HttpStatus.NOT_FOUND),

    // order
    ORDER_NOT_FOUND(5001, "Order not found", HttpStatus.NOT_FOUND),
    ORDER_CANNOT_BE_CANCELLED(5002, "Order cannot be cancelled", HttpStatus.BAD_REQUEST),
    INVALID_ORDER_STATUS(5003, "Invalid order status transition", HttpStatus.BAD_REQUEST),
    ORDER_ALREADY_CANCELLED(5004, "Order is already cancelled", HttpStatus.BAD_REQUEST),

    // cart
    CART_ITEM_NOT_FOUND(5101, "Cart item not found", HttpStatus.NOT_FOUND),
    CART_IS_EMPTY(5102, "Cart is empty", HttpStatus.BAD_REQUEST),


    // payment
    PAYMENT_FAILED(5201, "Payment failed", HttpStatus.BAD_REQUEST),
    INVALID_PAYMENT_METHOD(5202, "Invalid payment method", HttpStatus.BAD_REQUEST),

    // voucher
    VOUCHER_NOT_FOUND(6001, "Voucher not found", HttpStatus.NOT_FOUND),
    VOUCHER_INVALID(6002, "Voucher is invalid or expired", HttpStatus.BAD_REQUEST),
    VOUCHER_ALREADY_USED(6003, "Voucher has been used", HttpStatus.BAD_REQUEST),
    VOUCHER_MIN_ORDER_NOT_MET(6004, "Minimum order value not met for voucher", HttpStatus.BAD_REQUEST),

    // points
    INSUFFICIENT_POINTS(7001, "Insufficient points", HttpStatus.BAD_REQUEST),
    ALREADY_CHECKED_IN(7002, "Already checked in today", HttpStatus.BAD_REQUEST),
    POINTS_TRANSACTION_FAILED(7003, "Points transaction failed", HttpStatus.INTERNAL_SERVER_ERROR),

    // reward
    REWARD_NOT_FOUND(7101, "Reward not found", HttpStatus.NOT_FOUND),
    REWARD_NOT_AVAILABLE(7102, "Reward is not available", HttpStatus.BAD_REQUEST),
    REWARD_OUT_OF_STOCK(7103, "Reward is out of stock", HttpStatus.BAD_REQUEST),

    // review
    REVIEW_NOT_FOUND(8001, "Review not found", HttpStatus.NOT_FOUND),
    REVIEW_ALREADY_EXISTS(8002, "You have already reviewed this book", HttpStatus.CONFLICT),
    USER_HAS_NOT_PURCHASED(8003, "You must purchase this book before reviewing", HttpStatus.FORBIDDEN),
    REVIEW_NOT_ALLOWED(8004, "Review is not allowed", HttpStatus.FORBIDDEN),

    // question
    QUESTION_NOT_FOUND(8101, "Question not found", HttpStatus.NOT_FOUND),
    ANSWER_NOT_FOUND(8102, "Answer not found", HttpStatus.NOT_FOUND),

    // address
    ADDRESS_NOT_FOUND(9001, "Address not found", HttpStatus.NOT_FOUND),

    // file
    FILE_UPLOAD_FAILED(9101, "File upload failed", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_FILE_TYPE(9102, "Invalid file type", HttpStatus.BAD_REQUEST),
    FILE_TOO_LARGE(9103, "File size exceeds maximum limit", HttpStatus.BAD_REQUEST),

    // validation
    INVALID_INPUT(9201, "Invalid input data", HttpStatus.BAD_REQUEST),
    VALIDATION_FAILED(9202, "Validation failed", HttpStatus.BAD_REQUEST),

    // rate limit
    RATE_LIMIT_EXCEEDED(9301, "Too many requests, please try again later", HttpStatus.TOO_MANY_REQUESTS),

    // Email Change related
    INVALID_TOKEN(4011, "Invalid or expired token", HttpStatus.BAD_REQUEST),
    TOKEN_ALREADY_USED(4013, "Token has already been used", HttpStatus.BAD_REQUEST),
    EMAIL_SEND_FAILED(5301, "Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR),
    CANNOT_DELETE_ACCOUNT_WITH_PENDING_ORDERS(3005,
            "Cannot delete account with pending orders",
            HttpStatus.CONFLICT),

    CANNOT_DELETE_ACCOUNT_WITH_PENDING_PAYMENTS(3006,
            "Cannot delete account with pending payments",
            HttpStatus.CONFLICT),

    ORDER_ALREADY_PAID(5203, "Order has already been paid", HttpStatus.CONFLICT),
    PAYMENT_GATEWAY_ERROR(5204, "Payment gateway error occurred", HttpStatus.BAD_GATEWAY),
    PAYMENT_SIGNATURE_INVALID(5205, "Payment signature verification failed", HttpStatus.BAD_REQUEST),
    PAYMENT_AMOUNT_MISMATCH(5206, "Payment amount does not match order amount", HttpStatus.BAD_REQUEST),

    SYSTEM_ERROR(9999, "Internal system error", HttpStatus.INTERNAL_SERVER_ERROR),


    TOO_MANY_FILES(9104, "Too many files uploaded at once", HttpStatus.BAD_REQUEST),
    IMAGE_NOT_FOUND(9105, "Image not found", HttpStatus.NOT_FOUND),

    INVALID_FILE(1050, "Invalid file", HttpStatus.BAD_REQUEST),
    IMAGE_UPLOAD_FAILED(1053, "Failed to upload image", HttpStatus.BAD_REQUEST),
    INVALID_IMAGE_URL(1054, "Invalid image URL", HttpStatus.BAD_REQUEST),

    ;


    private final int code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(int code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }
}
