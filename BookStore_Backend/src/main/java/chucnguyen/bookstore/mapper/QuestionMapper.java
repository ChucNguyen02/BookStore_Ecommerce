package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.CreateQuestionRequest;
import chucnguyen.bookstore.dto.response.QuestionResponse;
import chucnguyen.bookstore.entity.BookQuestion;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = {AnswerMapper.class},
        unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface QuestionMapper {

    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "userName", source = "user.fullName")
    @Mapping(target = "userAvatar", source = "user.avatarUrl")
    @Mapping(target = "bookId", source = "book.id")
    @Mapping(target = "bookTitle", source = "book.title")
    @Mapping(target = "answers", ignore = true)
    @Mapping(target = "bookSlug", source = "book.slug")
    QuestionResponse toQuestionResponse(BookQuestion question);

    List<QuestionResponse> toQuestionResponseList(List<BookQuestion> questions);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "book", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "isAnswered", constant = "false")
    @Mapping(target = "answerCount", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    BookQuestion toBookQuestion(CreateQuestionRequest request);
}
