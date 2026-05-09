package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.CheckInResponse;
import chucnguyen.bookstore.entity.DailyCheckIn;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface DailyCheckInMapper {

    @Mapping(target = "checkInDate", source = "checkInDate")
    @Mapping(target = "pointsEarned", source = "pointsEarned")
    @Mapping(target = "bonusPoints", source = "bonusPoints")
    @Mapping(target = "consecutiveDays", source = "consecutiveDays")
    @Mapping(target = "totalPoints", ignore = true)
    @Mapping(target = "message", ignore = true)
    @Mapping(target = "nextBonusAt", ignore = true)
    CheckInResponse toCheckInResponse(DailyCheckIn checkIn);
}
