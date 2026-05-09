package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.AnswerQuestionRequest;
import chucnguyen.bookstore.dto.response.AnswerResponse;
import chucnguyen.bookstore.entity.QuestionAnswer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AnswerMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    AnswerResponse toAnswerResponse(QuestionAnswer answer);

    List<AnswerResponse> toAnswerResponseList(List<QuestionAnswer> answers);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "question", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isSellerAnswer", ignore = true) // Set in service
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    QuestionAnswer toQuestionAnswer(AnswerQuestionRequest request);
}
