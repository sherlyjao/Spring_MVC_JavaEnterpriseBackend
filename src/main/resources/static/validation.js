const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const STUDENT_FIELDS = ["firstName", "lastName", "email"];

/**
 * Sets an inline error message and marks an input element as invalid.
 *
 * @function setFieldError
 * @param {HTMLInputElement} input - Target input element.
 * @param {HTMLElement} errorSpan - Element that displays the error text.
 * @param {string} message - Validation error message to display.
 * @returns {false} Always returns `false` to indicate failed validation.
 */
function setFieldError(input, errorSpan, message) {
    input.classList.add("invalid");
    errorSpan.textContent = message;
    return false;
}

/**
 * Clears the `.invalid` class and error message for a single field.
 *
 * @function clearFieldError
 * @param {string} fieldId - ID of the input element (`firstName`,
 *     `lastName`, or `email`).
 * @returns {void}
 */
function clearFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);

    if (input) input.classList.remove("invalid");
    if (errorSpan) errorSpan.textContent = "";
}

/**
 * Validates a single student input field, updates its inline error state,
 * and returns whether it passes validation.
 *
 * @function validateField
 * @param {string} fieldId - ID of the input element (`firstName`,
 *     `lastName`, or `email`).
 * @returns {boolean} `true` if the field is valid, otherwise `false`.
 */
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    const value = input.value.trim();

    clearFieldError(fieldId);

    if (fieldId === "firstName" || fieldId === "lastName") {
        const label = fieldId === "firstName" ? "First name" : "Last name";

        if (value === "") {
            return setFieldError(input, errorSpan, `${label} is required.`);
        }

        if (value.length < 2) {
            return setFieldError(
                input,
                errorSpan,
                `${label} must be at least 2 characters long.`
            );
        }
    }

    if (fieldId === "email") {
        if (value === "") {
            return setFieldError(
                input,
                errorSpan,
                "Email address is required."
            );
        }

        if (!EMAIL_REGEX.test(value)) {
            return setFieldError(
                input,
                errorSpan,
                "Please enter a valid email address"
                    + " (e.g., student@email.com)."
            );
        }
    }

    return true;
}

/**
 * Validates all student form fields and returns whether every check passes.
 *
 * @function validateStudentForm
 * @returns {boolean} `true` if all form fields are valid, otherwise `false`.
 */
function validateStudentForm() {
    return STUDENT_FIELDS
        .map(fieldId => validateField(fieldId))
        .every(Boolean);
}

/**
 * Removes validation styling and error text across all student form fields.
 *
 * @function clearValidationStyle
 * @returns {void}
 */
function clearValidationStyle() {
    STUDENT_FIELDS.forEach(fieldId => clearFieldError(fieldId));
}

/**
 * Attaches live `input` listeners that re-validate a field only when it
 * already has the `invalid` class.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function() {
    STUDENT_FIELDS.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        input.addEventListener("input", function() {
            if (input.classList.contains("invalid")) {
                validateField(fieldId);
            }
        });
    });
});