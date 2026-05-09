package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Author;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AuthorRepository extends JpaRepository<Author, String> {

    // Tìm author theo tên
    Optional<Author> findByName(String name);

    // Check author tồn tại
    boolean existsByName(String name);

    // Search author
    @Query("SELECT a FROM Author a WHERE LOWER(a.name) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Author> searchByName(@Param("keyword") String keyword, Pageable pageable);

    // Top authors (có nhiều sách nhất)
    @Query("SELECT a, COUNT(b) as bookCount FROM Author a " +
            "JOIN a.books b WHERE b.isActive = true " +
            "GROUP BY a ORDER BY bookCount DESC")
    Page<Object[]> findTopAuthors(Pageable pageable);

    // Đếm số sách của author
    @Query("SELECT COUNT(b) FROM Book b JOIN b.authors a WHERE a.id = :authorId AND b.isActive = true")
    long countBooksByAuthor(@Param("authorId") String authorId);
}
