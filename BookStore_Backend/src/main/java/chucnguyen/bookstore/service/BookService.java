package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.BookFilterRequest;
import chucnguyen.bookstore.dto.request.BookRequest;
import chucnguyen.bookstore.dto.response.BookDetailResponse;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.Author;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.BookImage;
import chucnguyen.bookstore.entity.Category;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.BookImageMapper;
import chucnguyen.bookstore.mapper.BookMapper;
import chucnguyen.bookstore.repository.AuthorRepository;
import chucnguyen.bookstore.repository.BookImageRepository;
import chucnguyen.bookstore.repository.BookRepository;
import chucnguyen.bookstore.repository.CategoryRepository;
import chucnguyen.bookstore.util.SlugUtils;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.concurrent.atomic.AtomicInteger;


@Service
@RequiredArgsConstructor
@Slf4j
public class BookService {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;
    private final AuthorRepository authorRepository;
    private final BookImageRepository bookImageRepository;
    private final BookMapper bookMapper;
    private final FileUploadService fileUploadService;
    private final CloudinaryService cloudinaryService;

    @Cacheable(value = "books", key = "'languages'")
    public List<String> getAvailableLanguages() {
        return bookRepository.findDistinctLanguages();
    }

    public PageResponse<BookResponse> getAllBooks(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Book> books = bookRepository.findByIsActiveTrueOrderByCreatedAtDesc(pageable);
        Page<BookResponse> responsePage = books.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    @Cacheable(value = "books", key = "#id")
    public BookDetailResponse getBookById(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return buildBookDetailResponse(book);
    }

    @Transactional
    @Cacheable(value = "books", key = "'slug_' + #slug")
    public BookDetailResponse getBookDetail(String slug) {
        Book book = bookRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));
        return buildBookDetailResponse(book);
    }

    private BookDetailResponse buildBookDetailResponse(Book book) {
        BookDetailResponse response = bookMapper.toBookDetailResponse(book);

        List<String> imageUrls = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(book.getId())
                .stream()
                .map(BookImage::getImageUrl)
                .toList();
        response.setImageUrls(imageUrls);

        bookRepository.incrementViewCount(book.getId());

        return response;
    }

    // Thay thế các method trong BookService.java

    @Transactional
    public PageResponse<BookResponse> searchBooks(String keyword, int page, int size) {
        Sort sort = Sort.by(Sort.Direction.DESC, "createdAt");
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Book> books = executeSearch(keyword, pageable);

        List<Book> bookList = books.getContent();
        if (!bookList.isEmpty()) {
            bookList = bookRepository.fetchBooksWithCategory(bookList);
            bookList = bookRepository.fetchBooksWithAuthors(bookList);
        }

        Page<BookResponse> responsePage = new PageImpl<>(bookList, pageable, books.getTotalElements())
                .map(bookMapper::toBookResponse);

        return PageResponse.from(responsePage);
    }

    @Transactional
    public PageResponse<BookResponse> filterBooks(BookFilterRequest filter) {
        Sort sort = Sort.by(
                filter.getSortDirection().equalsIgnoreCase("ASC") ?
                        Sort.Direction.ASC : Sort.Direction.DESC,
                filter.getSortBy()
        );

        Pageable pageable = PageRequest.of(filter.getPage(), filter.getSize(), sort);

        Page<Book> books;

        // Check nếu có keyword
        boolean hasKeyword = filter.getKeyword() != null && !filter.getKeyword().isBlank();

        // Check nếu có filters khác
        boolean hasOtherFilters = filter.getCategoryId() != null
                || filter.getAuthorId() != null
                || filter.getMinPrice() != null
                || filter.getMaxPrice() != null
                || filter.getLanguage() != null
                || filter.getMinRating() != null
                || filter.getIsFeatured() != null
                || filter.getOnSale() != null;

        if (hasKeyword && hasOtherFilters) {
            books = bookRepository.searchAndFilter(
                    filter.getKeyword(),
                    filter.getCategoryId(),
                    filter.getAuthorId(),
                    filter.getMinPrice(),
                    filter.getMaxPrice(),
                    filter.getLanguage(),
                    filter.getMinRating() != null ? BigDecimal.valueOf(filter.getMinRating()) : null,
                    filter.getIsFeatured(),
                    filter.getOnSale(),
                    pageable
            );
        } else if (hasKeyword) {
            books = executeSearch(filter.getKeyword(), pageable);
        } else {
            books = bookRepository.filterBooks(
                    filter.getCategoryId(),
                    filter.getAuthorId(),
                    filter.getMinPrice(),
                    filter.getMaxPrice(),
                    filter.getLanguage(),
                    filter.getMinRating() != null ? BigDecimal.valueOf(filter.getMinRating()) : null,
                    filter.getIsFeatured(),
                    filter.getOnSale(),
                    pageable
            );
        }

        // Fetch relationships
        List<Book> bookList = books.getContent();
        if (!bookList.isEmpty()) {
            bookList = bookRepository.fetchBooksWithCategory(bookList);
            bookList = bookRepository.fetchBooksWithAuthors(bookList);


            final String sortBy = filter.getSortBy();
            final boolean isAscending = filter.getSortDirection().equalsIgnoreCase("ASC");

            bookList.sort((b1, b2) -> {
                int comparison = 0;

                switch (sortBy) {
                    case "price":
                        BigDecimal p1 = b1.getEffectivePrice();
                        BigDecimal p2 = b2.getEffectivePrice();
                        comparison = p1.compareTo(p2);
                        break;

                    case "averageRating":
                        comparison = b1.getAverageRating().compareTo(b2.getAverageRating());
                        break;

                    case "soldCount":
                        comparison = b1.getSoldCount().compareTo(b2.getSoldCount());
                        break;

                    case "createdAt":
                        comparison = b1.getCreatedAt().compareTo(b2.getCreatedAt());
                        break;

                    case "title":
                        comparison = b1.getTitle().compareToIgnoreCase(b2.getTitle());
                        break;

                    default:
                        // Default sort by createdAt
                        comparison = b1.getCreatedAt().compareTo(b2.getCreatedAt());
                }

                return isAscending ? comparison : -comparison;
            });


        }

        // Create Page with sorted list
        Page<Book> booksWithRelations = new PageImpl<>(
                bookList,
                pageable,
                books.getTotalElements()
        );

        Page<BookResponse> responsePage = booksWithRelations.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    private Page<Book> executeSearch(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return Page.empty(pageable);
        }

        // Tách keyword thành từng từ (trim và loại bỏ khoảng trắng thừa)
        String[] words = keyword.trim().split("\\s+");

        if (words.length == 1) {
            // Chỉ có 1 từ -> dùng simple search
            return bookRepository.searchBooks(keyword.trim(), pageable);
        } else {
            // Nhiều từ -> dùng fuzzy search (tối đa 3 từ đầu tiên)
            String word1 = words[0];
            String word2 = words.length > 1 ? words[1] : null;
            String word3 = words.length > 2 ? words[2] : null;

            return bookRepository.searchBooksFuzzy(word1, word2, word3, pageable);
        }
    }

    @Cacheable(value = "books", key = "'featured_' + #limit")
    public List<BookResponse> getFeaturedBooks(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Book> books = bookRepository.findFeaturedBooks(pageable);
        return bookMapper.toBookResponseList(books);
    }

    @Cacheable(value = "books", key = "'bestsellers_' + #page + '_' + #size")
    public PageResponse<BookResponse> getBestSellers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findBestSellers(pageable);
        Page<BookResponse> responsePage = books.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    @Cacheable(value = "books", key = "'new_' + #page + '_' + #size")
    public PageResponse<BookResponse> getNewArrivals(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findNewestBooks(pageable);
        Page<BookResponse> responsePage = books.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    @Cacheable(value = "books", key = "'sale_' + #page + '_' + #size")
    public PageResponse<BookResponse> getBooksOnSale(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findBooksOnSale(pageable);
        Page<BookResponse> responsePage = books.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    public PageResponse<BookResponse> getBooksByCategory(String categoryId, int page, int size) {
        // Check category exists
        categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findByCategoryIdAndIsActiveTrue(categoryId, pageable);
        Page<BookResponse> responsePage = books.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    public List<BookResponse> getRelatedBooks(String bookId, int limit) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        if (book.getCategory() == null) {
            return List.of();
        }

        Pageable pageable = PageRequest.of(0, limit);
        List<Book> relatedBooks = bookRepository.findRelatedBooks(
                bookId,
                book.getCategory().getId(),
                pageable
        );

        return bookMapper.toBookResponseList(relatedBooks);
    }

    // Admin methods

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "books", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "authors", allEntries = true)
    })
    public BookResponse createBook(
            BookRequest request,
            MultipartFile coverImage,
            List<MultipartFile> additionalImages) {

        log.info("Creating new book: {}", request.getTitle());

        // Validate
        validateBookRequest(request);

        // Get category and authors
        Category category = getCategory(request.getCategoryId());
        Set<Author> authors = getAuthors(request.getAuthorIds());

        // Create book entity
        Book book = bookMapper.toBook(request);
        book.setSlug(SlugUtils.createSlug(request.getTitle()));
        book.setCategory(category);
        book.setAuthors(authors);

        // Upload cover image if provided
        if (coverImage != null && !coverImage.isEmpty()) {
            String coverUrl = fileUploadService.uploadImage(coverImage, "books/covers");
            book.setCoverImageUrl(coverUrl);
        }

        // Save book first to get ID
        book = bookRepository.save(book);

        // Upload additional images in parallel
        if (additionalImages != null && !additionalImages.isEmpty()) {
            uploadAdditionalImages(book, additionalImages);
        }

        log.info("Book created successfully: {}", book.getTitle());
        return bookMapper.toBookResponse(book);
    }

    private void validateBookRequest(BookRequest request) {
        if (request.getIsbn() != null && bookRepository.existsByIsbn(request.getIsbn())) {
            throw new AppException(ErrorCode.BOOK_ALREADY_EXISTS);
        }
    }

    private Category getCategory(String categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
    }

    private Set<Author> getAuthors(List<String> authorIds) {
        Set<Author> authors = new HashSet<>();
        for (String authorId : authorIds) {
            Author author = authorRepository.findById(authorId)
                    .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));
            authors.add(author);
        }
        return authors;
    }

    private List<String> uploadAdditionalImages(Book book, List<MultipartFile> images) {
        if (images == null || images.isEmpty()) {
            return List.of();
        }

        log.info("Uploading {} additional images for book: {}", images.size(), book.getId());

        // Upload all images in parallel
        List<String> imageUrls = fileUploadService.uploadImagesParallel(images, "books/images");

        // Save to database
        AtomicInteger order = new AtomicInteger(
                bookImageRepository.findByBookIdOrderByDisplayOrderAsc(book.getId()).size()
        );

        List<BookImage> bookImages = imageUrls.stream()
                .map(url -> BookImage.builder()
                        .book(book)
                        .imageUrl(url)
                        .displayOrder(order.getAndIncrement())
                        .build())
                .toList();

        bookImageRepository.saveAll(bookImages);

        log.info("Successfully uploaded {} images", imageUrls.size());
        return imageUrls;
    }



    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "books", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "authors", allEntries = true)
    })
    public BookResponse updateBook(
            String bookId,
            BookRequest request,
            MultipartFile coverImage,
            List<MultipartFile> additionalImages,
            boolean keepExistingImages) {

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // 1. Update basic fields
        updateBookFields(book, request);

        // 2. Handle cover image
        if (coverImage != null && !coverImage.isEmpty()) {
            String oldCoverUrl = book.getCoverImageUrl();
            String newCoverUrl = fileUploadService.uploadImage(coverImage, "books/covers");
            book.setCoverImageUrl(newCoverUrl);

            if (oldCoverUrl != null) {
                cloudinaryService.deleteImageAsync(oldCoverUrl);
            }
        }

        // 3. Handle additional images
        if (additionalImages != null && !additionalImages.isEmpty()) {
            if (!keepExistingImages) {
                // Replace: Delete old, upload new
                deleteAllBookImages(book);
                uploadAdditionalImages(book, additionalImages);
            } else {
                // Append: Keep old, add new
                uploadAdditionalImages(book, additionalImages);
            }
        } else if (!keepExistingImages) {
            // Delete all if user unchecked keepExistingImages
            deleteAllBookImages(book);
        }

        book = bookRepository.save(book);
        return bookMapper.toBookResponse(book);
    }

    private void updateBookFields(Book book, BookRequest request) {
        bookMapper.updateBookFromRequest(request, book);

        if (request.getTitle() != null && !request.getTitle().equals(book.getTitle())) {
            book.setSlug(SlugUtils.createSlug(request.getTitle()));
        }

        if (request.getCategoryId() != null) {
            Category category = getCategory(request.getCategoryId());
            book.setCategory(category);
        }

        if (request.getAuthorIds() != null && !request.getAuthorIds().isEmpty()) {
            Set<Author> authors = getAuthors(request.getAuthorIds());
            book.setAuthors(authors);
        }
    }

    private void deleteAllBookImages(Book book) {
        List<BookImage> bookImages = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(book.getId());

        if (!bookImages.isEmpty()) {
            List<String> imageUrls = bookImages.stream()
                    .map(BookImage::getImageUrl)
                    .toList();

            // Delete from database
            bookImageRepository.deleteByBookId(book.getId());

            // Delete from Cloudinary asynchronously
            cloudinaryService.deleteImages(imageUrls);

            log.info("Deleted {} images for book: {}", imageUrls.size(), book.getId());
        }
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "books", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "authors", allEntries = true)
    })
    public void deleteBook(String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Soft delete
        book.setIsActive(false);
        bookRepository.save(book);

        log.info("Book soft deleted: {}", bookId);
    }

    @Cacheable(value = "books", key = "'toprated_' + #limit")
    public List<BookResponse> getTopRatedBooks(int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        Page<Book> books = bookRepository.findTopRatedBooks(10, pageable);
        return bookMapper.toBookResponseList(books.getContent());
    }

    @Cacheable(value = "books", key = "'isbn_' + #isbn")
    public BookResponse getBookByIsbn(String isbn) {
        Book book = bookRepository.findByIsbn(isbn)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        return bookMapper.toBookResponse(book);
    }

    public PageResponse<BookResponse> getBooksByAuthor(String authorId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Book> books = bookRepository.findByAuthorId(authorId, pageable);
        Page<BookResponse> responsePage = books.map(bookMapper::toBookResponse);
        return PageResponse.from(responsePage);
    }

    public boolean checkStockAvailability(String bookId, Integer quantity) {
        return bookRepository.hasEnoughStock(bookId, quantity);
    }

    @Transactional
    @Caching(evict = {
            @CacheEvict(value = "books", allEntries = true),
            @CacheEvict(value = "categories", allEntries = true),
            @CacheEvict(value = "authors", allEntries = true)
    })
    public void hardDeleteBook(String bookId) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        // Collect all image URLs
        List<String> imageUrls = new ArrayList<>();

        if (book.getCoverImageUrl() != null) {
            imageUrls.add(book.getCoverImageUrl());
        }

        List<BookImage> bookImages = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(bookId);
        bookImages.forEach(img -> imageUrls.add(img.getImageUrl()));

        // Delete book from database (cascade will delete BookImages)
        bookRepository.delete(book);

        // Delete all images from Cloudinary asynchronously
        if (!imageUrls.isEmpty()) {
            cloudinaryService.deleteImages(imageUrls);
        }

        log.info("Book hard deleted: {}", bookId);
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public List<String> addBookImages(String bookId, List<MultipartFile> images) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        return uploadAdditionalImages(book, images);
    }

    @Transactional
    @CacheEvict(value = "books", allEntries = true)
    public void deleteBookImage(String bookId, String imageUrl) {
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        List<BookImage> bookImages = bookImageRepository.findByBookIdOrderByDisplayOrderAsc(bookId);

        BookImage imageToDelete = bookImages.stream()
                .filter(img -> img.getImageUrl().equals(imageUrl))
                .findFirst()
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        // Delete from database
        bookImageRepository.delete(imageToDelete);

        // Delete from Cloudinary asynchronously
        cloudinaryService.deleteImageAsync(imageUrl);

        log.info("Book image deleted: {}", imageUrl);
    }


}
