package chucnguyen.bookstore.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    // ============= SYNC DELETE (Single Image) =============

    public void deleteImage(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);

            if (publicId == null) {
                log.warn("Cannot extract public_id from URL: {}", imageUrl);
                return;
            }

            Map result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            String resultStatus = (String) result.get("result");

            if ("ok".equals(resultStatus)) {
                log.info("Successfully deleted image: {}", publicId);
            } else if ("not found".equals(resultStatus)) {
                log.warn("Image not found in Cloudinary: {}", publicId);
            } else {
                log.warn("Unexpected delete result for {}: {}", publicId, resultStatus);
            }

        } catch (Exception e) {
            log.error("Error deleting image from Cloudinary: {}", imageUrl, e);
            // Don't throw - deletion failures shouldn't break the flow
        }
    }

    // ============= ASYNC DELETE (Single Image) =============

    @Async("taskExecutor")
    public CompletableFuture<Void> deleteImageAsync(String imageUrl) {
        log.debug("Async deleting image: {}", imageUrl);

        try {
            deleteImage(imageUrl);
            return CompletableFuture.completedFuture(null);
        } catch (Exception e) {
            log.error("Error in async delete for: {}", imageUrl, e);
            // Return completed future even on error to not break the chain
            return CompletableFuture.completedFuture(null);
        }
    }

    // ============= PARALLEL DELETE (Multiple Images) =============

    public void deleteImages(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            log.debug("No images to delete");
            return;
        }

        log.info("Deleting {} images in parallel", imageUrls.size());

        try {
            // Create futures for all deletions
            List<CompletableFuture<Void>> futures = imageUrls.stream()
                    .map(this::deleteImageAsync)
                    .collect(Collectors.toList());

            // Wait for all to complete (non-blocking after this point)
            CompletableFuture<Void> allFutures = CompletableFuture.allOf(
                    futures.toArray(new CompletableFuture[0])
            );

            // Join all futures
            allFutures.join();

            log.info("Completed deletion of {} images", imageUrls.size());

        } catch (Exception e) {
            log.error("Error during parallel image deletion", e);
            // Don't throw - deletion is best effort
        }
    }

    // ============= BATCH DELETE (Cloudinary API) =============

    @Async("taskExecutor")
    public CompletableFuture<Void> deleteBatchAsync(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return CompletableFuture.completedFuture(null);
        }

        log.info("Batch deleting {} images", imageUrls.size());

        try {
            // Extract public IDs
            List<String> publicIds = imageUrls.stream()
                    .map(this::extractPublicId)
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

            if (publicIds.isEmpty()) {
                log.warn("No valid public IDs found in URLs");
                return CompletableFuture.completedFuture(null);
            }

            // Cloudinary batch delete (max 100 at a time)
            int batchSize = 100;
            for (int i = 0; i < publicIds.size(); i += batchSize) {
                List<String> batch = publicIds.subList(
                        i,
                        Math.min(i + batchSize, publicIds.size())
                );

                try {
                    Map result = cloudinary.api().deleteResources(
                            batch,
                            ObjectUtils.emptyMap()
                    );

                    Map deleted = (Map) result.get("deleted");
                    log.info("Batch deleted {} images, result: {}",
                            batch.size(),
                            deleted != null ? deleted.size() : 0);

                } catch (Exception e) {
                    log.error("Error in batch delete", e);
                }
            }

            return CompletableFuture.completedFuture(null);

        } catch (Exception e) {
            log.error("Error in batch delete operation", e);
            return CompletableFuture.completedFuture(null);
        }
    }

    // ============= UTILITY METHODS =============

    private String extractPublicId(String imageUrl) {
        try {
            if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
                return null;
            }

            // Pattern: .../upload/[version]/[folder]/[id].[ext]
            String[] parts = imageUrl.split("/upload/");
            if (parts.length < 2) {
                return null;
            }

            String pathWithVersion = parts[1];

            // Remove version (v1234567890)
            String[] versionParts = pathWithVersion.split("/", 2);
            String pathWithoutVersion = versionParts.length > 1 ? versionParts[1] : pathWithVersion;

            // Remove extension
            int lastDotIndex = pathWithoutVersion.lastIndexOf('.');
            if (lastDotIndex > 0) {
                return pathWithoutVersion.substring(0, lastDotIndex);
            }

            return pathWithoutVersion;

        } catch (Exception e) {
            log.error("Error extracting public_id from URL: {}", imageUrl, e);
            return null;
        }
    }

    // ============= DELETE BY PREFIX (Folder) =============

    @Async("taskExecutor")
    public CompletableFuture<Void> deleteByPrefixAsync(String prefix) {
        log.info("Deleting all images with prefix: {}", prefix);

        try {
            Map result = cloudinary.api().deleteResourcesByPrefix(
                    prefix,
                    ObjectUtils.emptyMap()
            );

            Map deleted = (Map) result.get("deleted");
            log.info("Deleted images by prefix {}: {} items",
                    prefix,
                    deleted != null ? deleted.size() : 0);

            return CompletableFuture.completedFuture(null);

        } catch (Exception e) {
            log.error("Error deleting by prefix: {}", prefix, e);
            return CompletableFuture.completedFuture(null);
        }
    }

    // ============= CLEANUP OLD IMAGES =============

    @Async("taskExecutor")
    public CompletableFuture<Integer> cleanupUnusedImages(List<String> usedImageUrls) {
        log.info("Starting cleanup of unused images");

        try {
            // Get all images from Cloudinary
            Map result = cloudinary.api().resources(
                    ObjectUtils.asMap("type", "upload", "max_results", 500)
            );

            List<Map> resources = (List<Map>) result.get("resources");

            // Extract used public IDs
            List<String> usedPublicIds = usedImageUrls.stream()
                    .map(this::extractPublicId)
                    .filter(id -> id != null)
                    .collect(Collectors.toList());

            // Find unused images
            List<String> unusedPublicIds = new ArrayList<>();
            for (Map resource : resources) {
                String publicId = (String) resource.get("public_id");
                if (!usedPublicIds.contains(publicId)) {
                    unusedPublicIds.add(publicId);
                }
            }

            // Delete unused images
            if (!unusedPublicIds.isEmpty()) {
                log.info("Found {} unused images, deleting...", unusedPublicIds.size());

                for (String publicId : unusedPublicIds) {
                    try {
                        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
                    } catch (Exception e) {
                        log.error("Error deleting unused image: {}", publicId, e);
                    }
                }
            }

            log.info("Cleanup completed, deleted {} unused images", unusedPublicIds.size());
            return CompletableFuture.completedFuture(unusedPublicIds.size());

        } catch (Exception e) {
            log.error("Error during cleanup operation", e);
            return CompletableFuture.completedFuture(0);
        }
    }

    // ============= CHECK IF IMAGE EXISTS =============

    public boolean imageExists(String imageUrl) {
        try {
            String publicId = extractPublicId(imageUrl);
            if (publicId == null) {
                return false;
            }

            Map result = cloudinary.api().resource(publicId, ObjectUtils.emptyMap());
            return result != null && result.get("public_id") != null;

        } catch (Exception e) {
            log.debug("Image does not exist or error checking: {}", imageUrl);
            return false;
        }
    }
}