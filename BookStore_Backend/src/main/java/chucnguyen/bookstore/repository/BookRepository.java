package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends JpaRepository<Book, String> {



    // Tìm book theo slug
    Optional<Book> findBySlug(String slug);

    // Check slug tồn tại
    boolean existsBySlug(String slug);

    // Tìm book theo ISBN
    Optional<Book> findByIsbn(String isbn);

    // Tìm books active
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.isActive = true ORDER BY b.createdAt DESC")
    Page<Book> findByIsActiveTrueOrderByCreatedAtDesc(Pageable pageable);

    // Tìm books featured
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.isFeatured = true AND b.isActive = true " +
            "ORDER BY b.soldCount DESC")
    List<Book> findFeaturedBooks(Pageable pageable);

    // Tìm books theo category
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.category.id = :categoryId AND b.isActive = true")
    Page<Book> findByCategoryIdAndIsActiveTrue(@Param("categoryId") String categoryId, Pageable pageable);

    // Tìm books theo author
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors a " +
            "WHERE a.id = :authorId AND b.isActive = true")
    Page<Book> findByAuthorId(@Param("authorId") String authorId, Pageable pageable);

    @Query("""
        SELECT DISTINCT b FROM Book b
        LEFT JOIN FETCH b.category
        LEFT JOIN FETCH b.authors a
        WHERE b.isActive = true
        AND (
            LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(FUNCTION('unaccent_vietnamese', b.title)) LIKE LOWER(FUNCTION('unaccent_vietnamese', :keyword))
            OR LOWER(FUNCTION('unaccent_vietnamese', a.name)) LIKE LOWER(FUNCTION('unaccent_vietnamese', :keyword))
            OR LOWER(FUNCTION('unaccent_vietnamese', b.category.name)) LIKE LOWER(FUNCTION('unaccent_vietnamese', :keyword))
        )
        """)
    Page<Book> searchBooks(@Param("keyword") String keyword, Pageable pageable);

    // Search books (title, description, ISBN)
    @Query("""
        SELECT DISTINCT b FROM Book b
        LEFT JOIN b.authors a
        WHERE b.isActive = true
        AND (
            LOWER(b.title) LIKE LOWER(CONCAT('%', :word1, '%'))
            OR LOWER(a.name) LIKE LOWER(CONCAT('%', :word1, '%'))
            OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :word1, '%'))
        )
        AND (
            :word2 IS NULL 
            OR LOWER(b.title) LIKE LOWER(CONCAT('%', :word2, '%'))
            OR LOWER(a.name) LIKE LOWER(CONCAT('%', :word2, '%'))
            OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :word2, '%'))
        )
        AND (
            :word3 IS NULL 
            OR LOWER(b.title) LIKE LOWER(CONCAT('%', :word3, '%'))
            OR LOWER(a.name) LIKE LOWER(CONCAT('%', :word3, '%'))
            OR LOWER(b.category.name) LIKE LOWER(CONCAT('%', :word3, '%'))
        )
        """)
    Page<Book> searchBooksFuzzy(
            @Param("word1") String word1,
            @Param("word2") String word2,
            @Param("word3") String word3,
            Pageable pageable
    );

    @Query("""
    SELECT DISTINCT b FROM Book b 
    LEFT JOIN b.category c
    LEFT JOIN b.authors a
    WHERE b.isActive = true 
    AND (:categoryId IS NULL OR b.category.id = :categoryId) 
    AND (:authorId IS NULL OR a.id = :authorId)
    AND (:minPrice IS NULL OR COALESCE(b.discountPrice, b.price) >= :minPrice) 
    AND (:maxPrice IS NULL OR COALESCE(b.discountPrice, b.price) <= :maxPrice) 
    AND (:language IS NULL OR b.language = :language)
    AND (:minRating IS NULL OR b.averageRating >= :minRating)
    AND (:isFeatured IS NULL OR b.isFeatured = :isFeatured)
    AND (:onSale IS NULL OR (b.discountPrice IS NOT NULL AND b.discountPrice < b.price))
    """)
    Page<Book> filterBooks(
            @Param("categoryId") String categoryId,
            @Param("authorId") String authorId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("language") String language,
            @Param("minRating") BigDecimal minRating,
            @Param("isFeatured") Boolean isFeatured,
            @Param("onSale") Boolean onSale,
            Pageable pageable
    );

    // Query riêng để fetch category
    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.category WHERE b IN :books")
    List<Book> fetchBooksWithCategory(@Param("books") List<Book> books);

    // Query riêng để fetch authors
    @Query("SELECT DISTINCT b FROM Book b LEFT JOIN FETCH b.authors WHERE b IN :books")
    List<Book> fetchBooksWithAuthors(@Param("books") List<Book> books);

    // 2. Thêm method mới: searchAndFilter (kết hợp search + filter)
    @Query("""
    SELECT DISTINCT b FROM Book b 
    LEFT JOIN b.category c
    LEFT JOIN b.authors a
    WHERE b.isActive = true
    AND (
        LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(b.isbn) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(c.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
        OR LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))
    )
    AND (:categoryId IS NULL OR b.category.id = :categoryId) 
    AND (:authorId IS NULL OR a.id = :authorId)
    AND (:minPrice IS NULL OR COALESCE(b.discountPrice, b.price) >= :minPrice) 
    AND (:maxPrice IS NULL OR COALESCE(b.discountPrice, b.price) <= :maxPrice) 
    AND (:language IS NULL OR b.language = :language)
    AND (:minRating IS NULL OR b.averageRating >= :minRating)
    AND (:isFeatured IS NULL OR b.isFeatured = :isFeatured)
    AND (:onSale IS NULL OR (b.discountPrice IS NOT NULL AND b.discountPrice < b.price))
    """)
    Page<Book> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("categoryId") String categoryId,
            @Param("authorId") String authorId,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("language") String language,
            @Param("minRating") BigDecimal minRating,
            @Param("isFeatured") Boolean isFeatured,
            @Param("onSale") Boolean onSale,
            Pageable pageable
    );

    // Sách bán chạy (best sellers)
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.isActive = true ORDER BY b.soldCount DESC")
    Page<Book> findBestSellers(Pageable pageable);

    // Sách mới nhất
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.isActive = true ORDER BY b.createdAt DESC")
    Page<Book> findNewestBooks(Pageable pageable);

    // Sách đang giảm giá
    @Query("SELECT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.isActive = true AND b.discountPrice IS NOT NULL " +
            "AND b.discountPrice < b.price " +
            "ORDER BY (b.price - b.discountPrice) DESC")
    Page<Book> findBooksOnSale(Pageable pageable);

    // Sách rating cao
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.isActive = true AND b.reviewCount > :minReviews " +
            "ORDER BY b.averageRating DESC")
    Page<Book> findTopRatedBooks(@Param("minReviews") Integer minReviews, Pageable pageable);

    // Sách liên quan (cùng category, khác ID)
    @Query("SELECT DISTINCT b FROM Book b " +
            "LEFT JOIN FETCH b.category " +
            "LEFT JOIN FETCH b.authors " +
            "WHERE b.category.id = :categoryId " +
            "AND b.id != :bookId AND b.isActive = true " +
            "ORDER BY b.soldCount DESC")
    List<Book> findRelatedBooks(@Param("bookId") String bookId,
                                @Param("categoryId") String categoryId,
                                Pageable pageable);

    // Tăng view count (atomic)
    @Modifying
    @Query("UPDATE Book b SET b.viewCount = b.viewCount + 1 WHERE b.id = :bookId")
    void incrementViewCount(@Param("bookId") String bookId);

    // Tăng sold count (atomic)
    @Modifying
    @Query("UPDATE Book b SET b.soldCount = b.soldCount + :quantity WHERE b.id = :bookId")
    void incrementSoldCount(@Param("bookId") String bookId, @Param("quantity") Integer quantity);

    // Giảm stock (atomic)
    @Modifying
    @Query("UPDATE Book b SET b.stockQuantity = b.stockQuantity - :quantity " +
            "WHERE b.id = :bookId AND b.stockQuantity >= :quantity")
    int decrementStock(@Param("bookId") String bookId, @Param("quantity") Integer quantity);

    // Tăng stock (atomic)
    @Modifying
    @Query("UPDATE Book b SET b.stockQuantity = b.stockQuantity + :quantity WHERE b.id = :bookId")
    void incrementStock(@Param("bookId") String bookId, @Param("quantity") Integer quantity);

    // Update rating
    @Modifying
    @Query("UPDATE Book b SET b.averageRating = :rating, b.reviewCount = :count WHERE b.id = :bookId")
    void updateRating(@Param("bookId") String bookId,
                      @Param("rating") BigDecimal rating,
                      @Param("count") Integer count);

    // Check stock availability
    @Query("SELECT CASE WHEN b.stockQuantity >= :quantity THEN true ELSE false END " +
            "FROM Book b WHERE b.id = :bookId")
    boolean hasEnoughStock(@Param("bookId") String bookId, @Param("quantity") Integer quantity);

    // Đếm sách theo status
    long countByIsActive(Boolean isActive);

    // Tổng giá trị tồn kho
    @Query("SELECT SUM(b.price * b.stockQuantity) FROM Book b WHERE b.isActive = true")
    BigDecimal calculateTotalInventoryValue();

    boolean existsByIsbn(String isbn);

    @Query("SELECT DISTINCT b.language FROM Book b WHERE b.isActive = true AND b.language IS NOT NULL ORDER BY b.language")
    List<String> findDistinctLanguages();
}
