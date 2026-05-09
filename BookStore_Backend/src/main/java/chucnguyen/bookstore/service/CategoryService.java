package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.CategoryRequest;
import chucnguyen.bookstore.dto.response.CategoryResponse;
import chucnguyen.bookstore.dto.response.CategorySimpleResponse;
import chucnguyen.bookstore.entity.Category;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.CategoryMapper;
import chucnguyen.bookstore.repository.CategoryRepository;
import chucnguyen.bookstore.util.SlugUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    @Cacheable(value = "categories", key = "'all'")
    public List<CategoryResponse> getAllCategories() {
        List<Category> categories = categoryRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        return categoryMapper.toCategoryResponseList(categories);
    }

    @Cacheable(value = "categories", key = "'parents'")
    public List<CategoryResponse> getParentCategories() {
        List<Category> categories = categoryRepository.findByParentIsNullAndIsActiveTrueOrderByDisplayOrderAsc();
        return categoryMapper.toCategoryResponseList(categories);
    }

    @Cacheable(value = "categories", key = "'children_' + #parentId")
    public List<CategorySimpleResponse> getChildCategories(String parentId) {
        categoryRepository.findById(parentId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        List<Category> categories = categoryRepository
                .findByParentIdAndIsActiveTrueOrderByDisplayOrderAsc(parentId);
        return categoryMapper.toCategorySimpleResponseList(categories);
    }

    @Cacheable(value = "categories", key = "'slug_' + #slug")
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        CategoryResponse response = categoryMapper.toCategoryResponse(category);

        // Get book count
        response.setBookCount(categoryRepository.countBooksByCategory(category.getId()));

        // Get children
        List<Category> children = categoryRepository
                .findByParentIdAndIsActiveTrueOrderByDisplayOrderAsc(category.getId());
        response.setChildren(categoryMapper.toCategorySimpleResponseList(children));

        return response;
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse createCategory(CategoryRequest request) {
        log.info("Creating new category: {}", request.getName());

        String slug = SlugUtils.createSlug(request.getName());

        if (categoryRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.CATEGORY_ALREADY_EXISTS);
        }

        Category category = categoryMapper.toCategory(request);
        category.setSlug(slug);

        // Set parent if provided
        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            category.setParent(parent);
        }

        category = categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public CategoryResponse updateCategory(String categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        categoryMapper.updateCategoryFromRequest(request, category);

        // Update slug if name changed
        if (request.getName() != null) {
            category.setSlug(SlugUtils.createSlug(request.getName()));
        }

        category = categoryRepository.save(category);

        return categoryMapper.toCategoryResponse(category);
    }

    @Transactional
    @CacheEvict(value = "categories", allEntries = true)
    public void deleteCategory(String categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        // Check if has children
        long childCount = categoryRepository
                .findByParentIdAndIsActiveTrueOrderByDisplayOrderAsc(categoryId).size();

        if (childCount > 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Cannot delete category with subcategories");
        }

        // Soft delete
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    public boolean isSlugExists(String slug) {
        return categoryRepository.existsBySlug(slug);
    }

    public List<CategoryResponse> searchCategories(String keyword) {
        List<Category> categories = categoryRepository.searchByName(keyword);
        return categoryMapper.toCategoryResponseList(categories);
    }
}
