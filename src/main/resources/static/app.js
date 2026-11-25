const API_URL = "http://localhost:8080/api/students";
const API_AUTH = "http://localhost:8080/api/auth";

/**
 * Sends a POST request to create a new student record, resets the form,
 * and refreshes the student table on success.
 *
 * @async
 * @function createStudent
 * @param {StudentPayload} studentData - The student details to persist.
 * @returns {Promise<void>}
 */
async function createStudent(studentData) {
    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData),
                credentials: "include"
            }
        );

        if (response.ok) {
            alert("Student added successfully!");
            resetForm();
            getAllStudents();
        } else {
            alert("Error adding student.");
        }

    } catch (error) {
        console.error("Error creating student:", error);
    }
}

/**
 * Handles submission of `#studentForm`, validates inputs, and dispatches
 * either an update (`updateStudent`) or create (`createStudent`) request.
 *
 * @listens submit
 * @param {SubmitEvent} e - The form submission event.
 * @returns {void}
 */
document.getElementById("studentForm").addEventListener("submit", function(e) {
    e.preventDefault();

    if (!validateStudentForm()) {
        return;
    }

    const id = document.getElementById("studentId").value;
    const studentData = {
        firstName: document.getElementById("firstName").value.trim(),
        lastName: document.getElementById("lastName").value.trim(),
        email: document.getElementById("email").value.trim()
    };
    
    if (id) {
        updateStudent(id, studentData);
    } else {
        createStudent(studentData);
    }
})

/**
 * Clears the hidden student ID field and resets all inputs in `#studentForm`.
 *
 * @function resetForm
 * @returns {void}
 */
function resetForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();
}

/**
 * Restores `#submitBtn` to its default "Add Student" label and green styling.
 *
 * @function resetBtn
 * @returns {void}
 */
function resetBtn() {
    const submitBtn = document.getElementById("submitBtn");
    submitBtn.textContent = "Add Student";
    submitBtn.style.backgroundColor = "#4f772d";
}

/**
 * Fetches all students from the backend API and renders rows inside
 * `#studentTableBody` with edit and delete action buttons.
 *
 * @async
 * @function getAllStudents
 * @returns {Promise<void>}
 */
async function getAllStudents() {
    try {
        const response = await fetch(
            API_URL,
            {
                method: "GET",
                credentials: "include"
            }
        );

        if (!response.ok) throw new Error("Network response was NOT ok.");

        const students = await response.json();
        const tableBody = document.getElementById("studentTableBody");
        tableBody.innerHTML = "";

        students.forEach(student => {
            const row = `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.firstName}</td>
                    <td>${student.lastName}</td>
                    <td>${student.email}</td>
                    <td>
                        <button 
                            class="btn-edit" 
                            onclick="initializeStudentFormById(${student.id})"
                        >
                            Edit
                        </button>

                        <button 
                            class="btn-delete" 
                            onclick="deleteStudent(${student.id})"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            `;

            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.log("Error fetching students: ", error);
        alert("Failed to fetch students."
            + " Is your Spring Boot backend running?");
    }
}

/**
 * Loads the initial list of students once the initial HTML document is
 * parsed.
 *
 * @listens DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", getAllStudents);

/**
 * Fetches a single student by ID, populates `#studentForm` for editing,
 * switches `#submitBtn` to "Update" mode, and clears prior validation styles.
 *
 * @async
 * @function initializeStudentFormById
 * @param {number|string} id - Unique identifier of the student to edit.
 * @returns {Promise<void>}
 */
async function initializeStudentFormById(id) {
    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                credentials: "include"
            }
        );

        if (!response.ok) throw new Error("Could not fetch student details.");

        const student = await response.json();

        document.getElementById("studentId").value = student.id;
        document.getElementById("firstName").value = student.firstName;
        document.getElementById("lastName").value = student.lastName;
        document.getElementById("email").value = student.email;

        //button change on edit
        const submitBtn = document.getElementById("submitBtn");
        submitBtn.textContent = "Update";
        submitBtn.style.backgroundColor = "#118ab2";

        clearValidationStyle();
    } catch (error) {
        console.error("Error fetching student details: ", error);
    }
}

/**
 * Sends a PUT request to update an existing student record, resets the form
 * and submit button, and refreshes the student table on success.
 *
 * @async
 * @function updateStudent
 * @param {number|string} id - Unique identifier of the student to update.
 * @param {StudentPayload} studentData - Updated student fields.
 * @returns {Promise<void>}
 */
async function updateStudent(id, studentData) {
    try {
        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData),
                credentials: "include"
            }
        );

        if (response.ok) {
            alert("Student updated successfully!");
            resetForm();
            resetBtn();
            getAllStudents();
        } else {
            alert("Error adding student.");
        }

    } catch (error) {
        console.error("Error creating student:", error);
    }
}

/**
 * Prompts for confirmation and sends a DELETE request to remove a student
 * record, refreshing the student table upon success.
 *
 * @async
 * @function deleteStudent
 * @param {number|string} id - Unique identifier of the student to delete.
 * @returns {Promise<void>}
 */
async function deleteStudent(id) {
    if (confirm("Are you sure you want to delete this student?")) {
        try {
             const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                    credentials: "include"
                }
            );

            if (response.ok) {
                const message = await response.text();
                alert(message);
                getAllStudents();
            } else {
                alert("Error deleting student.")
            }

        } catch (error) {
            console.error("Error deleting student: ", error);
        }
    }
}

/**
 * Authenticates a user against the session login endpoint and redirects to
 * `index.html` when successful.
 *
 * @async
 * @function loginUser
 * @param {LoginCredentials} loginDto - User login credentials.
 * @returns {Promise<void>}
 */
async function loginUser(loginDto) {
    try {
        const response = await fetch(
            `${API_AUTH}/auth_login_session`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loginDto),
                credentials: "include"
            }
        );    

        if (response.ok) {
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid credentials.")
        }
    } catch (error) {
        console.error("Login error: ", error);
    }
}

/**
 * Logs out the current session, clears the table and form, attempts to clear
 * cached HTTP Basic credentials, and reloads the page.
 *
 * @async
 * @function logoutUser
 * @returns {Promise<void>}
 */
async function logoutUser() {
    try {
        await fetch(
            `${API_AUTH}/logout`,
            {
                method: "POST",
                credentials: "include"
            }
        );

        document.getElementById("studentTableBody").innerHTML = "";
        resetForm();
        alert("Logged out successfully!");

        try {
            await fetch(
                API_URL,
                {
                    method: "GET",
                    headers: {
                        "Authorization": "Basic " 
                        + btoa("invalid_user:wrong_password")
                    }
                }
            )
        } catch (err) {
            console.log("Browser credential cache cleared.")
        }

        window.location.reload();
    } catch (error) {
        console.error("Logout transmission crash: ", error);
    }
}