package chucnguyen.bookstore.service;

import chucnguyen.bookstore.dto.request.AddressRequest;
import chucnguyen.bookstore.dto.response.AddressResponse;
import chucnguyen.bookstore.entity.Address;
import chucnguyen.bookstore.entity.User;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import chucnguyen.bookstore.mapper.AddressMapper;
import chucnguyen.bookstore.repository.AddressRepository;
import chucnguyen.bookstore.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AddressService {

    private final AddressRepository addressRepository;
    private final UserRepository userRepository;
    private final AddressMapper addressMapper;

    @Cacheable(value = "addresses", key = "'user_' + #email")
    public List<AddressResponse> getUserAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        List<Address> addresses = addressRepository.findByUserIdOrderByIsDefaultDescCreatedAtDesc(user.getId());
        return addressMapper.toAddressResponseList(addresses);
    }

    @Transactional
    @CacheEvict(value = "addresses", allEntries = true)
    public AddressResponse createAddress(String email, AddressRequest request) {
        log.info("Creating new address for user: {}", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressMapper.toAddress(request);
        address.setUser(user);

        // Save first to get ID
        address = addressRepository.save(address);

        // Then unset others if this is default
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.unsetOtherDefaults(user.getId(), address.getId());
        }

        log.info("Address created successfully for user: {}", email);

        return addressMapper.toAddressResponse(address);
    }

    @Transactional
    @CacheEvict(value = "addresses", allEntries = true)
    public AddressResponse updateAddress(String email, String addressId, AddressRequest request) {
        log.info("Updating address {} for user: {}", addressId, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Check ownership
        if (!address.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Update
        addressMapper.updateAddressFromRequest(request, address);

        // Handle default flag
        if (Boolean.TRUE.equals(request.getIsDefault())) {
            addressRepository.unsetOtherDefaults(user.getId(), addressId);
        }

        address = addressRepository.save(address);

        return addressMapper.toAddressResponse(address);
    }

    @Transactional
    @CacheEvict(value = "addresses", allEntries = true)
    public void deleteAddress(String email, String addressId) {
        log.info("Deleting address {} for user: {}", addressId, email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Check ownership
        if (!address.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        addressRepository.delete(address);

        log.info("Address deleted successfully");
    }

    @Transactional
    @CacheEvict(value = "addresses", allEntries = true)
    public AddressResponse setDefaultAddress(String email, String addressId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND));

        // Check ownership
        if (!address.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        // Unset other defaults
        addressRepository.unsetOtherDefaults(user.getId(), addressId);

        // Set as default
        address.setIsDefault(true);
        address = addressRepository.save(address);

        return addressMapper.toAddressResponse(address);
    }

    @Cacheable(value = "addresses", key = "'default_' + #email")
    public AddressResponse getDefaultAddress(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Address address = addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .orElseThrow(() -> new AppException(ErrorCode.ADDRESS_NOT_FOUND,
                        "No default address found"));

        return addressMapper.toAddressResponse(address);
    }

    @Cacheable(value = "addresses", key = "'count_' + #email")
    public long countUserAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        return addressRepository.countByUserId(user.getId());
    }

    @Transactional
    @CacheEvict(value = "addresses", allEntries = true)
    public void deleteAllUserAddresses(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        addressRepository.deleteByUserId(user.getId());
    }
}
