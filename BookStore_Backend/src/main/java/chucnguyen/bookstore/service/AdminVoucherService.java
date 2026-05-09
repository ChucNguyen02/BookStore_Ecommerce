package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.VoucherRequest;
import chucnguyen.bookstore.dto.response.PageResponse;
import chucnguyen.bookstore.dto.response.VoucherResponse;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.entity.Voucher;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.VoucherMapper;
import chucnguyen.bookstore.repository.UserRepository;
import chucnguyen.bookstore.repository.VoucherRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CacheEvict;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminVoucherService {

    private final VoucherRepository voucherRepository;
    private final UserRepository userRepository;
    private final VoucherMapper voucherMapper;

    @Transactional
    @CacheEvict(value = "vouchers", allEntries = true)
    public VoucherResponse createVoucher(VoucherRequest request) {
        log.info("Creating voucher: {}", request.getCode());

        // Check if code exists
        if (voucherRepository.findByCode(request.getCode()).isPresent()) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Voucher code already exists");
        }

        Voucher voucher = voucherMapper.toVoucher(request);
        voucher.setUsedCount(0);

        // Set user if userId provided
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            voucher.setUser(user);
        }

        voucher = voucherRepository.save(voucher);

        log.info("Voucher created successfully: {}", voucher.getCode());
        return voucherMapper.toVoucherResponse(voucher);
    }

    @Transactional
    @CacheEvict(value = "vouchers", allEntries = true)
    public VoucherResponse updateVoucher(String voucherId, VoucherRequest request) {
        log.info("Updating voucher: {}", voucherId);

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        voucherMapper.updateVoucherFromRequest(request, voucher);

        // Update user if changed
        if (request.getUserId() != null) {
            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
            voucher.setUser(user);
        } else {
            voucher.setUser(null);
        }

        voucher = voucherRepository.save(voucher);

        log.info("Voucher updated successfully: {}", voucherId);
        return voucherMapper.toVoucherResponse(voucher);
    }

    @Transactional
    @CacheEvict(value = "vouchers", allEntries = true)
    public void deleteVoucher(String voucherId) {
        log.info("Deleting voucher: {}", voucherId);

        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        if (voucher.getUsedCount() > 0) {
            throw new AppException(ErrorCode.INVALID_REQUEST,
                    "Cannot delete voucher that has been used");
        }

        voucherRepository.delete(voucher);
        log.info("Voucher deleted successfully: {}", voucherId);
    }

    @Cacheable(value = "vouchers", key = "'admin_all_' + #page + '_' + #size")
    public PageResponse<VoucherResponse> getAllVouchers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Voucher> vouchers = voucherRepository.findAll(pageable);
        Page<VoucherResponse> responsePage = vouchers.map(voucher -> {
            VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
            response.setIsValid(voucher.isValid());
            return response;
        });
        return PageResponse.from(responsePage);
    }

    public VoucherResponse getVoucherById(String voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
        response.setIsValid(voucher.isValid());
        return response;
    }

    @Transactional
    @CacheEvict(value = "vouchers", allEntries = true)
    public VoucherResponse toggleVoucherActive(String voucherId) {
        Voucher voucher = voucherRepository.findById(voucherId)
                .orElseThrow(() -> new AppException(ErrorCode.VOUCHER_NOT_FOUND));

        voucher.setIsActive(!voucher.getIsActive());
        voucher = voucherRepository.save(voucher);

        log.info("Voucher {} active status: {}", voucherId, voucher.getIsActive());

        VoucherResponse response = voucherMapper.toVoucherResponse(voucher);
        response.setIsValid(voucher.isValid());
        return response;
    }

    @Cacheable(value = "vouchers", key = "'admin_stats'")
    public Map<String, Object> getVoucherStatistics() {
        Map<String, Object> stats = new HashMap<>();

        List<Voucher> allVouchers = voucherRepository.findAll();

        stats.put("totalVouchers", allVouchers.size());
        stats.put("activeVouchers", allVouchers.stream()
                .filter(Voucher::getIsActive).count());
        stats.put("expiredVouchers", allVouchers.stream()
                .filter(v -> !v.isValid()).count());

        int totalUsed = allVouchers.stream()
                .mapToInt(Voucher::getUsedCount)
                .sum();
        stats.put("totalUsedCount", totalUsed);

        // Most used voucher
        Optional<Voucher> mostUsed = allVouchers.stream()
                .max(Comparator.comparingInt(Voucher::getUsedCount));
        mostUsed.ifPresent(voucher -> {
            Map<String, Object> mostUsedInfo = new HashMap<>();
            mostUsedInfo.put("code", voucher.getCode());
            mostUsedInfo.put("usedCount", voucher.getUsedCount());
            stats.put("mostUsedVoucher", mostUsedInfo);
        });

        log.info("Voucher statistics generated");
        return stats;
    }

    @Transactional
    @CacheEvict(value = "vouchers", allEntries = true)
    public List<VoucherResponse> bulkCreateVouchers(VoucherRequest request, int quantity) {
        log.info("Bulk creating {} vouchers", quantity);

        List<VoucherResponse> createdVouchers = new ArrayList<>();

        for (int i = 1; i <= quantity; i++) {
            String uniqueCode = request.getCode() + "-" +
                    UUID.randomUUID().toString().substring(0, 6).toUpperCase();

            Voucher voucher = voucherMapper.toVoucher(request);
            voucher.setCode(uniqueCode);
            voucher.setUsedCount(0);

            if (request.getUserId() != null) {
                User user = userRepository.findById(request.getUserId())
                        .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
                voucher.setUser(user);
            }

            voucher = voucherRepository.save(voucher);
            createdVouchers.add(voucherMapper.toVoucherResponse(voucher));
        }

        log.info("Bulk created {} vouchers successfully", quantity);
        return createdVouchers;
    }
}