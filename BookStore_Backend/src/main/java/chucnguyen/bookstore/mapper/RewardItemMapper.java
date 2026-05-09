package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.RewardItemRequest;
import chucnguyen.bookstore.entity.RewardItem;
import chucnguyen.bookstore.dto.response.RewardItemResponse;
import chucnguyen.bookstore.entity.enums.RewardType;
import chucnguyen.bookstore.entity.enums.VoucherDiscountType;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RewardItemMapper {

    @Mapping(target = "type", source = "type", qualifiedByName = "rewardTypeToString")
    @Mapping(target = "bookTitle", ignore = true)
    @Mapping(target = "voucherDiscountType", source = "voucherDiscountType", qualifiedByName = "discountTypeToString")
    @Mapping(target = "isAvailable", expression = "java(rewardItem.getStockQuantity() > 0 && rewardItem.getIsActive())")
    RewardItemResponse toRewardItemResponse(RewardItem rewardItem);

    List<RewardItemResponse> toRewardItemResponseList(List<RewardItem> rewardItems);

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "claimedCount", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    RewardItem toRewardItem(RewardItemRequest request);

    // Update entity from request
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "claimedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateRewardItemFromRequest(RewardItemRequest request, @MappingTarget RewardItem rewardItem);

    @Named("rewardTypeToString")
    default String rewardTypeToString(RewardType type) {
        return type != null ? type.name() : null;
    }

    @Named("discountTypeToString")
    default String discountTypeToString(VoucherDiscountType type) {
        return type != null ? type.name() : null;
    }
}