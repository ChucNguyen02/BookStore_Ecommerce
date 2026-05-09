package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.OrderDetailResponse;
import chucnguyen.bookstore.dto.response.OrderResponse;
import chucnguyen.bookstore.entity.Order;
import chucnguyen.bookstore.entity.enums.OrderStatus;
import chucnguyen.bookstore.entity.enums.PaymentMethod;
import chucnguyen.bookstore.entity.enums.PaymentStatus;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = {OrderItemMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface OrderMapper {

    // Entity -> OrderResponse (List view)
    @Mapping(target = "status", source = "status", qualifiedByName = "orderStatusToString")
    @Mapping(target = "paymentStatus", source = "paymentStatus", qualifiedByName = "paymentStatusToString")
    @Mapping(target = "paymentMethod", source = "paymentMethod", qualifiedByName = "paymentMethodToString")
    @Mapping(target = "itemCount", expression = "java(order.getOrderItems() != null ? order.getOrderItems().size() : 0)")
    @Mapping(target = "canCancel", expression = "java(canCancelOrder(order))")
    @Mapping(target = "canReview", expression = "java(canReviewOrder(order))")
    OrderResponse toOrderResponse(Order order);

    // Entity -> OrderDetailResponse (Detail view)
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userEmail", source = "user.email")
    @Mapping(target = "status", source = "status", qualifiedByName = "orderStatusToString")
    @Mapping(target = "paymentStatus", source = "paymentStatus", qualifiedByName = "paymentStatusToString")
    @Mapping(target = "paymentMethod", source = "paymentMethod", qualifiedByName = "paymentMethodToString")
    @Mapping(target = "items", source = "orderItems")
    @Mapping(target = "voucherDiscount", source = "discountAmount")
    @Mapping(target = "canCancel", expression = "java(canCancelOrder(order))")
    @Mapping(target = "canReview", expression = "java(canReviewOrder(order))")
    @Mapping(target = "transactionId", ignore = true)
    @Mapping(target = "trackingNumber", ignore = true)
    OrderDetailResponse toOrderDetailResponse(Order order);

    List<OrderResponse> toOrderResponseList(List<Order> orders);

    // Helper methods for business logic
    default boolean canCancelOrder(Order order) {
        if (order == null || order.getStatus() == null) return false;
        return order.getStatus() == OrderStatus.PENDING ||
                order.getStatus() == OrderStatus.CONFIRMED;
    }

    default boolean canReviewOrder(Order order) {
        if (order == null || order.getStatus() == null) return false;
        return order.getStatus() == OrderStatus.DELIVERED;
    }

    // Enum converters
    @Named("orderStatusToString")
    default String orderStatusToString(OrderStatus status) {
        return status != null ? status.name() : null;
    }

    @Named("paymentStatusToString")
    default String paymentStatusToString(PaymentStatus status) {
        return status != null ? status.name() : null;
    }

    @Named("paymentMethodToString")
    default String paymentMethodToString(PaymentMethod method) {
        return method != null ? method.name() : null;
    }
}