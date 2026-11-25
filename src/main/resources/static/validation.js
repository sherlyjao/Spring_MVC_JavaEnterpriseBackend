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

    //firstName validation
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

     //lastName validation
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

    //email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (email.value.trim() === "") {
        emailError.textContent = "Email address is required.";
        email.classList.add("invalid");
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
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