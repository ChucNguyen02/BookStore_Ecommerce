package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.response.VoucherResponse;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.Voucher;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.VoucherMapper;
import chucnguyen.bookstore.repository.NotificationRepository;
import chucnguyen.bookstore.repository.UserRepository;
import chucnguyen.bookstore.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherService {
    private final NotificationRepository notificationRepository;

    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final VoucherMapper voucherMapper;

    @Cacheable(value = "vouchers", key = "'available_' + #email")
    public List<VoucherResponse> getAvailableVouchers(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<Voucher> vouchers = voucherRepository.findAvailableVouchersForUser(user.getId());

        return vouchers.stream()
                .map(voucher -> {
                    VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
                    response.setIsValid(voucher.isValid());
                    return response;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Cacheable(value = "vouchers", key = "'code_' + #code")
    public VoucherResponse getVoucherByCode(String code) {
        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
        response.setIsValid(voucher.isValid());

        return response;
    }

    @Cacheable(value = "vouchers", key = "'valid_' + #email + '_' + #code")
    public VoucherResponse validateVoucher(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Voucher voucher = voucherRepository.findByCode(code)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        // Check if voucher is for specific user
        if (voucher.getUser() != null && !voucher.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.VOUCHER_INVALID, "This voucher is not for you");
        }

        if (!voucher.isValid()) {
            throw new AppException(ErrorCode.VOUCHER_INVALID);
        }

        VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
        response.setIsValid(true);

        return response;
    }

    @Cacheable(value = "vouchers", key = "'expiring_' + #daysBeforeExpiry")
    public List<VoucherResponse> getExpiringVouchers(int daysBeforeExpiry) {
        LocalDateTime endDate = LocalDateTime.now().plusDays(daysBeforeExpiry);
        List<Voucher> vouchers = voucherRepository.findExpiringVouchers(endDate);
        return vouchers.stream()
                .map(voucher -> {
                    VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
                    response.setIsValid(voucher.isValid());
                    return response;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Scheduled(cron = "0 0 2 * * ?") // Run at 2 AM daily
    public void cleanupOldNotifications() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        notificationRepository.deleteOldNotifications(thirtyDaysAgo);
        log.info("Cleaned up old notifications");
    }

    @Cacheable(value = "vouchers", key = "'all_available'")
    public List<VoucherResponse> getAllAvailableVouchers() {
        List<Voucher> vouchers = voucherRepository.findAvailableVouchers();
        return vouchers.stream()
                .map(voucher -> {
                    VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
                    response.setIsValid(voucher.isValid());
                    return response;
                })
                .collect(java.util.stream.Collectors.toList());
    }

    @Cacheable(value = "vouchers", key = "'check_valid_' + #code")
    public boolean isVoucherValid(String code) {
        return voucherRepository.isVoucherValid(code);
    }
}