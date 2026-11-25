/**
 * Email format pattern requiring local part, `@`, domain, and TLD.
 * @constant {RegExp}
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

/**
 * Validates a single student input field, updates its inline error message
 * and `.invalid` class, and returns whether the field is valid.
 *
 * @function validateField
 * @param {string} fieldId - ID of the input element (`firstName`,
 *     `lastName`, or `email`).
 * @returns {boolean} `true` if the field passes validation, otherwise
 *     `false`.
 */
function validateField(fieldId) {
    const input = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    const value = input.value.trim();

    if (input) input.classList.remove("invalid");
    if (errorSpan) errorSpan.textContent = "";

    if (fieldId === "firstName" || fieldId === "lastName") {
        const label = fieldId === "firstName" ? "First name" : "Last name";

        if (value === "") {
            errorSpan.textContent = `${label} is required.`;
            input.classList.add("invalid");
            return false;
        }

        if (value.length < 2) {
            errorSpan.textContent = `${label} must be`
                + " at least 2 characters long.";
            input.classList.add("invalid");
            return false;
        }
    }

    if (fieldId === "email") {
        if (value === "") {
            errorSpan.textContent = "Email address is required.";
            input.classList.add("invalid");
            return false;
        }

        if (!EMAIL_REGEX.test(value)) {
            errorSpan.textContent = "Please enter a valid email address"
                + " (e.g., student@email.com).";
            input.classList.add("invalid");
            return false;
        }
    }

    return true;
}

/**
 * Validates the student form fields (`firstName`, `lastName`, and `email`),
 * updates inline error messages and `.invalid` classes, and returns whether
 * all checks pass.
 *
 * @function validateStudentForm
 * @returns {boolean} `true` if all form fields are valid, otherwise `false`.
 */
function validateStudentForm() {
    let isValid = true;

    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");

    const firstNameError = document.getElementById("firstNameError");
    const lastNameError = document.getElementById("lastNameError");
    const emailError = document.getElementById("emailError");

    clearValidationStyle();

    // firstName validation
    if (firstName.value.trim() === "") {
        firstNameError.textContent = "First name is required.";
        firstName.classList.add("invalid");
        isValid = false;
    } else if (firstName.value.trim().length < 2) {
        firstNameError.textContent = "First name must be"
            + " at least 2 characters long.";

        firstName.classList.add("invalid");
        isValid = false;
    }

    // lastName validation
    if (lastName.value.trim() === "") {
        lastNameError.textContent = "Last name is required.";
        lastName.classList.add("invalid");
        isValid = false;
    } else if (lastName.value.trim().length < 2) {
        lastNameError.textContent = "Last name must be"
            + " at least 2 characters long.";

        lastName.classList.add("invalid");
        isValid = false;
    }

    if (email.value.trim() === "") {
        emailError.textContent = "Email address is required.";
        email.classList.add("invalid");
        isValid = false;
    } else if (!EMAIL_REGEX.test(email.value.trim())) {
        emailError.textContent = "Please enter a valid email address"
            + " (e.g., student@email.com).";

        email.classList.add("invalid");
        isValid = false;
    }

    return isValid;
}

/**
 * Removes the `.invalid` class and clears error text for `firstName`,
 * `lastName`, and `email` fields when their DOM elements exist.
 *
 * @function clearValidationStyle
 * @returns {void}
 */
function clearValidationStyle() {
    const fields = ["firstName", "lastName", "email"];

    fields.forEach(fieldId => {
        const element = document.getElementById(fieldId);
        const errorSpan = document.getElementById(`${fieldId}Error`);
        if (element) element.classList.remove("invalid");
        if (errorSpan) errorSpan.textContent = "";
    });
}

/**
 * Attaches live `input` listeners that re-validate a field only when it
 * already has the `invalid` class.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function() {
    const fields = ["firstName", "lastName", "email"];

    fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (!input) return;

        input.addEventListener("input", function() {
            if (input.classList.contains("invalid")) {
                validateField(fieldId);
            }
        });
    });
});