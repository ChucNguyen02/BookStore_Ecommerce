package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.response.NotificationResponse;
import chucnguyen.bookstore.entity.Notification;
import chucnguyen.bookstore.entity.enums.NotificationType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface NotificationMapper {

    @Mapping(target = "type", source = "type", qualifiedByName = "notificationTypeToString")
    NotificationResponse toNotificationResponse(Notification notification);

    List<NotificationResponse> toNotificationResponseList(List<Notification> notifications);

    @Named("notificationTypeToString")
    default String notificationTypeToString(NotificationType type) {
        return type != null ? type.name() : null;
    }
}
