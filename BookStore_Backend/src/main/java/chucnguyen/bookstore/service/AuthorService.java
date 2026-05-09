package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.AuthorRequest;
import chucnguyen.bookstore.dto.response.AuthorResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.entity.Author;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.AuthorMapper;
import chucnguyen.bookstore.repository.AuthorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final AuthorMapper authorMapper;

    public PageResponse<AuthorResponse> getAllAuthors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Author> authors = authorRepository.findAll(pageable);

        Page<AuthorResponse> responsePage = authors.map(author -> {
            AuthorResponse response = authorMapper.toAuthorResponse(author);
            response.setBookCount(authorRepository.countBooksByAuthor(author.getId()));
            return response;
        });

        return PageResponse.from(responsePage);
    }

    @Cacheable(value = "authors", key = "#authorId")
    public AuthorResponse getAuthorById(String authorId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));

        AuthorResponse response = authorMapper.toAuthorResponse(author);
        response.setBookCount(authorRepository.countBooksByAuthor(authorId));

        return response;
    }

    public PageResponse<AuthorResponse> searchAuthors(String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Author> authors = authorRepository.searchByName(keyword, pageable);

        Page<AuthorResponse> responsePage = authors.map(authorMapper::toAuthorResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional
    @CacheEvict(value = "authors", allEntries = true)
    public AuthorResponse createAuthor(AuthorRequest request) {
        log.info("Creating new author: {}", request.getName());

        if (authorRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Author already exists");
        }

        Author author = authorMapper.toAuthor(request);
        author = authorRepository.save(author);

        return authorMapper.toAuthorResponse(author);
    }

    @Transactional
    @CacheEvict(value = "authors", allEntries = true)
    public AuthorResponse updateAuthor(String authorId, AuthorRequest request) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));

        authorMapper.updateAuthorFromRequest(request, author);
        author = authorRepository.save(author);

        return authorMapper.toAuthorResponse(author);
    }

    @Transactional
    @CacheEvict(value = "authors", allEntries = true)
    public void deleteAuthor(String authorId) {
        Author author = authorRepository.findById(authorId)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));

        // Check if author has books
        long bookCount = authorRepository.countBooksByAuthor(authorId);
        if (bookCount > 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Cannot delete author with existing books");
        }

        authorRepository.delete(author);
    }

    @Cacheable(value = "authors", key = "'top_' + #page + '_' + #size")
    public PageResponse<AuthorResponse> getTopAuthors(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Object[]> results = authorRepository.findTopAuthors(pageable);

        List<AuthorResponse> responses = results.stream()
                .map(result -> {
                    Author author = (Author) result[0];
                    Long bookCount = (Long) result[1];
                    AuthorResponse response = authorMapper.toAuthorResponse(author);
                    response.setBookCount(bookCount);
                    return response;
                })
                .toList();

        return PageResponse.<AuthorResponse>builder()
                .content(responses)
                .pageNumber(results.getNumber())
                .pageSize(results.getSize())
                .totalElements(results.getTotalElements())
                .totalPages(results.getTotalPages())
                .first(results.isFirst())
                .last(results.isLast())
                .empty(results.isEmpty())
                .build();
    }

    @Cacheable(value = "authors", key = "'name_' + #name")
    public AuthorResponse getAuthorByName(String name) {
        Author author = authorRepository.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.AUTHOR_NOT_FOUND));

        AuthorResponse response = authorMapper.toAuthorResponse(author);
        response.setBookCount(authorRepository.countBooksByAuthor(author.getId()));

        return response;
    }
}