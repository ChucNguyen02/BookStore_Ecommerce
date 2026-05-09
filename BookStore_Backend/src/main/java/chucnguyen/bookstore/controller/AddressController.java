package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.AddressRequest;
import chucnguyen.bookstore.dto.response.AddressResponse;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.service.AddressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses", description = "Address management APIs")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    @Operation(summary = "Get user addresses")
    public ApiResponse<List<AddressResponse>> getUserAddresses(Authentication authentication) {
        return ApiResponse.success(addressService.getUserAddresses(authentication.getName()));
    }

    @PostMapping
    @Operation(summary = "Create new address")
    public ApiResponse<AddressResponse> createAddress(
            Authentication authentication,
            @Valid @RequestBody AddressRequest request) {
        return ApiResponse.success(
                addressService.createAddress(authentication.getName(), request),
                "Address created successfully");
    }

    @PutMapping("/{addressId}")
    @Operation(summary = "Update address")
    public ApiResponse<AddressResponse> updateAddress(
            Authentication authentication,
            @PathVariable String addressId,
            @Valid @RequestBody AddressRequest request) {
        return ApiResponse.success(
                addressService.updateAddress(authentication.getName(), addressId, request),
                "Address updated successfully");
    }

    @DeleteMapping("/{addressId}")
    @Operation(summary = "Delete address")
    public ApiResponse<Void> deleteAddress(
            Authentication authentication,
            @PathVariable String addressId) {
        addressService.deleteAddress(authentication.getName(), addressId);
        return ApiResponse.success("Address deleted successfully");
    }

    @PatchMapping("/{addressId}/default")
    @Operation(summary = "Set as default address")
    public ApiResponse<AddressResponse> setDefaultAddress(
            Authentication authentication,
            @PathVariable String addressId) {
        return ApiResponse.success(
                addressService.setDefaultAddress(authentication.getName(), addressId),
                "Default address set successfully");
    }

    @GetMapping("/default")
    @Operation(summary = "Get default address")
    public ApiResponse<AddressResponse> getDefaultAddress(Authentication authentication) {
        return ApiResponse.success(addressService.getDefaultAddress(authentication.getName()));
    }

    @GetMapping("/count")
    @Operation(summary = "Count user addresses")
    public ApiResponse<Long> countUserAddresses(Authentication authentication) {
        return ApiResponse.success(addressService.countUserAddresses(authentication.getName()));
    }

    @DeleteMapping("/all")
    @Operation(summary = "Delete all addresses")
    public ApiResponse<Void> deleteAllUserAddresses(Authentication authentication) {
        addressService.deleteAllUserAddresses(authentication.getName());
        return ApiResponse.success("All addresses deleted");
    }
}