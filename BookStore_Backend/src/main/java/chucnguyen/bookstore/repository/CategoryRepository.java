package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    // Tìm category theo slug
    Optional<Category> findBySlug(String slug);

    // Check slug đã tồn tại
    boolean existsBySlug(String slug);

    // Tìm category active
    List<Category> findByIsActiveTrueOrderByDisplayOrderAsc();

    // Tìm category cha (parent categories)
    List<Category> findByParentIsNullAndIsActiveTrueOrderByDisplayOrderAsc();

    // Tìm category con
    List<Category> findByParentIdAndIsActiveTrueOrderByDisplayOrderAsc(String parentId);

    // Search category
    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Category> searchByName(@Param("keyword") String keyword);

    // Đếm số sách trong category
    @Query("SELECT COUNT(b) FROM Book b WHERE b.category.id = :categoryId AND b.isActive = true")
    long countBooksByCategory(@Param("categoryId") String categoryId);
}
