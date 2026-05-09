package chucnguyen.bookstore.service;

import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.BookImage;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.repository.BookImageRepository;
import chucnguyen.bookstore.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookImageService {

    private final BookImageRepository bookImageRepository;
    private final BookRepository bookRepository;
    private final CloudinaryService cloudinaryService;

    public List<String> getBookImages(String bookId) {
        return bookImageRepository.findByBookIdOrderByDisplayOrderAsc(bookId)
                .stream()
                .map(BookImage::getImageUrl)
                .toList();
    }

    @Transactional
    public void deleteBookImages(String bookId) {
        List<BookImage> images = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(bookId);

        if (images.isEmpty()) {
            log.info("No images to delete for book: {}", bookId);
            return;
        }

        // Collect image URLs
        List<String> imageUrls = images.stream()
                .map(BookImage::getImageUrl)
                .toList();

        // Delete from database first
        bookImageRepository.deleteByBookId(bookId);
        log.info("Deleted {} book images from database", images.size());

        // Delete from Cloudinary asynchronously (non-blocking)
        cloudinaryService.deleteImages(imageUrls);
    }

    @Transactional
    public void deleteBookImage(String bookId, String imageUrl) {
        List<BookImage> images = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(bookId);

        BookImage imageToDelete = images.stream()
                .filter(img -> img.getImageUrl().equals(imageUrl))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        // Delete from database
        bookImageRepository.delete(imageToDelete);
        log.info("Deleted book image from database: {}", imageUrl);

        // Delete from Cloudinary asynchronously
        cloudinaryService.deleteImageAsync(imageUrl);
    }

    public long countBookImages(String bookId) {
        return bookImageRepository.countByBookId(bookId);
    }

    @Transactional
    public BookImage addBookImage(String bookId, String imageUrl, Integer displayOrder) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        BookImage bookImage = BookImage.builder()
                .book(book)
                .imageUrl(imageUrl)
                .displayOrder(displayOrder != null ? displayOrder : 0)
                .build();

        BookImage saved = bookImageRepository.save(bookImage);
        log.info("Added book image: {} with display order: {}", imageUrl, displayOrder);

        return saved;
    }

    @Transactional
    public List<BookImage> addBookImages(String bookId, List<String> imageUrls) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Get current max display order
        int currentMaxOrder = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(bookId)
                .stream()
                .mapToInt(BookImage::getDisplayOrder)
                .max()
                .orElse(-1);

        // Create BookImage entities
        List<BookImage> bookImages = new java.util.ArrayList<>();
        for (int i = 0; i < imageUrls.size(); i++) {
            BookImage bookImage = BookImage.builder()
                    .book(book)
                    .imageUrl(imageUrls.get(i))
                    .displayOrder(currentMaxOrder + i + 1)
                    .build();
            bookImages.add(bookImage);
        }

        List<BookImage> saved = bookImageRepository.saveAll(bookImages);
        log.info("Added {} book images", saved.size());

        return saved;
    }

    @Transactional
    public void updateDisplayOrder(String imageId, Integer newOrder) {
        BookImage image = bookImageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        image.setDisplayOrder(newOrder);
        bookImageRepository.save(image);

        log.info("Updated display order for image {} to {}", imageId, newOrder);
    }

    @Transactional
    public void reorderImages(String bookId, List<String> imageIds) {
        // Validate book exists
        bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Update display order based on list position
        for (int i = 0; i < imageIds.size(); i++) {
            String imageId = imageIds.get(i);
            BookImage image = bookImageRepository.findById(imageId)
                    .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

            image.setDisplayOrder(i);
            bookImageRepository.save(image);
        }

        log.info("Reordered {} images for book: {}", imageIds.size(), bookId);
    }
}