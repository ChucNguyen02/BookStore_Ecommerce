package chucnguyen.bookstore.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import chucnguyen.bookstore.exception.AppException;
import chucnguyen.bookstore.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileUploadService {

    private final Cloudinary cloudinary;

    /**
     * Upload single image to Cloudinary
     */
    public String uploadImage(MultipartFile file, String folder) {
        validateImageFile(file);

        try {
            log.info("Uploading image to folder: {}", folder);

            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "image"
                    // ❌ XÓA quality=auto vì không support
                    // "quality", "auto"
            );

            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
            String imageUrl = (String) uploadResult.get("secure_url");

            log.info("Image uploaded successfully: {}", imageUrl);
            return imageUrl;

        } catch (IOException e) {
            log.error("Failed to upload image: {}", e.getMessage());
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    /**
     * Upload multiple images in parallel
     */
    public List<String> uploadImagesParallel(List<MultipartFile> files, String folder) {
        if (files == null || files.isEmpty()) {
            return List.of();
        }

        log.info("Uploading {} images in parallel to folder: {}", files.size(), folder);

        // Upload all images concurrently
        List<CompletableFuture<String>> uploadFutures = files.stream()
                .map(file -> CompletableFuture.supplyAsync(() -> uploadImage(file, folder)))
                .toList();

        // Wait for all uploads to complete
        CompletableFuture<Void> allUploads = CompletableFuture.allOf(
                uploadFutures.toArray(new CompletableFuture[0])
        );

        try {
            allUploads.join(); // Wait for completion

            // Collect all results
            List<String> imageUrls = uploadFutures.stream()
                    .map(CompletableFuture::join)
                    .collect(Collectors.toList());

            log.info("Successfully uploaded {} images", imageUrls.size());
            return imageUrls;

        } catch (Exception e) {
            log.error("Failed to upload images in parallel: {}", e.getMessage());
            throw new AppException(ErrorCode.IMAGE_UPLOAD_FAILED);
        }
    }

    /**
     * Delete image from Cloudinary
     */
    public void deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicIdFromUrl(imageUrl);
            log.info("Deleting image with publicId: {}", publicId);

            Map<?, ?> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");

            if (!"ok".equals(resultStatus)) {
                log.warn("Image deletion returned status: {}", resultStatus);
            } else {
                log.info("Image deleted successfully: {}", publicId);
            }

        } catch (Exception e) {
            log.error("Failed to delete image: {}", e.getMessage());
            // Don't throw exception, just log it
        }
    }

    /**
     * Validate image file
     */
    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_FILE);
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new AppException(ErrorCode.INVALID_FILE_TYPE);
        }

        // Max 5MB
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new AppException(ErrorCode.FILE_TOO_LARGE);
        }
    }

    /**
     * Extract Cloudinary public_id from URL
     * Example: https://res.cloudinary.com/demo/image/upload/v1234567890/books/covers/abc123.jpg
     * Returns: books/covers/abc123
     */
    private String extractPublicIdFromUrl(String imageUrl) {
        try {
            // Find "/upload/" in the URL
            int uploadIndex = imageUrl.indexOf("/upload/");
            if (uploadIndex == -1) {
                throw new IllegalArgumentException("Invalid Cloudinary URL format");
            }

            // Get everything after "/upload/v{version}/"
            String afterUpload = imageUrl.substring(uploadIndex + 8); // "/upload/".length() = 8

            // Remove version (v1234567890)
            int versionEndIndex = afterUpload.indexOf('/');
            if (versionEndIndex == -1) {
                throw new IllegalArgumentException("Invalid Cloudinary URL format");
            }

            String pathWithExtension = afterUpload.substring(versionEndIndex + 1);

            // Remove file extension
            int lastDotIndex = pathWithExtension.lastIndexOf('.');
            if (lastDotIndex == -1) {
                return pathWithExtension;
            }

            return pathWithExtension.substring(0, lastDotIndex);

        } catch (Exception e) {
            log.error("Failed to extract public_id from URL: {}", imageUrl);
            throw new AppException(ErrorCode.INVALID_IMAGE_URL);
        }
    }
}