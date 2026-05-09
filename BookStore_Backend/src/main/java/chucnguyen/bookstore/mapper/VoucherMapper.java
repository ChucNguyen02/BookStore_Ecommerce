package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.VoucherRequest;
import chucnguyen.bookstore.dto.response.VoucherResponse;
import chucnguyen.bookstore.entity.Voucher;
import chucnguyen.bookstore.entity.enums.DiscountType;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface VoucherMapper {

    @Mapping(target = "discountType", source = "discountType", qualifiedByName = "discountTypeToString")
    @Mapping(target = "remainingUses", expression = "java(calculateRemainingUses(voucher))")
    @Mapping(target = "isValid", ignore = true) // Set in service
    @Mapping(target = "isPersonal", expression = "java(voucher.getUser() != null)")
    VoucherResponse toVoucherResponse(Voucher voucher);

    List<VoucherResponse> toVoucherResponseList(List<Voucher> vouchers);

    // Request -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true) // Set in service
    @Mapping(target = "usedCount", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    Voucher toVoucher(VoucherRequest request);

    // Update entity from request
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true) // Handle separately in service
    @Mapping(target = "usedCount", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateVoucherFromRequest(VoucherRequest request, @MappingTarget Voucher voucher);

    default Integer calculateRemainingUses(Voucher voucher) {
        if (voucher.getUsageLimit() == null) return null;
        return Math.max(0, voucher.getUsageLimit() - voucher.getUsedCount());
    }

    @Named("discountTypeToString")
    default String discountTypeToString(DiscountType type) {
        return type != null ? type.name() : null;
    }
}