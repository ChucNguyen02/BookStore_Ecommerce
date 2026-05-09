package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.AddToCartRequest;
import chucnguyen.bookstore.dto.request.UpdateCartItemRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.CartItemResponse;
import chucnguyen.bookstore.dto.response.CartResponse;
import chucnguyen.bookstore.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Cart", description = "Shopping cart APIs")
public class CartController {

    private final CartService cartService;

    @GetMapping
    @Operation(summary = "Get shopping cart")
    public ApiResponse<CartResponse> getCart(Authentication authentication) {
        return ApiResponse.success(cartService.getCart(authentication.getName()));
    }

    @PostMapping
    @Operation(summary = "Add item to cart")
    public ApiResponse<CartResponse> addToCart(
            Authentication authentication,
            @Valid @RequestBody AddToCartRequest request) {
        cartService.addToCart(authentication.getName(), request);
        CartResponse fullCart = cartService.getCart(authentication.getName());
        return ApiResponse.success(fullCart, "Item added to cart");
    }

    @PutMapping("/{cartItemId}")
    @Operation(summary = "Update cart item quantity")
    public ApiResponse<CartItemResponse> updateCartItem(
            Authentication authentication,
            @PathVariable String cartItemId,
            @Valid @RequestBody UpdateCartItemRequest request) {
        return ApiResponse.success(
                cartService.updateCartItem(authentication.getName(), cartItemId, request),
                "Cart item updated");
    }

    @DeleteMapping("/{cartItemId}")
    @Operation(summary = "Remove item from cart")
    public ApiResponse<Void> removeFromCart(
            Authentication authentication,
            @PathVariable String cartItemId) {
        cartService.removeFromCart(authentication.getName(), cartItemId);
        return ApiResponse.success("Item removed from cart");
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear cart")
    public ApiResponse<Void> clearCart(Authentication authentication) {
        cartService.clearCart(authentication.getName());
        return ApiResponse.success("Cart cleared");
    }

    @GetMapping("/check/{bookId}")
    @Operation(summary = "Check if book is in cart")
    public ApiResponse<Boolean> isBookInCart(
            Authentication authentication,
            @PathVariable String bookId) {
        return ApiResponse.success(
                cartService.isBookInCart(authentication.getName(), bookId));
    }

    @GetMapping("/count")
    @Operation(summary = "Get cart items count")
    public ApiResponse<Long> countCartItems(Authentication authentication) {
        return ApiResponse.success(
                cartService.countCartItems(authentication.getName()));
    }
}