package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.VoucherResponse;
import chucnguyen.bookstore.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
@Tag(name = "Vouchers", description = "Voucher management APIs")
public class VoucherController {

    private final VoucherService voucherService;

    @GetMapping
    @Operation(summary = "Get available vouchers")
    public ApiResponse<List<VoucherResponse>> getAvailableVouchers(
            Authentication authentication) {
        return ApiResponse.success(
                voucherService.getAvailableVouchers(authentication.getName()));
    }

    @GetMapping("/{code}")
    @Operation(summary = "Get voucher by code")
    public ApiResponse<VoucherResponse> getVoucherByCode(@PathVariable String code) {
        return ApiResponse.success(voucherService.getVoucherByCode(code));
    }

    @PostMapping("/validate/{code}")
    @Operation(summary = "Validate voucher")
    public ApiResponse<VoucherResponse> validateVoucher(
            Authentication authentication,
            @PathVariable String code) {
        return ApiResponse.success(
                voucherService.validateVoucher(authentication.getName(), code),
                "Voucher is valid");
    }

    @GetMapping("/all-available")
    @Operation(summary = "Get all available vouchers (public)")
    public ApiResponse<List<VoucherResponse>> getAllAvailableVouchers() {
        return ApiResponse.success(voucherService.getAllAvailableVouchers());
    }

    @GetMapping("/check-valid/{code}")
    @Operation(summary = "Quick check if voucher code is valid")
    public ApiResponse<Boolean> isVoucherValid(@PathVariable String code) {
        return ApiResponse.success(voucherService.isVoucherValid(code));
    }
}