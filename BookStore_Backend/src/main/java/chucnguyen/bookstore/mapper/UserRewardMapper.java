package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.UserRewardResponse;
import chucnguyen.bookstore.entity.UserReward;
import chucnguyen.bookstore.entity.enums.RedemptionStatus;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", uses = {RewardItemMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface UserRewardMapper {

    @Mapping(target = "status", source = "status", qualifiedByName = "redemptionStatusToString")
    @Mapping(target = "reward", source = "reward")
    UserRewardResponse toUserRewardResponse(UserReward userReward);

    List<UserRewardResponse> toUserRewardResponseList(List<UserReward> userRewards);

    @Named("redemptionStatusToString")
    default String redemptionStatusToString(RedemptionStatus status) {
        return status != null ? status.name() : null;
    }
}
