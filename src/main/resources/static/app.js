const API_URL = "http://localhost:8080/api/students";

//create a student
async function createStudent(studentData) {
    try {
        const response = await fetch(
            API_URL,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(studentData)
            }
        );

        if (response.ok) {
            alert("Student added successfully!");
            resetForm();
        } else {
            alert("Error adding student.");
        }

    } catch (error) {
        console.error("Error creating student:", error);
    }
}

//event listener
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
    createStudent(studentData);
})

//Helper functions to clear form
function resetForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentForm").reset();
}