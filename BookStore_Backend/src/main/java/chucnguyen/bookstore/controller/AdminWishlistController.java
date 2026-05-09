package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.service.WishlistService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/wishlist")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Wishlist", description = "Admin wishlist management APIs")
public class AdminWishlistController {

    private final WishlistService wishlistService;

    @GetMapping("/book/{bookId}/users")
    @Operation(summary = "Get users who wishlisted a book")
    public ApiResponse<List<User>> getUsersWhoWishlistedBook(@PathVariable String bookId) {
        return ApiResponse.success(wishlistService.getUsersWhoWishlistedBook(bookId));
    }
}