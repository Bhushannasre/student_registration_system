// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', loadStudents);

const form = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');

// Event listener for adding or updating a record
form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const studentId = document.getElementById('studentId').value.trim();
    const email = document.getElementById('email').value.trim();
    const contact = document.getElementById('contact').value.trim();

    if (!validateInputs(name, studentId, email, contact)) return;

    const students = getStudents();

    const editIndex = form.dataset.editIndex;
    if (editIndex) {
        students[editIndex] = { name, studentId, email, contact };
        form.removeAttribute('data-edit-index');
    } else {
        students.push({ name, studentId, email, contact });
    }

    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
    form.reset();
});

// Load and render student records
function loadStudents() {
    const students = getStudents();
    studentList.innerHTML = '';

    students.forEach((student, index) => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.studentId}</td>
            <td>${student.email}</td>
            <td>${student.contact}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editStudent(${index})">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        studentList.appendChild(row);
    });
}

// Get students from localStorage
function getStudents() {
    return JSON.parse(localStorage.getItem('students')) || [];
}

// Delete student by index
function deleteStudent(index) {
    const students = getStudents();
    students.splice(index, 1);
    localStorage.setItem('students', JSON.stringify(students));
    loadStudents();
}

// Edit student by index
function editStudent(index) {
    const students = getStudents();
    const student = students[index];

    document.getElementById('name').value = student.name;
    document.getElementById('studentId').value = student.studentId;
    document.getElementById('email').value = student.email;
    document.getElementById('contact').value = student.contact;

    form.dataset.editIndex = index;
}

// Validate input fields
function validateInputs(name, studentId, email, contact) {
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!nameRegex.test(name)) {
        alert('Name must contain only letters.');
        return false;
    }
    if (!studentId || isNaN(studentId)) {
        alert('Student ID must be a number.');
        return false;
    }
    if (!emailRegex.test(email)) {
        alert('Enter a valid email address.');
        return false;
    }
    if (!contact || isNaN(contact) || contact.length < 10) {
        alert('Enter a valid contact number (at least 10 digits).');
        return false;
    }
    return true;
}
document.getElementById('resetBtn').addEventListener('click', () => {
    form.removeAttribute('data-edit-index');
});
