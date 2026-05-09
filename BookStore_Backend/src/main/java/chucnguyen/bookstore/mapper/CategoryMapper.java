package chucnguyen.bookstore.mapper;

import chucnguyen.bookstore.dto.request.CategoryRequest;
import chucnguyen.bookstore.dto.response.CategoryResponse;
import chucnguyen.bookstore.dto.response.CategorySimpleResponse;
import chucnguyen.bookstore.entity.Category;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    @Mapping(target = "parentId", source = "parent.id")
    @Mapping(target = "parentName", source = "parent.name")
    @Mapping(target = "children", ignore = true)
    @Mapping(target = "bookCount", ignore = true)
    CategoryResponse toCategoryResponse(Category category);

    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "slug", source = "slug")
    @Mapping(target = "imageUrl", source = "imageUrl")
    CategorySimpleResponse toCategorySimpleResponse(Category category);

    List<CategoryResponse> toCategoryResponseList(List<Category> categories);
    List<CategorySimpleResponse> toCategorySimpleResponseList(List<Category> categories);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Category toCategory(CategoryRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "slug", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateCategoryFromRequest(CategoryRequest request, @MappingTarget Category category);
}
