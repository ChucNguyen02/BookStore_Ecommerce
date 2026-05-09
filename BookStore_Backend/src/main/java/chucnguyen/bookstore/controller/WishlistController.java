package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.WishlistResponse;
import chucnguyen.bookstore.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/wishlist")
@RequiredArgsConstructor
@Tag(name = "Wishlist", description = "Wishlist management APIs")
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    @Operation(summary = "Get user wishlist")
    public ApiResponse<PageResponse<WishlistResponse>> getUserWishlist(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                wishlistService.getUserWishlist(authentication.getName(), page, size));
    }

    @PostMapping("/{bookId}")
    @Operation(summary = "Add book to wishlist")
    public ApiResponse<WishlistResponse> addToWishlist(
            Authentication authentication,
            @PathVariable String bookId) {
        return ApiResponse.success(
                wishlistService.addToWishlist(authentication.getName(), bookId),
                "Book added to wishlist");
    }

    @DeleteMapping("/{bookId}")
    @Operation(summary = "Remove book from wishlist")
    public ApiResponse<Void> removeFromWishlist(
            Authentication authentication,
            @PathVariable String bookId) {
        wishlistService.removeFromWishlist(authentication.getName(), bookId);
        return ApiResponse.success("Book removed from wishlist");
    }

    @GetMapping("/check/{bookId}")
    @Operation(summary = "Check if book is in wishlist")
    public ApiResponse<Boolean> isInWishlist(
            Authentication authentication,
            @PathVariable String bookId) {
        return ApiResponse.success(
                wishlistService.isInWishlist(authentication.getName(), bookId));
    }

    @GetMapping("/item/{bookId}")
    @Operation(summary = "Get wishlist item")
    public ApiResponse<WishlistResponse> getWishlistItem(
            Authentication authentication,
            @PathVariable String bookId) {
        return ApiResponse.success(
                wishlistService.getWishlistItem(authentication.getName(), bookId));
    }

    @GetMapping("/count")
    @Operation(summary = "Count wishlist items")
    public ApiResponse<Long> countWishlistItems(Authentication authentication) {
        return ApiResponse.success(
                wishlistService.countWishlistItems(authentication.getName()));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear wishlist")
    public ApiResponse<Void> clearWishlist(Authentication authentication) {
        wishlistService.clearWishlist(authentication.getName());
        return ApiResponse.success("Wishlist cleared");
    }
}