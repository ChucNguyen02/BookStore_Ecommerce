package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, String> {

    List<OrderItem> findByOrderId(String orderId);

    // ✅ FIX: Tách thành 2 queries
    @Query("""
        SELECT oi.book.id, SUM(oi.quantity) as totalSold 
        FROM OrderItem oi 
        JOIN oi.order o 
        WHERE o.status = 'DELIVERED' 
        GROUP BY oi.book.id 
        ORDER BY totalSold DESC
        """)
    Page<Object[]> findBestSellingBookIds(Pageable pageable);

    // ✅ Query phụ - Load category và authors (ManyToMany)
    @Query("""
        SELECT DISTINCT b 
        FROM Book b
        LEFT JOIN FETCH b.category
        LEFT JOIN FETCH b.authors
        WHERE b.id IN :bookIds
        """)
    List<Book> findBooksByIdsWithDetails(@Param("bookIds") List<String> bookIds);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi " +
            "JOIN oi.order o WHERE o.status = 'DELIVERED'")
    Long getTotalBooksSold();

    @Query("SELECT COALESCE(SUM(oi.subtotal), 0) FROM OrderItem oi " +
            "JOIN oi.order o WHERE oi.book.id = :bookId AND o.status = 'DELIVERED'")
    BigDecimal getRevenueByBook(@Param("bookId") String bookId);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi " +
            "JOIN oi.order o WHERE oi.book.id = :bookId AND o.status = 'DELIVERED'")
    Long getQuantitySoldByBook(@Param("bookId") String bookId);
}