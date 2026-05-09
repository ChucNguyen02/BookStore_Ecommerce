package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.OrderItem;
import chucnguyen.bookstore.mapper.BookMapper;
import chucnguyen.bookstore.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;
    private final BookMapper bookMapper;

    @Cacheable(value = "orderItems", key = "'order_' + #orderId")
    public List<OrderItem> getOrderItems(String orderId) {
        return orderItemRepository.findByOrderId(orderId);
    }

    @Cacheable(value = "orderItems", key = "'bestselling_' + #page + '_' + #size")
    public PageResponse<BookResponse> getBestSellingBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        // Step 1: Lấy book IDs với total sold
        Page<Object[]> results = orderItemRepository.findBestSellingBookIds(pageable);

        if (results.isEmpty()) {
            return PageResponse.<BookResponse>builder()
                    .content(List.of())
                    .pageNumber(page)
                    .pageSize(size)
                    .totalElements(0L)
                    .totalPages(0)
                    .first(true)
                    .last(true)
                    .empty(true)
                    .build();
        }

        // Step 2: Extract book IDs
        List<String> bookIds = results.stream()
                .map(result -> (String) result[0])
                .toList();

        // Step 3: Fetch books với JOIN FETCH category và author
        List<Book> books = orderItemRepository.findBooksByIdsWithDetails(bookIds);

        // Step 4: Map to BookResponse (giờ không bị LazyInitializationException)
        // Maintain order theo totalSold
        Map<String, Book> bookMap = books.stream()
                .collect(Collectors.toMap(Book::getId, book -> book));

        List<BookResponse> bookResponses = bookIds.stream()
                .map(bookMap::get)
                .filter(book -> book != null)
                .map(bookMapper::toBookResponse)
                .toList();

        return PageResponse.<BookResponse>builder()
                .content(bookResponses)
                .pageNumber(results.getNumber())
                .pageSize(results.getSize())
                .totalElements(results.getTotalElements())
                .totalPages(results.getTotalPages())
                .first(results.isFirst())
                .last(results.isLast())
                .empty(results.isEmpty())
                .build();
    }

    @Cacheable(value = "orderItems", key = "'revenue_' + #bookId")
    public BigDecimal getBookRevenue(String bookId) {
        return orderItemRepository.getRevenueByBook(bookId);
    }

    @Cacheable(value = "orderItems", key = "'sold_' + #bookId")
    public Long getBookQuantitySold(String bookId) {
        return orderItemRepository.getQuantitySoldByBook(bookId);
    }
}