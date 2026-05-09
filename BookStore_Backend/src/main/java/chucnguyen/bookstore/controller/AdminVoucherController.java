package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.VoucherRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.VoucherResponse;
import chucnguyen.bookstore.service.AdminVoucherService;
import chucnguyen.bookstore.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/vouchers")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Vouchers", description = "Admin voucher management APIs")
public class AdminVoucherController {

    private final AdminVoucherService adminVoucherService;
    private final VoucherService voucherService;

    @PostMapping
    @Operation(summary = "Create voucher")
    public ApiResponse<VoucherResponse> createVoucher(
            @Valid @RequestBody VoucherRequest request) {
        return ApiResponse.success(
                adminVoucherService.createVoucher(request),
                "Voucher created successfully");
    }

    @PutMapping("/{voucherId}")
    @Operation(summary = "Update voucher")
    public ApiResponse<VoucherResponse> updateVoucher(
            @PathVariable String voucherId,
            @Valid @RequestBody VoucherRequest request) {
        return ApiResponse.success(
                adminVoucherService.updateVoucher(voucherId, request),
                "Voucher updated successfully");
    }

    @DeleteMapping("/{voucherId}")
    @Operation(summary = "Delete voucher")
    public ApiResponse<Void> deleteVoucher(@PathVariable String voucherId) {
        adminVoucherService.deleteVoucher(voucherId);
        return ApiResponse.success("Voucher deleted successfully");
    }

    @GetMapping
    @Operation(summary = "Get all vouchers")
    public ApiResponse<PageResponse<VoucherResponse>> getAllVouchers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(adminVoucherService.getAllVouchers(page, size));
    }

    @GetMapping("/{voucherId}")
    @Operation(summary = "Get voucher detail")
    public ApiResponse<VoucherResponse> getVoucherById(@PathVariable String voucherId) {
        return ApiResponse.success(adminVoucherService.getVoucherById(voucherId));
    }

    @PatchMapping("/{voucherId}/toggle-active")
    @Operation(summary = "Toggle voucher active status")
    public ApiResponse<VoucherResponse> toggleVoucherActive(@PathVariable String voucherId) {
        return ApiResponse.success(
                adminVoucherService.toggleVoucherActive(voucherId),
                "Voucher status updated");
    }

    @GetMapping("/expiring")
    @Operation(summary = "Get vouchers expiring soon")
    public ApiResponse<List<VoucherResponse>> getExpiringVouchers(
            @RequestParam(defaultValue = "7") int daysBeforeExpiry) {
        return ApiResponse.success(voucherService.getExpiringVouchers(daysBeforeExpiry));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get voucher statistics")
    public ApiResponse<Object> getVoucherStatistics() {
        return ApiResponse.success(adminVoucherService.getVoucherStatistics());
    }

    @PostMapping("/bulk-create")
    @Operation(summary = "Bulk create vouchers")
    public ApiResponse<List<VoucherResponse>> bulkCreateVouchers(
            @Valid @RequestBody VoucherRequest request,
            @RequestParam int quantity) {
        return ApiResponse.success(
                adminVoucherService.bulkCreateVouchers(request, quantity),
                quantity + " vouchers created successfully");
    }
}