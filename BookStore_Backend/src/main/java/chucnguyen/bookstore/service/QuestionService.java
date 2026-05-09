package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.AnswerQuestionRequest;
import chucnguyen.bookstore.dto.request.CreateQuestionRequest;
import chucnguyen.bookstore.dto.response.AnswerResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.QuestionResponse;
import chucnguyen.bookstore.entity.Book;
import chucnguyen.bookstore.entity.BookQuestion;
import chucnguyen.bookstore.entity.QuestionAnswer;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.enums.Role;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.AnswerMapper;
import chucnguyen.bookstore.mapper.QuestionMapper;
import chucnguyen.bookstore.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class QuestionService {

    private final BookQuestionRepository bookQuestionRepository;
    private final QuestionAnswerRepository questionAnswerRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final QuestionMapper questionMapper;
    private final AnswerMapper answerMapper;

    @Transactional
    public QuestionResponse createQuestion(String email, CreateQuestionRequest request) {
        log.info("Creating question for book {} by user: {}", request.getBookId(), email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOK_NOT_FOUND));

        BookQuestion question = questionMapper.toBookQuestion(request);
        question.setUser(user);
        question.setBook(book);

        question = bookQuestionRepository.save(question);

        return questionMapper.toQuestionResponse(question);
    }

    @Transactional(readOnly = true) // FIXED: Thêm @Transactional
    public PageResponse<QuestionResponse> getBookQuestions(
            String bookId,
            int page,
            int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BookQuestion> questions = bookQuestionRepository
                .findByBookIdOrderByCreatedAtDesc(bookId, pageable);

        Page<QuestionResponse> responsePage = questions.map(question -> {
            QuestionResponse response = questionMapper.toQuestionResponse(question);

            // Get answers
            List<QuestionAnswer> answers = questionAnswerRepository
                    .findByQuestionIdOrderByCreatedAtAsc(question.getId());
            response.setAnswers(answerMapper.toAnswerResponseList(answers));

            return response;
        });

        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true) // FIXED: Thêm @Transactional để giữ session mở
    public PageResponse<QuestionResponse> getUserQuestions(
            String email,
            int page,
            int size) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BookQuestion> questions = bookQuestionRepository
                .findByUserIdOrderByCreatedAtDesc(user.getId(), pageable);

        Page<QuestionResponse> responsePage = questions.map(question -> {
            QuestionResponse response = questionMapper.toQuestionResponse(question);

            List<QuestionAnswer> answers = questionAnswerRepository
                    .findByQuestionIdOrderByCreatedAtAsc(question.getId());
            response.setAnswers(answerMapper.toAnswerResponseList(answers));

            return response;
        });

        return PageResponse.from(responsePage);
    }

    @Transactional
    public AnswerResponse answerQuestion(
            String email,
            String questionId,
            AnswerQuestionRequest request) {

        log.info("Answering question {} by user: {}", questionId, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        BookQuestion question = bookQuestionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

        QuestionAnswer answer = answerMapper.toQuestionAnswer(request);
        answer.setQuestion(question);
        answer.setUser(user);
        answer.setIsSellerAnswer(user.getRole() == Role.ADMIN);

        answer = questionAnswerRepository.save(answer);

        // Update question counts
        bookQuestionRepository.incrementAnswerCount(questionId);

        return answerMapper.toAnswerResponse(answer);
    }

    @Transactional
    public void deleteQuestion(String email, String questionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        BookQuestion question = bookQuestionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

        // Check ownership or admin
        if (!question.getUser().getId().equals(user.getId()) && user.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        bookQuestionRepository.delete(question);
        log.info("Question {} deleted by user: {}", questionId, email);
    }

    @Transactional
    public void deleteAnswer(String email, String answerId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        QuestionAnswer answer = questionAnswerRepository.findById(answerId)
                .orElseThrow(() -> new AppException(ErrorCode.ANSWER_NOT_FOUND));

        // Check ownership or admin
        if (answer.getUser() != null &&
                !answer.getUser().getId().equals(user.getId()) &&
                user.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        questionAnswerRepository.delete(answer);
        log.info("Answer {} deleted by user: {}", answerId, email);
    }

    @Transactional(readOnly = true) // FIXED: Thêm @Transactional
    public PageResponse<QuestionResponse> getUnansweredQuestions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<BookQuestion> questions = bookQuestionRepository
                .findByIsAnsweredFalseOrderByCreatedAtDesc(pageable);

        Page<QuestionResponse> responsePage = questions.map(questionMapper::toQuestionResponse);
        return PageResponse.from(responsePage);
    }

    @Transactional(readOnly = true) // FIXED: Thêm @Transactional
    public PageResponse<QuestionResponse> searchQuestions(
            String bookId, String keyword, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BookQuestion> questions = bookQuestionRepository
                .searchQuestions(bookId, keyword, pageable);

        Page<QuestionResponse> responsePage = questions.map(question -> {
            QuestionResponse response = questionMapper.toQuestionResponse(question);
            List<QuestionAnswer> answers = questionAnswerRepository
                    .findByQuestionIdOrderByCreatedAtAsc(question.getId());
            response.setAnswers(answerMapper.toAnswerResponseList(answers));
            return response;
        });

        return PageResponse.from(responsePage);
    }

    public long countBookQuestions(String bookId) {
        return bookQuestionRepository.countByBookId(bookId);
    }

    public long countUnansweredQuestions() {
        return bookQuestionRepository.countByIsAnsweredFalse();
    }

    @Transactional(readOnly = true) // FIXED: Thêm @Transactional
    public AnswerResponse getSellerAnswer(String questionId) {
        QuestionAnswer answer = questionAnswerRepository.findSellerAnswer(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.ANSWER_NOT_FOUND,
                        "No seller answer found"));

        return answerMapper.toAnswerResponse(answer);
    }

    public boolean hasSellerAnswer(String questionId) {
        return questionAnswerRepository.existsByQuestionIdAndIsSellerAnswerTrue(questionId);
    }

    public long countAnswers(String questionId) {
        return questionAnswerRepository.countByQuestionId(questionId);
    }

    @Transactional
    public void deleteQuestionWithAnswers(String email, String questionId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        BookQuestion question = bookQuestionRepository.findById(questionId)
                .orElseThrow(() -> new AppException(ErrorCode.QUESTION_NOT_FOUND));

        if (!question.getUser().getId().equals(user.getId()) &&
                user.getRole() != Role.ADMIN) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Delete answers first
        questionAnswerRepository.deleteByQuestionId(questionId);

        // Delete question
        bookQuestionRepository.delete(question);

        log.info("Question {} with all answers deleted by user: {}", questionId, email);
    }
}