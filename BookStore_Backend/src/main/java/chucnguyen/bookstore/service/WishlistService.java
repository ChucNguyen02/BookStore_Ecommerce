package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.WishlistResponse;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.Wishlist;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.WishlistMapper;
import chucnguyen.bookstore.repository.BookRepository;
import chucnguyen.bookstore.repository.UserRepository;
import chucnguyen.bookstore.repository.WishlistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final WishlistMapper wishlistMapper;

    @Cacheable(value = "wishlists", key = "'user_' + #email + '_' + #page + '_' + #size")
    public PageResponse<WishlistResponse> getUserWishlist(String email, int page, int size) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);
        Page<Wishlist> wishlist = wishlistRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        Page<WishlistResponse> responsePage = wishlist.map(wishlistMapper::toWishlistResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    @CacheEvict(value = "wishlists", allEntries = true)
    public WishlistResponse addToWishlist(String email, String bookId) {
        log.info("Adding book {} to wishlist for user: {}", bookId, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Check if already in wishlist
        if (wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Book already in wishlist");
        }

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .book(book)
                .build();

        wishlist = wishlistRepository.save(wishlist);

        return wishlistMapper.toWishlistResponse(wishlist);
    }

    @Transactional
    @CacheEvict(value = "wishlists", allEntries = true)
    public void removeFromWishlist(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (!wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId)) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Book not in wishlist");
        }

        wishlistRepository.deleteByUserIdAndBookId(user.getId(), bookId);
    }

    @Cacheable(value = "wishlists", key = "'check_' + #email + '_' + #bookId")
    public boolean isInWishlist(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return wishlistRepository.existsByUserIdAndBookId(user.getId(), bookId);
    }

    @Cacheable(value = "wishlists", key = "'item_' + #email + '_' + #bookId")
    public WishlistResponse getWishlistItem(String email, String bookId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Wishlist wishlist = wishlistRepository.findByUserIdAndBookId(user.getId(), bookId)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_REQUEST,
                        "Book not in wishlist"));

        return wishlistMapper.toWishlistResponse(wishlist);
    }

    @Cacheable(value = "wishlists", key = "'count_' + #email")
    public long countWishlistItems(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return wishlistRepository.countByUserId(user.getId());
    }

    @Transactional
    @CacheEvict(value = "wishlists", allEntries = true)
    public void clearWishlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        wishlistRepository.deleteByUserId(user.getId());
    }

    @Cacheable(value = "wishlists", key = "'users_' + #bookId")
    public List<User> getUsersWhoWishlistedBook(String bookId) {
        return wishlistRepository.findUsersWhoWishlistedBook(bookId);
    }
}