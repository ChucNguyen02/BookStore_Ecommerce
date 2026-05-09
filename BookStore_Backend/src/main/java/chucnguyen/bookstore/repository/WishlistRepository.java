package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.Wishlist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepository extends JpaRepository<Wishlist, String> {

    // Lấy wishlist của user
    Page<Wishlist> findByUserIdOrderByCreatedAtDesc(String userId, Pageable pageable);

    // Check sách đã có trong wishlist chưa
    boolean existsByUserIdAndBookId(String userId, String bookId);

    // Tìm item cụ thể
    Optional<Wishlist> findByUserIdAndBookId(String userId, String bookId);

    // Xóa khỏi wishlist
    @Modifying
    @Query("DELETE FROM Wishlist w WHERE w.user.id = :userId AND w.book.id = :bookId")
    void deleteByUserIdAndBookId(@Param("userId") String userId, @Param("bookId") String bookId);

    // Đếm items trong wishlist
    long countByUserId(String userId);

    // Xóa tất cả wishlist của user
    @Modifying
    @Query("DELETE FROM Wishlist w WHERE w.user.id = :userId")
    void deleteByUserId(@Param("userId") String userId);

    // Lấy users đã wishlist sách này (để notify khi giảm giá)
    @Query("SELECT w.user FROM Wishlist w WHERE w.book.id = :bookId")
    List<User> findUsersWhoWishlistedBook(@Param("bookId") String bookId);
}
