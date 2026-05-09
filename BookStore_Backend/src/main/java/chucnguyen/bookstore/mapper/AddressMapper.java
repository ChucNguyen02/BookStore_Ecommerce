package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.AddressRequest;
import chucnguyen.bookstore.dto.response.AddressResponse;
import chucnguyen.bookstore.entity.Address;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AddressMapper {

    @Mapping(target = "fullAddress", expression = "java(getFullAddress(address))")
    AddressResponse toAddressResponse(Address address);

    List<AddressResponse> toAddressResponseList(List<Address> addresses);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Address toAddress(AddressRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateAddressFromRequest(AddressRequest request, @MappingTarget Address address);

    // Helper method
    default String getFullAddress(Address address) {
        if (address == null) return null;
        return String.format("%s, %s, %s, %s",
                address.getDetailAddress(),
                address.getWard(),
                address.getDistrict(),
                address.getProvince());
    }
}
