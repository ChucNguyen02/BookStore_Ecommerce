package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.request.AnswerQuestionRequest;
import chucnguyen.bookstore.dto.request.CreateQuestionRequest;
import chucnguyen.bookstore.dto.response.AnswerResponse;
import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.QuestionResponse;
import chucnguyen.bookstore.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/questions")
@RequiredArgsConstructor
@Tag(name = "Questions", description = "Book Q&A APIs")
public class QuestionController {

    private final QuestionService questionService;

    @PostMapping
    @Operation(summary = "Ask a question about book")
    public ApiResponse<QuestionResponse> createQuestion(
            Authentication authentication,
            @Valid @RequestBody CreateQuestionRequest request) {
        return ApiResponse.success(
                questionService.createQuestion(authentication.getName(), request),
                "Question created successfully");
    }

    @GetMapping("/book/{bookId}")
    @Operation(summary = "Get book questions")
    public ApiResponse<PageResponse<QuestionResponse>> getBookQuestions(
            @PathVariable String bookId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(questionService.getBookQuestions(bookId, page, size));
    }

    @GetMapping("/my-questions")
    @Operation(summary = "Get user's questions")
    public ApiResponse<PageResponse<QuestionResponse>> getUserQuestions(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                questionService.getUserQuestions(authentication.getName(), page, size));
    }

    @PostMapping("/{questionId}/answer")
    @Operation(summary = "Answer a question")
    public ApiResponse<AnswerResponse> answerQuestion(
            Authentication authentication,
            @PathVariable String questionId,
            @Valid @RequestBody AnswerQuestionRequest request) {
        return ApiResponse.success(
                questionService.answerQuestion(authentication.getName(), questionId, request),
                "Answer added successfully");
    }

    @DeleteMapping("/{questionId}")
    @Operation(summary = "Delete question")
    public ApiResponse<Void> deleteQuestion(
            Authentication authentication,
            @PathVariable String questionId) {
        questionService.deleteQuestion(authentication.getName(), questionId);
        return ApiResponse.success("Question deleted successfully");
    }

    @DeleteMapping("/answers/{answerId}")
    @Operation(summary = "Delete answer")
    public ApiResponse<Void> deleteAnswer(
            Authentication authentication,
            @PathVariable String answerId) {
        questionService.deleteAnswer(authentication.getName(), answerId);
        return ApiResponse.success("Answer deleted successfully");
    }

    @GetMapping("/unanswered")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get unanswered questions (Admin)")
    public ApiResponse<PageResponse<QuestionResponse>> getUnansweredQuestions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(questionService.getUnansweredQuestions(page, size));
    }

    @GetMapping("/book/{bookId}/search")
    @Operation(summary = "Search questions in book")
    public ApiResponse<PageResponse<QuestionResponse>> searchQuestions(
            @PathVariable String bookId,
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                questionService.searchQuestions(bookId, keyword, page, size));
    }

    @GetMapping("/book/{bookId}/count")
    @Operation(summary = "Count book questions")
    public ApiResponse<Long> countBookQuestions(@PathVariable String bookId) {
        return ApiResponse.success(questionService.countBookQuestions(bookId));
    }

    @GetMapping("/unanswered/count")
    @Operation(summary = "Count unanswered questions")
    public ApiResponse<Long> countUnansweredQuestions() {
        return ApiResponse.success(questionService.countUnansweredQuestions());
    }

    @GetMapping("/{questionId}/seller-answer")
    @Operation(summary = "Get seller answer")
    public ApiResponse<AnswerResponse> getSellerAnswer(@PathVariable String questionId) {
        return ApiResponse.success(questionService.getSellerAnswer(questionId));
    }

    @GetMapping("/{questionId}/has-seller-answer")
    @Operation(summary = "Check if has seller answer")
    public ApiResponse<Boolean> hasSellerAnswer(@PathVariable String questionId) {
        return ApiResponse.success(questionService.hasSellerAnswer(questionId));
    }

    @GetMapping("/{questionId}/answer-count")
    @Operation(summary = "Count answers")
    public ApiResponse<Long> countAnswers(@PathVariable String questionId) {
        return ApiResponse.success(questionService.countAnswers(questionId));
    }

    @DeleteMapping("/{questionId}/with-answers")
    @Operation(summary = "Delete question with all answers")
    public ApiResponse<Void> deleteQuestionWithAnswers(
            Authentication authentication,
            @PathVariable String questionId) {
        questionService.deleteQuestionWithAnswers(authentication.getName(), questionId);
        return ApiResponse.success("Question and answers deleted");
    }
}