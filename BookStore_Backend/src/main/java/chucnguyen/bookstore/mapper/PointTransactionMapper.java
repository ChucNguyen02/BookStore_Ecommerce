package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.PointTransactionResponse;
import chucnguyen.bookstore.entity.PointTransaction;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.entity.enums.TransactionType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PointTransactionMapper {

    @Mapping(target = "type", source = "type", qualifiedByName = "transactionTypeToString")
    @Mapping(target = "referenceType", source = "referenceType", qualifiedByName = "referenceTypeToString")
    PointTransactionResponse toPointTransactionResponse(PointTransaction transaction);

    List<PointTransactionResponse> toPointTransactionResponseList(List<PointTransaction> transactions);

    @Named("transactionTypeToString")
    default String transactionTypeToString(TransactionType type) {
        return type != null ? type.name() : null;
    }

    @Named("referenceTypeToString")
    default String referenceTypeToString(ReferenceType type) {
        return type != null ? type.name() : null;
    }
}