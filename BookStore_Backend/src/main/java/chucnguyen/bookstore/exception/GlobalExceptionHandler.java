package chucnguyen.bookstore.exception;

import chucnguyen.bookstore.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // app
    @ExceptionHandler(AppException.class)
    public ResponseEntity<ApiResponse<Void>> handleAppException(
            AppException ex,
            HttpServletRequest request) {

        ErrorCode errorCode = ex.getErrorCode();

        log.error("AppException: {} - {} at {}",
                errorCode.getCode(),
                ex.getMessage(),
                request.getRequestURI());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(ex.getMessage() != null ? ex.getMessage() : errorCode.getMessage())
                .build();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    // validation - @Valid on @RequestBody
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        log.error("Validation error: {}", errors);

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .code(ErrorCode.VALIDATION_FAILED.getCode())
                .message("Validation failed")
                .result(errors)
                .build();

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    // validation - @Validated on @RequestParam / @PathVariable
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleConstraintViolationException(
            ConstraintViolationException ex) {

        Map<String, String> errors = ex.getConstraintViolations().stream()
                .collect(Collectors.toMap(
                        violation -> {
                            String path = violation.getPropertyPath().toString();
                            return path.contains(".") ? path.substring(path.lastIndexOf('.') + 1) : path;
                        },
                        violation -> violation.getMessage() != null ? violation.getMessage() : "Invalid value",
                        (existing, replacement) -> existing
                ));

        log.error("Constraint violation error: {}", errors);

        ApiResponse<Map<String, String>> response = ApiResponse.<Map<String, String>>builder()
                .code(ErrorCode.VALIDATION_FAILED.getCode())
                .message("Validation failed")
                .result(errors)
                .build();

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    // malformed JSON request body
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<Void>> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex) {

        log.error("Malformed request body: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(ErrorCode.INVALID_REQUEST.getCode())
                .message("Malformed request body")
                .build();

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    // file upload size exceeded
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<ApiResponse<Void>> handleMaxUploadSizeExceeded(
            MaxUploadSizeExceededException ex) {

        log.error("File upload too large: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(ErrorCode.FILE_TOO_LARGE.getCode())
                .message(ErrorCode.FILE_TOO_LARGE.getMessage())
                .build();

        return ResponseEntity
                .badRequest()
                .body(response);
    }

    // access denied (Spring Security)
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handleAccessDeniedException(
            AccessDeniedException ex) {

        ErrorCode errorCode = ErrorCode.UNAUTHORIZED;

        log.error("Access denied: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    // bad credential
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentialsException(
            BadCredentialsException ex) {

        ErrorCode errorCode = ErrorCode.INVALID_CREDENTIALS;

        log.error("Bad credentials: {}", ex.getMessage());

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message(errorCode.getMessage())
                .build();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(response);
    }

    // runtime
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiResponse<Void>> handleRuntimeException(
            RuntimeException ex,
            HttpServletRequest request) {

        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;

        log.error("Runtime exception at {}: ", request.getRequestURI(), ex);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message("An unexpected error occurred")
                .build();

        return ResponseEntity
                .internalServerError()
                .body(response);
    }

    // chung
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneralException(
            Exception ex,
            HttpServletRequest request) {

        ErrorCode errorCode = ErrorCode.UNCATEGORIZED_EXCEPTION;

        log.error("Unexpected exception at {}: ", request.getRequestURI(), ex);

        ApiResponse<Void> response = ApiResponse.<Void>builder()
                .code(errorCode.getCode())
                .message("An unexpected error occurred")
                .build();

        return ResponseEntity
                .internalServerError()
                .body(response);
    }
}

