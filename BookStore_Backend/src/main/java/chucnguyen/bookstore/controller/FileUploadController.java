package chucnguyen.bookstore.controller;

import chucnguyen.bookstore.dto.response.ApiResponse;
import chucnguyen.bookstore.service.FileUploadService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/upload")
@RequiredArgsConstructor
@Tag(name = "File Upload", description = "File upload APIs")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    @PostMapping(value = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload single image")
    public ApiResponse<String> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String folder) {
        String imageUrl = fileUploadService.uploadImage(file, folder);
        return ApiResponse.success(imageUrl, "Image uploaded successfully");
    }

    @PostMapping(value = "/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Upload multiple images")
    public ApiResponse<List<String>> uploadImages(
            @RequestParam("files") List<MultipartFile> files,
            @RequestParam(defaultValue = "general") String folder) {

        List<String> imageUrls = new ArrayList<>();
        for (MultipartFile file : files) {
            String imageUrl = fileUploadService.uploadImage(file, folder);
            imageUrls.add(imageUrl);
        }

        return ApiResponse.success(imageUrls, "Images uploaded successfully");
    }

    @DeleteMapping("/image")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Delete image (Admin only)")
    public ApiResponse<Void> deleteImage(@RequestParam String imageUrl) {
        fileUploadService.deleteImage(imageUrl);
        return ApiResponse.success("Image deleted successfully");
    }
}