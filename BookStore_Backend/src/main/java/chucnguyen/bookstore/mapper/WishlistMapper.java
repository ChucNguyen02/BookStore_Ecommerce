package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.WishlistResponse;
import chucnguyen.bookstore.entity.Wishlist;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface WishlistMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "bookSlug", source = "book.slug")
    @Mapping(target = "bookImage", source = "book.coverImageUrl")
    @Mapping(target = "price", source = "book.price")
    @Mapping(target = "discountPrice", source = "book.discountPrice")
    @Mapping(target = "inStock", expression = "java(wishlist.getBook().getStockQuantity() > 0)")
    @Mapping(target = "addedAt", source = "createdAt")
    WishlistResponse toWishlistResponse(Wishlist wishlist);

    List<WishlistResponse> toWishlistResponseList(List<Wishlist> wishlists);
}
