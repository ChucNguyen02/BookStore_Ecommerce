package chucnguyen.bookstore.util;

import com.github.slugify.Slugify;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

public class SlugUtils {

    private static final Pattern NON_LATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");
    private static final Slugify SLUGIFY = Slugify.builder().build();

    /**
     * Create URL-friendly slug from Vietnamese text
     *
     * Example:
     * "Lập Trình Java Cơ Bản" -> "lap-trinh-java-co-ban"
     * "Harry Potter và Hòn Đá Phù Thủy" -> "harry-potter-va-hon-da-phu-thuy"
     */
    public static String createSlug(String input) {
        if (input == null || input.isBlank()) {
            return "";
        }

        try {
            // Use Slugify library which handles Vietnamese well
            return SLUGIFY.slugify(input);
        } catch (Exception e) {
            // Fallback to manual method
            return createSlugManually(input);
        }
    }

    /**
     * Manual slug creation (fallback method)
     */
    private static String createSlugManually(String input) {
        // Normalize Vietnamese characters
        String normalized = Normalizer.normalize(input.toLowerCase(Locale.ROOT), Normalizer.Form.NFD);

        // Remove accents
        normalized = NON_LATIN.matcher(normalized).replaceAll("");

        // Replace whitespace with hyphens
        normalized = WHITESPACE.matcher(normalized).replaceAll("-");

        // Remove consecutive hyphens
        normalized = normalized.replaceAll("-+", "-");

        // Trim hyphens from start and end
        normalized = normalized.replaceAll("^-|-$", "");

        return normalized;
    }

    /**
     * Create unique slug by appending number if exists
     */
    public static String createUniqueSlug(String input, int attempt) {
        String baseSlug = createSlug(input);

        if (attempt == 0) {
            return baseSlug;
        }

        return baseSlug + "-" + attempt;
    }
}
