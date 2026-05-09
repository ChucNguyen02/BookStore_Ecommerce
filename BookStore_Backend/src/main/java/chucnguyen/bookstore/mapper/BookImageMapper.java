package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.entity.BookImage;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BookImageMapper {

    List<String> toImageUrlList(List<BookImage> bookImages);

    default String toImageUrl(BookImage bookImage) {
        return bookImage != null ? bookImage.getImageUrl() : null;
    }
}
