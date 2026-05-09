package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.BookImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookImageRepository extends JpaRepository<BookImage, String> {

    // Lấy tất cả ảnh của sách
    List<BookImage> findByBookIdOrderByDisplayOrderAsc(String bookId);

    // Xóa tất cả ảnh của sách
    @Modifying
    @Query("DELETE FROM BookImage bi WHERE bi.book.id = :bookId")
    void deleteByBookId(@Param("bookId") String bookId);

    // Đếm số ảnh của sách
    long countByBookId(String bookId);
}
