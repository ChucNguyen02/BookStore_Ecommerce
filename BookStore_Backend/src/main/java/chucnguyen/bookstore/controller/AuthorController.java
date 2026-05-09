package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.AuthorRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.AuthorResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.service.AuthorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/authors")
@RequiredArgsConstructor
@Tag(name = "Authors", description = "Author management APIs")
public class AuthorController {

    private final AuthorService authorService;

    @GetMapping
    @Operation(summary = "Get all authors")
    public ApiResponse<PageResponse<AuthorResponse>> getAllAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(authorService.getAllAuthors(page, size));
    }

    @GetMapping("/{authorId}")
    @Operation(summary = "Get author by ID")
    public ApiResponse<AuthorResponse> getAuthorById(@PathVariable String authorId) {
        return ApiResponse.success(authorService.getAuthorById(authorId));
    }

    @GetMapping("/search")
    @Operation(summary = "Search authors")
    public ApiResponse<PageResponse<AuthorResponse>> searchAuthors(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(authorService.searchAuthors(keyword, page, size));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new author (Admin only)")
    public ApiResponse<AuthorResponse> createAuthor(@Valid @RequestBody AuthorRequest request) {
        return ApiResponse.success(
                authorService.createAuthor(request),
                "Author created successfully");
    }

    @PutMapping("/{authorId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update author (Admin only)")
    public ApiResponse<AuthorResponse> updateAuthor(
            @PathVariable String authorId,
            @Valid @RequestBody AuthorRequest request) {
        return ApiResponse.success(
                authorService.updateAuthor(authorId, request),
                "Author updated successfully");
    }

    @DeleteMapping("/{authorId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete author (Admin only)")
    public ApiResponse<Void> deleteAuthor(@PathVariable String authorId) {
        authorService.deleteAuthor(authorId);
        return ApiResponse.success("Author deleted successfully");
    }

    @GetMapping("/top")
    @Operation(summary = "Get top authors by book count")
    public ApiResponse<PageResponse<AuthorResponse>> getTopAuthors(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(authorService.getTopAuthors(page, size));
    }

    @GetMapping("/name/{name}")
    @Operation(summary = "Get author by name")
    public ApiResponse<AuthorResponse> getAuthorByName(@PathVariable String name) {
        return ApiResponse.success(authorService.getAuthorByName(name));
    }
}