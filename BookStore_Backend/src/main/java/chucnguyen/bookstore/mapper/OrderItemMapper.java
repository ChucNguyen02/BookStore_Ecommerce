package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.OrderItemResponse;
import chucnguyen.bookstore.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderItemMapper {

    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookSlug", source = "book.slug")
    @Mapping(target = "canReview", ignore = true) // Set in service
    @Mapping(target = "hasReviewed", ignore = true) // Set in service
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);

    List<OrderItemResponse> toOrderItemResponseList(List<OrderItem> orderItems);
}
