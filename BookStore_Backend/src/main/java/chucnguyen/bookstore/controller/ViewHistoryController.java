package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.service.ViewHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/view-history")
@RequiredArgsConstructor
@Tag(name = "View History", description = "Book viewing history APIs")
public class ViewHistoryController {

    private final ViewHistoryService viewHistoryService;

    @PostMapping("/record/{bookId}")
    @Operation(summary = "Record book view")
    public ApiResponse<Integer> recordView(
                                             Authentication authentication,
                                             @PathVariable String bookId) {

        if (authentication != null && authentication.isAuthenticated()) {
            int newViewCount = viewHistoryService.recordView(authentication.getName(), bookId);
            return ApiResponse.success(newViewCount, "View recorded");
        }

        return ApiResponse.success(null, "View not recorded (not authenticated)");
    }

    @GetMapping
    @Operation(summary = "Get view history")
    public ApiResponse<PageResponse<BookResponse>> getViewHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                viewHistoryService.getViewHistory(authentication.getName(), page, size));
    }

    @GetMapping("/most-viewed")
    @Operation(summary = "Get most viewed books")
    public ApiResponse<List<BookResponse>> getMostViewedBooks(
            Authentication authentication,
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.success(
                viewHistoryService.getMostViewedBooks(authentication.getName(), limit));
    }

    @DeleteMapping("/clear")
    @Operation(summary = "Clear view history")
    public ApiResponse<Void> clearViewHistory(Authentication authentication) {
        viewHistoryService.clearViewHistory(authentication.getName());
        return ApiResponse.success("View history cleared");
    }
}