package chucnguyen.bookstore.entity.enums;

import lombok.Getter;

@Getter
public enum PaymentMethod {
    COD("COD"),
    BANK_TRANSFER("Bank transfer"),
    MOMO("Momo"),
    VNPAY("VNPay"),
    PAYOS("PayOS"),
    LOCAL("Local test");

    private final String message;

    PaymentMethod(String message) {
        this.message = message;
    }
}
