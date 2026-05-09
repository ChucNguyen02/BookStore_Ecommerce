package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.*;
import chucnguyen.bookstore.entity.enums.ReferenceType;
import chucnguyen.bookstore.entity.enums.TransactionType;
import chucnguyen.bookstore.service.PointsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/points")
@RequiredArgsConstructor
@Tag(name = "Points", description = "Points and loyalty APIs")
public class PointsController {

    private final PointsService pointsService;

    @GetMapping
    @Operation(summary = "Get user points")
    public ApiResponse<PointsResponse> getUserPoints(Authentication authentication) {
        return ApiResponse.success(pointsService.getUserPoints(authentication.getName()));
    }

    @PostMapping("/check-in")
    @Operation(summary = "Daily check-in")
    public ApiResponse<CheckInResponse> dailyCheckIn(Authentication authentication) {
        return ApiResponse.success(
                pointsService.dailyCheckIn(authentication.getName()),
                "Check-in successful");
    }

    @GetMapping("/history")
    @Operation(summary = "Get points transaction history")
    public ApiResponse<PageResponse<PointTransactionResponse>> getPointHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                pointsService.getPointHistory(authentication.getName(), page, size));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get points summary")
    public ApiResponse<PointsSummaryResponse> getPointsSummary(Authentication authentication) {
        return ApiResponse.success(pointsService.getPointsSummary(authentication.getName()));
    }

    @GetMapping("/checked-in-today")
    @Operation(summary = "Check if checked in today")
    public ApiResponse<Boolean> hasCheckedInToday(Authentication authentication) {
        return ApiResponse.success(
                pointsService.hasCheckedInToday(authentication.getName()));
    }

    @GetMapping("/check-in-by-date")
    @Operation(summary = "Get check-in by date")
    public ApiResponse<CheckInResponse> getCheckInByDate(
            Authentication authentication,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ApiResponse.success(
                pointsService.getCheckInByDate(authentication.getName(), date));
    }

    @GetMapping("/check-in-history")
    @Operation(summary = "Get check-in history")
    public ApiResponse<PageResponse<CheckInResponse>> getCheckInHistory(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ApiResponse.success(
                pointsService.getCheckInHistory(authentication.getName(), page, size));
    }

    @GetMapping("/total-from-check-ins")
    @Operation(summary = "Get total points from check-ins")
    public ApiResponse<Integer> getTotalPointsFromCheckIns(
            Authentication authentication) {
        return ApiResponse.success(
                pointsService.getTotalPointsFromCheckIns(authentication.getName()));
    }

    // Thêm vào PointsController
    @GetMapping("/history/type/{type}")
    @Operation(summary = "Get point history by type")
    public ApiResponse<PageResponse<PointTransactionResponse>> getPointHistoryByType(
            Authentication authentication,
            @PathVariable String type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        TransactionType transactionType = TransactionType.valueOf(type);
        return ApiResponse.success(
                pointsService.getPointHistoryByType(
                        authentication.getName(), transactionType, page, size));
    }

    @GetMapping("/history/reference")
    @Operation(summary = "Get transactions by reference")
    public ApiResponse<List<PointTransactionResponse>> getTransactionsByReference(
            @RequestParam String referenceType,
            @RequestParam String referenceId) {
        ReferenceType type = ReferenceType.valueOf(referenceType);
        return ApiResponse.success(
                pointsService.getTransactionsByReference(type, referenceId));
    }

    @GetMapping("/total-earned")
    @Operation(summary = "Get total earned points")
    public ApiResponse<Integer> getTotalEarnedPoints(Authentication authentication) {
        return ApiResponse.success(
                pointsService.getTotalEarnedPoints(authentication.getName()));
    }


}