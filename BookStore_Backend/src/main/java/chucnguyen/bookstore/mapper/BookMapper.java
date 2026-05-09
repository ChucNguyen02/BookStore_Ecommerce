package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.BookRequest;
import chucnguyen.bookstore.dto.response.AuthorSimpleResponse;
import chucnguyen.bookstore.dto.response.BookDetailResponse;
import chucnguyen.bookstore.dto.response.BookResponse;
import chucnguyen.bookstore.dto.response.CategorySimpleResponse;
import chucnguyen.bookstore.entity.Author;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.Category;
import org.mapstruct.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", uses = { CategoryMapper.class,
        AuthorMapper.class }, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookMapper {

    // Entity -> BookResponse (List view)
    @Mapping(target = "categoryId", expression = "java(book.getCategory() != null ? book.getCategory().getId() : null)")
    @Mapping(target = "categoryName", expression = "java(book.getCategory() != null ? book.getCategory().getName() : null)")
    @Mapping(target = "authors", source = "authors", qualifiedByName = "authorsToSimpleList")
    @Mapping(target = "discountPercentage", expression = "java(calculateDiscountPercentage(book))")
    @Mapping(target = "isOnSale", expression = "java(book.getDiscountPrice() != null && book.getPrice() != null && book.getDiscountPrice().compareTo(book.getPrice()) < 0)")
    @Mapping(target = "inStock", expression = "java(book.getStockQuantity() != null && book.getStockQuantity() > 0)")
    @Mapping(target = "categorySlug", expression = "java(book.getCategory() != null ? book.getCategory().getSlug() : null)")
    BookResponse toBookResponse(Book book);

    // Entity -> BookDetailResponse (Detail view)
    @Mapping(target = "category", source = "category", qualifiedByName = "categoryToSimple")
    @Mapping(target = "authors", source = "authors")
    @Mapping(target = "imageUrls", ignore = true) // Set manually in service
    @Mapping(target = "discountPercentage", expression = "java(calculateDiscountPercentage(book))")
    @Mapping(target = "inStock", expression = "java(book.getStockQuantity() != null && book.getStockQuantity() > 0)")
    BookDetailResponse toBookDetailResponse(Book book);

    List<BookResponse> toBookResponseList(List<Book> books);

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "averageRating", constant = "0")
    @Mapping(target = "reviewCount", constant = "0")
    @Mapping(target = "soldCount", constant = "0")
    @Mapping(target = "viewCount", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Book toBook(BookRequest request);

    // Update entity from request
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "category", ignore = true)
    @Mapping(target = "authors", ignore = true)
    @Mapping(target = "averageRating", ignore = true)
    @Mapping(target = "reviewCount", ignore = true)
    @Mapping(target = "soldCount", ignore = true)
    @Mapping(target = "viewCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateBookFromRequest(BookRequest request, @MappingTarget Book book);

    // Helper methods
    default Integer calculateDiscountPercentage(Book book) {
        if (book.getDiscountPrice() == null || book.getPrice() == null) {
            return null;
        }
        if (book.getDiscountPrice().compareTo(book.getPrice()) >= 0) {
            return null;
        }
        BigDecimal discount = book.getPrice().subtract(book.getDiscountPrice());
        BigDecimal percentage = discount.divide(book.getPrice(), 4, BigDecimal.ROUND_HALF_UP)
                .multiply(BigDecimal.valueOf(100));
        return percentage.intValue();
    }

    @Named("categoryToSimple")
    default CategorySimpleResponse categoryToSimple(Category category) {
        if (category == null)
            return null;
        return CategorySimpleResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .imageUrl(category.getImageUrl())
                .build();
    }

    @Named("authorsToSimpleList")
    default List<AuthorSimpleResponse> authorsToSimpleList(java.util.Set<Author> authors) {
        if (authors == null)
            return null;
        return authors.stream()
                .map(author -> AuthorSimpleResponse.builder()
                        .id(author.getId())
                        .name(author.getName())
                        .avatarUrl(author.getAvatarUrl())
                        .build())
                .collect(Collectors.toList());
    }

}
