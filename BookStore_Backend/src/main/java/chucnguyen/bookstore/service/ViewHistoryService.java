package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.ViewHistory;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.BookMapper;
import chucnguyen.bookstore.repository.BookRepository;
import chucnguyen.bookstore.repository.UserRepository;
import chucnguyen.bookstore.repository.ViewHistoryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ViewHistoryService {

    private final ViewHistoryRepository viewHistoryRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final BookMapper bookMapper;

    @Transactional
    public int recordView(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        ViewHistory viewHistory = viewHistoryRepository
                .findByUserIdAndBookId(user.getId(), bookId)
                .orElse(null);

        if (viewHistory != null) {

            LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);

            if (viewHistory.getLastViewedAt().isBefore(fiveMinutesAgo)) {
                viewHistoryRepository.incrementViewCount(viewHistory.getId());

                book.setViewCount(book.getViewCount() + 1);
                bookRepository.save(book);

                log.debug("View count incremented for book {} by user {}", bookId, email);
                return book.getViewCount();
            } else {
                log.debug("View ignored - too soon after last view");
                return book.getViewCount();
            }
        } else {
            viewHistory = ViewHistory.builder()
                    .user(user)
                    .book(book)
                    .viewCount(1)
                    .lastViewedAt(LocalDateTime.now())
                    .build();
            viewHistoryRepository.save(viewHistory);

            book.setViewCount(book.getViewCount() + 1);
            bookRepository.save(book);

            log.debug("New view record created");
            return book.getViewCount();
        }
    }

    public PageResponse<BookResponse> getViewHistory(
            String email,
            int page,
            int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);
        Page<ViewHistory> viewHistories = viewHistoryRepository
                .findByUserIdOrderByLastViewedAtDesc(user.getId(), pageable);

        Page<BookResponse> responsePage = viewHistories
                .map(vh -> bookMapper.toBookResponse(vh.getBook()));

        return PageResponse.from(responsePage);
    }

    public List<BookResponse> getMostViewedBooks(String email, int limit) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(0, limit);
        List<ViewHistory> viewHistories = viewHistoryRepository
                .findMostViewedBooks(user.getId(), pageable);

        return viewHistories.stream()
                .map(vh -> bookMapper.toBookResponse(vh.getBook()))
                .toList();
    }

    @Transactional
    public void clearViewHistory(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        viewHistoryRepository.deleteOldHistory(LocalDateTime.now());
    }

    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOldHistory() {
        LocalDateTime ninetyDaysAgo = LocalDateTime.now().minusDays(90);
        viewHistoryRepository.deleteOldHistory(ninetyDaysAgo);
        log.info("Cleaned up old view history");
    }
}