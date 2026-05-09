package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.PointsResponse;
import chucnguyen.bookstore.dto.response.PointsSummaryResponse;
import chucnguyen.bookstore.entity.UserPoints;
import chucnguyen.bookstore.entity.enums.Tier;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserPointsMapper {

    @Mapping(target = "tier", source = "tier", qualifiedByName = "tierToString")
    @Mapping(target = "pointsToNextTier", ignore = true)
    @Mapping(target = "nextTier", ignore = true)
    PointsResponse toPointsResponse(UserPoints userPoints);

    @Mapping(target = "tier", source = "tier", qualifiedByName = "tierToString")
    @Mapping(target = "pointsEarnedThisMonth", ignore = true)
    @Mapping(target = "pointsRedeemedThisMonth", ignore = true)
    @Mapping(target = "consecutiveCheckInDays", ignore = true)
    @Mapping(target = "checkedInToday", ignore = true)
    @Mapping(target = "totalCheckIns", ignore = true)
    @Mapping(target = "totalRedemptions", ignore = true)
    PointsSummaryResponse toPointsSummaryResponse(UserPoints userPoints);

    @Named("tierToString")
    default String tierToString(Tier tier) {
        return tier != null ? tier.name() : null;
    }
}
