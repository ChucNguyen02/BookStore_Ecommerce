package chucnguyen.bookstore.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    // THÊM MỚI: Danh sách cart item IDs được chọn để checkout
    // Nếu null hoặc empty, sẽ checkout toàn bộ giỏ hàng
    private List<String> selectedCartItemIds;

    // Shipping info
    @NotBlank(message = "Shipping name is required")
    private String shippingName;

    @NotBlank(message = "Shipping phone is required")
    @Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Phone number is invalid")
    private String shippingPhone;

    @NotBlank(message = "Shipping address is required")
    private String shippingAddress;

    // Or use address ID
    private String addressId;

    // Payment
    @NotBlank(message = "Payment method is required")
    private String paymentMethod; // COD, MOMO, VNPAY

    // Optional
    private String voucherCode;
    private Integer pointsToUse;
    private String note;
}