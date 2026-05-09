package chucnguyen.bookstore.repository;

import chucnguyen.bookstore.entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepository extends JpaRepository<Address, String> {

    // Lấy tất cả địa chỉ của user
    List<Address> findByUserIdOrderByIsDefaultDescCreatedAtDesc(String userId);

    // Lấy địa chỉ mặc định
    Optional<Address> findByUserIdAndIsDefaultTrue(String userId);

    // Đếm số địa chỉ của user
    long countByUserId(String userId);

    // Xóa tất cả địa chỉ của user
    @Modifying
    @Query("DELETE FROM Address a WHERE a.user.id = :userId")
    void deleteByUserId(@Param("userId") String userId);

    // Set địa chỉ khác thành không phải default
    @Modifying
    @Query("UPDATE Address a SET a.isDefault = false WHERE a.user.id = :userId AND a.id != :addressId")
    void unsetOtherDefaults(@Param("userId") String userId, @Param("addressId") String addressId);
}
