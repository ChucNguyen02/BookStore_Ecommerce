package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.CreateReviewRequest;
import chucnguyen.bookstore.dto.request.UpdateReviewRequest;
import chucnguyen.bookstore.dto.response.ReviewResponse;
import chucnguyen.bookstore.entity.Review;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ReviewMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    @Mapping(target = "userAvatar", source = "user.avatarUrl")
    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "imageUrls", ignore = true) // Set manually in service
    @Mapping(target = "currentUserVote", ignore = true) // Set in service
    @Mapping(target = "sellerReply", ignore = true) // Set in service
    ReviewResponse toReviewResponse(Review review);

    List<ReviewResponse> toReviewResponseList(List<Review> reviews);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "isVerifiedPurchase", constant = "true")
    @Mapping(target = "helpfulCount", constant = "0")
    @Mapping(target = "unhelpfulCount", constant = "0")
    @Mapping(target = "isApproved", constant = "true")
    @Mapping(target = "isHidden", constant = "false")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Review toReview(CreateReviewRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "isVerifiedPurchase", ignore = true)
    @Mapping(target = "helpfulCount", ignore = true)
    @Mapping(target = "unhelpfulCount", ignore = true)
    @Mapping(target = "isApproved", ignore = true)
    @Mapping(target = "isHidden", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateReviewFromRequest(UpdateReviewRequest request, @MappingTarget Review review);
}
