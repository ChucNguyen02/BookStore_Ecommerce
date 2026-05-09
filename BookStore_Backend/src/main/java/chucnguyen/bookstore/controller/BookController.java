package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.BookFilterRequest;
import chucnguyen.bookstore.dto.request.BookRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.BookDetailResponse;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "Books", description = "Book management APIs")
public class BookController {

    private final BookService bookService;

    // ==================== PUBLIC ENDPOINTS ====================

    @GetMapping("/languages")
    public ResponseEntity<ApiResponse<List<String>>> getAvailableLanguages() {
        List<String> languages = bookService.getAvailableLanguages();
        return ResponseEntity.ok(ApiResponse.success(languages));
    }

    @GetMapping
    @Operation(summary = "Get all books with pagination")
    public ApiResponse<PageResponse<BookResponse>> getAllBooks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.getAllBooks(page, size));
    }

    @GetMapping("/id/{id}")
    @Operation(summary = "Get book detail by id")
    public ApiResponse<BookDetailResponse> getBookById(@PathVariable String id) {
        return ApiResponse.success(bookService.getBookById(id));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Get book detail by slug")
    public ApiResponse<BookDetailResponse> getBookDetail(@PathVariable String slug) {
        return ApiResponse.success(bookService.getBookDetail(slug));
    }

    @GetMapping("/search")
    @Operation(summary = "Search books by keyword")
    public ApiResponse<PageResponse<BookResponse>> searchBooks(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.searchBooks(keyword, page, size));
    }

    @PostMapping("/filter")
    @Operation(summary = "Filter books with multiple criteria")
    public ApiResponse<PageResponse<BookResponse>> filterBooks(
            @Valid @RequestBody BookFilterRequest filter) {
        return ApiResponse.success(bookService.filterBooks(filter));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured books")
    public ApiResponse<List<BookResponse>> getFeaturedBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.success(bookService.getFeaturedBooks(limit));
    }

    @GetMapping("/bestsellers")
    @Operation(summary = "Get best selling books")
    public ApiResponse<PageResponse<BookResponse>> getBestSellers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.getBestSellers(page, size));
    }

    @GetMapping("/new-arrivals")
    @Operation(summary = "Get newest books")
    public ApiResponse<PageResponse<BookResponse>> getNewArrivals(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.getNewArrivals(page, size));
    }

    @GetMapping("/on-sale")
    @Operation(summary = "Get books on sale")
    public ApiResponse<PageResponse<BookResponse>> getBooksOnSale(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.getBooksOnSale(page, size));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get books by category")
    public ApiResponse<PageResponse<BookResponse>> getBooksByCategory(
            @PathVariable String categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.getBooksByCategory(categoryId, page, size));
    }

    @GetMapping("/{bookId}/related")
    @Operation(summary = "Get related books")
    public ApiResponse<List<BookResponse>> getRelatedBooks(
            @PathVariable String bookId,
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.success(bookService.getRelatedBooks(bookId, limit));
    }

    @GetMapping("/top-rated")
    @Operation(summary = "Get top rated books")
    public ApiResponse<List<BookResponse>> getTopRatedBooks(
            @RequestParam(defaultValue = "10") int limit) {
        return ApiResponse.success(bookService.getTopRatedBooks(limit));
    }

    @GetMapping("/isbn/{isbn}")
    @Operation(summary = "Get book by ISBN")
    public ApiResponse<BookResponse> getBookByIsbn(@PathVariable String isbn) {
        return ApiResponse.success(bookService.getBookByIsbn(isbn));
    }

    @GetMapping("/author/{authorId}")
    @Operation(summary = "Get books by author")
    public ApiResponse<PageResponse<BookResponse>> getBooksByAuthor(
            @PathVariable String authorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(bookService.getBooksByAuthor(authorId, page, size));
    }

    @GetMapping("/{bookId}/check-stock")
    @Operation(summary = "Check stock availability")
    public ApiResponse<Boolean> checkStockAvailability(
            @PathVariable String bookId,
            @RequestParam Integer quantity) {
        return ApiResponse.success(bookService.checkStockAvailability(bookId, quantity));
    }

    // ==================== ADMIN ONLY ENDPOINTS ====================

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new book with images")
    public ApiResponse<BookResponse> createBook(
            @Valid @ModelAttribute BookRequest request,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestParam(value = "additionalImages", required = false) List<MultipartFile> additionalImages) {

        return ApiResponse.success(
                bookService.createBook(request, coverImage, additionalImages),
                "Book created successfully"
        );
    }

    @PutMapping(value = "/{bookId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update book with images")
    public ApiResponse<BookResponse> updateBook(
            @PathVariable String bookId,
            @Valid @ModelAttribute BookRequest request,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage,
            @RequestParam(value = "additionalImages", required = false) List<MultipartFile> additionalImages,
            @RequestParam(value = "keepExistingImages", defaultValue = "true") boolean keepExistingImages) {

        return ApiResponse.success(
                bookService.updateBook(bookId, request, coverImage, additionalImages, keepExistingImages),
                "Book updated successfully"
        );
    }

    @DeleteMapping("/{bookId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete book (Admin only)")
    public ApiResponse<Void> deleteBook(@PathVariable String bookId) {
        bookService.deleteBook(bookId);
        return ApiResponse.success("Book deleted successfully");
    }

    @DeleteMapping("/{bookId}/hard-delete")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Permanently delete book and all images")
    public ApiResponse<Void> hardDeleteBook(@PathVariable String bookId) {
        bookService.hardDeleteBook(bookId);
        return ApiResponse.success("Book permanently deleted");
    }

    @PostMapping("/{bookId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Add additional images to existing book")
    public ApiResponse<List<String>> addBookImages(
            @PathVariable String bookId,
            @RequestParam("images") List<MultipartFile> images) {

        return ApiResponse.success(
                bookService.addBookImages(bookId, images),
                "Images added successfully"
        );
    }

    @DeleteMapping("/{bookId}/images")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete specific image from book")
    public ApiResponse<Void> deleteBookImage(
            @PathVariable String bookId,
            @RequestParam String imageUrl) {

        bookService.deleteBookImage(bookId, imageUrl);
        return ApiResponse.success("Image deleted successfully");
    }


}