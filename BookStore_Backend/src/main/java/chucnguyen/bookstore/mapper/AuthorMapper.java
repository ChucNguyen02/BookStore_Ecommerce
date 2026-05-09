package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.AuthorRequest;
import chucnguyen.bookstore.dto.response.AuthorResponse;
import chucnguyen.bookstore.dto.response.AuthorSimpleResponse;
import chucnguyen.bookstore.entity.Author;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuthorMapper {

    @Mapping(target = "bookCount", ignore = true)
    AuthorResponse toAuthorResponse(Author author);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "avatarUrl", source = "avatarUrl")
    AuthorSimpleResponse toAuthorSimpleResponse(Author author);

    List<AuthorResponse> toAuthorResponseList(List<Author> authors);
    List<AuthorSimpleResponse> toAuthorSimpleResponseList(List<Author> authors);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Author toAuthor(AuthorRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateAuthorFromRequest(AuthorRequest request, @MappingTarget Author author);
}
