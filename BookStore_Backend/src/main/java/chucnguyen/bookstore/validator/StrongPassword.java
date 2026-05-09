package chucnguyen.bookstore.validator;

import jakarta.validation.Constraint;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import jakarta.validation.Payload;

import java.lang.annotation.*;

/**
 * Custom validator for password strength.
 * Validates that password meets minimum requirements:
 * - At least 8 characters
 * - Contains at least 1 uppercase letter
 * - Contains at least 1 lowercase letter
 * - Contains at least 1 digit
 */
@Documented
@Constraint(validatedBy = StrongPassword.Validator.class)
@Target({ElementType.FIELD, ElementType.PARAMETER})
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {

    String message() default "Password must be at least 8 characters with uppercase, lowercase, and digit";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    int minLength() default 8;

    class Validator implements ConstraintValidator<StrongPassword, String> {

        private int minLength;

        @Override
        public void initialize(StrongPassword annotation) {
            this.minLength = annotation.minLength();
        }

        @Override
        public boolean isValid(String password, ConstraintValidatorContext context) {
            if (password == null || password.isBlank()) {
                return false;
            }

            if (password.length() < minLength) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                        "Password must be at least " + minLength + " characters"
                ).addConstraintViolation();
                return false;
            }

            boolean hasUpper = password.chars().anyMatch(Character::isUpperCase);
            boolean hasLower = password.chars().anyMatch(Character::isLowerCase);
            boolean hasDigit = password.chars().anyMatch(Character::isDigit);

            if (!hasUpper || !hasLower || !hasDigit) {
                context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                        "Password must contain at least 1 uppercase letter, 1 lowercase letter, and 1 digit"
                ).addConstraintViolation();
                return false;
            }

            return true;
        }
    }
}
