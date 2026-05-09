package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.ReplyReviewRequest;
import chucnguyen.bookstore.dto.response.ReviewReplyResponse;
import chucnguyen.bookstore.entity.ReviewReply;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewReplyMapper {

    @Mapping(target = "replyBy", source = "user.fullName")
    ReviewReplyResponse toReviewReplyResponse(ReviewReply reviewReply);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "review", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ReviewReply toReviewReply(ReplyReviewRequest request);
}
