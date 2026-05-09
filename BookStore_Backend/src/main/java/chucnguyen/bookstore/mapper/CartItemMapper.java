package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.CartItemResponse;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.math.BigDecimal;
import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CartItemMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "bookSlug", source = "book.slug")
    @Mapping(target = "bookImage", source = "book.coverImageUrl")
    @Mapping(target = "price", source = "book.price")
    @Mapping(target = "discountPrice", source = "book.discountPrice")
    @Mapping(target = "subtotal", expression = "java(calculateSubtotal(cartItem))")
    @Mapping(target = "availableStock", source = "book.stockQuantity")
    @Mapping(target = "inStock", expression = "java(cartItem.getBook().getStockQuantity() > 0)")
    @Mapping(target = "addedAt", source = "createdAt")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItems);

    default BigDecimal calculateSubtotal(CartItem cartItem) {
        Book book = cartItem.getBook();
        BigDecimal price = book.getDiscountPrice() != null ? book.getDiscountPrice() : book.getPrice();
        return price.multiply(BigDecimal.valueOf(cartItem.getQuantity()));
    }
}
