package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.CategoryRequest;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.CategoryResponse;
import chucnguyen.bookstore.dto.response.CategorySimpleResponse;
import chucnguyen.bookstore.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
@Tag(name = "Categories", description = "Category management APIs")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    @Operation(summary = "Get all categories")
    public ApiResponse<List<CategoryResponse>> getAllCategories() {
        return ApiResponse.success(categoryService.getAllCategories());
    }

    @GetMapping("/parents")
    @Operation(summary = "Get parent categories only")
    public ApiResponse<List<CategoryResponse>> getParentCategories() {
        return ApiResponse.success(categoryService.getParentCategories());
    }

    @GetMapping("/{parentId}/children")
    @Operation(summary = "Get child categories")
    public ApiResponse<List<CategorySimpleResponse>> getChildCategories(@PathVariable String parentId) {
        return ApiResponse.success(categoryService.getChildCategories(parentId));
    }

    @GetMapping("/slug/{slug}")
    @Operation(summary = "Get category by slug")
    public ApiResponse<CategoryResponse> getCategoryBySlug(@PathVariable String slug) {
        return ApiResponse.success(categoryService.getCategoryBySlug(slug));
    }

    // Admin endpoints
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create category (Admin only)")
    public ApiResponse<CategoryResponse> createCategory(@Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success(categoryService.createCategory(request), "Category created successfully");
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update category (Admin only)")
    public ApiResponse<CategoryResponse> updateCategory(
            @PathVariable String categoryId,
            @Valid @RequestBody CategoryRequest request) {
        return ApiResponse.success(categoryService.updateCategory(categoryId, request), "Category updated successfully");
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete category (Admin only)")
    public ApiResponse<Void> deleteCategory(@PathVariable String categoryId) {
        categoryService.deleteCategory(categoryId);
        return ApiResponse.success("Category deleted successfully");
    }

    @GetMapping("/check-slug/{slug}")
    @Operation(summary = "Check if slug exists")
    public ApiResponse<Boolean> isSlugExists(@PathVariable String slug) {
        return ApiResponse.success(categoryService.isSlugExists(slug));
    }

    @GetMapping("/search")
    @Operation(summary = "Search categories by name")
    public ApiResponse<List<CategoryResponse>> searchCategories(@RequestParam String keyword) {
        return ApiResponse.success(categoryService.searchCategories(keyword));
    }
}