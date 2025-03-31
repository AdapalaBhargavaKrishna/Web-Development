// <--------------------Toast-------------------->

function showToast() {
    Toastify({
        text: "⚠ Please Select a Subject",
        duration: 3000,
        close: true,
        gravity: "top",
        position: "right",
        offset: {
            x: 50,
            y: 100
        },
        style: {
            background: "#ff5656",
            color: "#fff",
            fontWeight: "bold",
        },
    }).showToast();
}

// <--------------------Section Name-------------------->
const sectionName = new URLSearchParams(window.location.search).get("section");

// <--------------------Total Students-------------------->

let TotStudents = [];

if (sectionName === "it1") {
    TotStudents = [...Array(70).keys()].map(i => (i + 1).toString())
        .concat([...Array(7).keys()].map(i => (301 + i).toString()));

} else if (sectionName === "it2") {
    TotStudents = [...Array(70).keys()].map(i => (71 + i).toString())
        .concat([...Array(7).keys()].map(i => (308 + i).toString()));
        
} else if (sectionName === "it3") {
    TotStudents = [...Array(70).keys()].map(i => (138 + i).toString())
        .concat([...Array(6).keys()].map(i => (315 + i).toString()));

} else {
    console.log("Invalid Section Name");
}

const batchData = {
    "Batch-1": TotStudents.slice(0, 26),         
    "Batch-2": TotStudents.slice(26, 51),        
    "Batch-3": TotStudents.slice(51)             
};

console.log("Batches:", batchData);

// <--------------------Total Subjects-------------------->

    const subjects = [
        "PQT : Probability and Queueing Theory",
        "DCCST : DC Circuits Sensors and Transducers",
        "DBMS : Database Management Systems",
        "DAA : Design and Analysis of Algorithms",
        "EEA : Engineering Economics and Accountancy",
        "ES : Environmental Science",
        "MAD : Mobile Application Development",
        "DBMS Lab : Database Management Systems Lab",
        "ALG Lab : Algorithms Lab",
        "MP-I : Mini Project – I",
        "MENTORING : MENTORING"
    ];

// <--------------------Show Sections-------------------->

function showSection(section) {
    fetch(`sections/faculty/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("mainbar").innerHTML = data;

            requestAnimationFrame(() => {
                if (section === "Fees") populateFeeTable();
                if (section === "announcements") loadAnnouncements();
                if (section === "assignments") {
                    if (!db) { 
                        openDatabase(() => {
                            getAssignmentsFromDB(); // Load assignments after IndexedDB is ready
                            AssignmentsFunction();
                        });
                    } else {
                        getAssignmentsFromDB();
                        AssignmentsFunction();
                    }
                }
            });
        })
        .catch(error => {
            console.error("Error loading section:", error);
            document.getElementById("mainbar").innerHTML = `<h2>Error Loading ${section}</h2>`;
        });
}

// <--------------------Logout-------------------->

function logout() {
    window.location.href = "index.html";
}

function formatRollNumber(roll) {
    return `160123737${String(roll).padStart(3, '0')}`;
}

// <--------------------Attendance-------------------->

let rollNumbers = [];
let attendance = {};

function selectType(type) {
    const rollNumbersDiv = document.getElementById('rollNumbers');
    const batchSelect = document.getElementById('batch-select');
    const subjectSelect = document.getElementById('subject-dropdown');
    rollNumbersDiv.innerHTML = '';

    if (!subjectSelect.value) {
        showToast()
        return;
    }

    document.getElementById('absenteesList').innerHTML = '';

    if (type === "class") {
        batchSelect.value = "";
        rollNumbers = [...TotStudents]; 
    } else if (type === "batch") {
        const selectedBatch = batchSelect.value;
        rollNumbers = batchData[selectedBatch] || [];
    }

    rollNumbers.forEach(roll => {
        const rollNumberDiv = document.createElement('div');
        rollNumberDiv.className = 'roll-number';
        rollNumberDiv.textContent = roll;
        rollNumberDiv.setAttribute('data-roll', roll);
        rollNumberDiv.addEventListener('click', () => markAttendance(roll));
        rollNumbersDiv.appendChild(rollNumberDiv);
    });
}

// <--------------------Attendance Marking-------------------->

function markAttendance(roll) {
    const rollNumberDiv = document.querySelector(`.roll-number[data-roll="${roll}"]`);
    
    if (!attendance[roll]) {
        attendance[roll] = 'present';
    } else if (attendance[roll] === 'present') {
        attendance[roll] = 'absent';
    } else {
        attendance[roll] = 'present';
    }

    gsap.to(rollNumberDiv, {
        scale: 0,
        duration: 0.1,
        onComplete: () =>{
            updateRollNumberDisplay(roll);
            gsap.to(rollNumberDiv, {
                scale: 1,
                duration:0.1
            })
        }
    })
}

function updateRollNumberDisplay(roll) {
    const rollNumberDivs = document.querySelectorAll('.roll-number');
    rollNumberDivs.forEach(div => {
        if (div.textContent === roll) {
            div.style.backgroundColor = attendance[roll] === 'present' ? '#4CAF50' : '#FF0000';
        }
    });
}

async function finalizeAttendance() {
    rollNumbers.forEach(roll => {
        if (!(roll in attendance)) {
            attendance[roll] = 'Absent';
        }
    });

    const selectedSubject = document.getElementById('subject-dropdown');

    if (!selectedSubject.value) {
        alert("Please select a subject!");
        return;
    }

    const attendanceData = {
        date: new Date().toISOString().split('T')[0], 
        subject: selectedSubject.value,
        section: sectionName,
        students: rollNumbers.map(roll => ({
            rollNumber: formatRollNumber(roll),
            status: attendance[roll]
        }))
    };

    console.log("Sending Data:", JSON.stringify(attendanceData, null, 2)); // Debugging
    const absentees = Object.keys(attendance).filter(roll => attendance[roll] === 'Absent');
    const absenteesListDiv = document.getElementById('absenteesList');
    absenteesListDiv.innerHTML = `<h3>Absentees: ${absentees.join(', ')}</h3>`;

    try {
        const response = await fetch('http://localhost:3000/submit-attendance', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(attendanceData)
        });

        const result = await response.json();
        // alert(result.message || result.error);
    } catch (error) {
        console.error("Error submitting attendance:", error);
    }

    rollNumbers.forEach(updateRollNumberDisplay);
    document.getElementById("clear-button").style.display = "block";
}


function clearAttendance() {
    attendance = {};
    document.getElementById('absenteesList').innerHTML = '';
    document.getElementById('rollNumbers').innerHTML = '';
    document.getElementById("clear-button").style.display = "none";
}

/*<---------------GSAP--------------->*/

var tl = gsap.timeline();

tl.from(".ani", {
    y: -30,
    opacity: 0,
    duration: 0.5,
    delay: 0.5,
    stagger: 0.2
})

tl.from(".maincontent h2, .maincontent p", {
    y: 20,
    scale: 0.8,
    opacity: 0,
    duration: 0.5
})

gsap.from(".ani2", {
    x: -30,
    opacity: 0,
    duration: 0.5,
    delay: 0.5,
    stagger: 0.2
})

function BreakText() {
    var h1tag = document.getElementById("heading")
    var h1Text = h1tag.textContent;
    var splittedText = h1Text.split("");
    var clutter = ""
    splittedText.forEach(function(elem){
        clutter += `<span>${elem}</span>`
    })
    h1tag.innerHTML = clutter;
}
BreakText();
gsap.from("#heading span", {
    y: 100,
    opacity: 0,
    duration: 0.5,
    delay: 0.2,
    stagger: 0.1
})

/*<---------------Fees--------------->*/

function populateFeeTable() {
    let feeTable = document.getElementById("feeTable");
    feeTable.innerHTML = "";

    TotStudents.forEach(roll => {
        let row = document.createElement("tr");

        // Roll No Column
        let rollCell = document.createElement("td");
        rollCell.textContent = roll;
        row.appendChild(rollCell);

        // Status Column
        let statusCell = document.createElement("td");
        statusCell.className = "fee-status";
        statusCell.textContent = "Unpaid";
        statusCell.style.color = "red";
        row.appendChild(statusCell);

        // Due Amount Column
        let dueAmountCell = document.createElement("td");
        let dueInput = document.createElement("input");
        dueAmountCell.className = "due-amount";
        dueInput.type = "number";
        dueInput.placeholder = "Due Amount";
        dueInput.disabled = true;
        dueInput.addEventListener("input", function () {
            updateFeeStatus(dueInput, statusCell);
        });
        dueAmountCell.appendChild(dueInput);
        row.appendChild(dueAmountCell);

        // Action Column
        let actionCell = document.createElement("td");

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "due-edit";
        editButton.onclick = function () {
            dueInput.disabled = false; // Enable input field
            dueInput.focus(); // Focus input for editing
            editButton.style.display = "none"; // Hide Edit button
            saveButton.style.display = "inline-block"; // Show Save button
        };

        let saveButton = document.createElement("button");
        saveButton.textContent = "Save";
        saveButton.className = "due-edit";
        saveButton.style.display = "none"; // Initially hidden
        saveButton.onclick = function () {
            dueInput.disabled = true; // Disable input field
            saveButton.style.display = "none"; // Hide Save button
            editButton.style.display = "inline-block"; // Show Edit button
        };

        actionCell.appendChild(editButton);
        actionCell.appendChild(saveButton);
        row.appendChild(actionCell);

        feeTable.appendChild(row);
    });
}

function updateFeeStatus(dueInput, statusCell) {
    if (dueInput.value == 0 || dueInput.value === "") {
        statusCell.textContent = "Paid";
        statusCell.style.color = "green";
    } else {
        statusCell.textContent = "Unpaid";
        statusCell.style.color = "red";
    }
}

/*<---------------Records--------------->*/

function populateRecords() {

    
    const subjectSelect = document.getElementById("subject-select");
    
    subjects.forEach(subject => {
        let option = document.createElement("option");
        option.textContent = subject;
        subjectSelect.appendChild(option);
    });
    

    const overallMarksBtn = document.querySelector(".marks-buttons button");
    const searchRollNosDiv = document.querySelector(".search-rollnos");
    
    overallMarksBtn.addEventListener("click", function () {
        searchRollNosDiv.style.display = "flex";
        displayoverallMarks();
    });
    
    subjectSelect.addEventListener("change", function () {
        if (subjectSelect.value !== "") {
            searchRollNosDiv.style.display = "flex";  
        }
    });
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const mainbar = document.getElementById('mainbar');
    const isVisible = sidebar.classList.contains('active');

    if (isVisible) {
        sidebar.classList.remove('active');
        mainbar.classList.remove('hidden'); // Show mainbar
    } else {
        sidebar.classList.add('active');
        mainbar.classList.add('hidden'); // Hide mainbar
    }
}

function handleSidebarButtonClick() {
    const sidebar = document.getElementById('sidebar');
    const mainbar = document.getElementById('mainbar');

    sidebar.classList.remove('active');
    mainbar.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.sidebar button').forEach(button => {
        button.addEventListener('click', handleSidebarButtonClick);
    });
});

function togglePostButton() {
    let section = document.getElementById("sectionSelect").value;
    let dropSubject = document.getElementById("subjectDropdown").value;
    let inputField = document.getElementById("announcementInput");
    let postButton = document.getElementById("postButton");

    if (section !== "" && dropSubject !== "") {
        inputField.disabled = false;
        postButton.disabled = false;
    } else {
        inputField.disabled = true;
        postButton.disabled = true;
    }

    loadAnnouncements();
}

function addAnnouncement() {
    let input = document.getElementById("announcementInput").value.trim();
    let section = document.getElementById("sectionSelect").value;

    if (input === "") {
        alert("Please enter an announcement!");
        return;
    }

    if (section === "") {
        alert("Please select a section first!");
        return;
    }

    let announcements = JSON.parse(localStorage.getItem(`announcements_${section}`)) || [];

    let newAnnouncement = {
        text: input,
        time: new Date().toLocaleString()
    };
    announcements.unshift(newAnnouncement);

    localStorage.setItem(`announcements_${section}`, JSON.stringify(announcements));
    document.getElementById("announcementInput").value = "";

    loadAnnouncements();
}

function loadAnnouncements() {
    let section = document.getElementById("sectionSelect").value;
    let announcementList = document.getElementById("announcementsList");

    announcementList.innerHTML = ""; 

    if (section === "") return;

    let announcements = JSON.parse(localStorage.getItem(`announcements_${section}`)) || [];

    announcements.forEach((announcement, index) => {
        let announcementDiv = document.createElement("div");
        announcementDiv.classList.add("announcement-item");
        announcementDiv.innerHTML = `
            <p>${announcement.text}</p>
            <small>${announcement.time} | Section: ${section}</small>
            <button onclick="deleteAnnouncement(${index})">X</button>
        `;
        announcementList.appendChild(announcementDiv);
    });
}

function deleteAnnouncement(index) {
    let section = document.getElementById("sectionSelect").value;
    let announcements = JSON.parse(localStorage.getItem(`announcements_${section}`)) || [];
    
    announcements.splice(index, 1);
    localStorage.setItem(`announcements_${section}`, JSON.stringify(announcements));
    
    loadAnnouncements();
}

/*<---------------Assignments--------------->*/

let db;

function openDatabase(callback) {
    const request = indexedDB.open("AttendZ_DB", 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("assignments")) {
            const assignmentStore = db.createObjectStore("assignments", { keyPath: "id" });
            assignmentStore.createIndex("title", "title", { unique: false });
        }
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log("IndexedDB opened successfully.");
        if (callback) callback(); // Call the callback function once database is ready
    };

    request.onerror = function(event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };
}


function saveAssignmentToDB(assignment) {
    const transaction = db.transaction(['assignments'], 'readwrite');
    const store = transaction.objectStore('assignments');
    store.add(assignment);

    transaction.oncomplete = function() {
        console.log('Assignment saved to DB');
    };

    transaction.onerror = function(event) {
        console.error('Error saving assignment:', event.target.errorCode);
    };
}

function createAssignment() {
    if (!db) {
        console.error("Database not opened yet.");
        return;
    }

    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDesc').value;
    const fileInput = document.getElementById('assignmentFile');
    const file = fileInput.files[0];

    if (!title || !description) {
        alert('Please fill in both the title and description.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const fileData = event.target.result;

        const assignment = {
            id: Date.now(),
            title,
            description,
            file: fileData,
            fileName: file ? file.name : null,
            submissions: []
        };

        const transaction = db.transaction(["assignments"], "readwrite");
        const store = transaction.objectStore("assignments");
        const request = store.add(assignment);

        request.onsuccess = function() {
            console.log("Assignment saved!");
            getAssignmentsFromDB();
        };

        request.onerror = function() {
            console.error("Error saving assignment.");
        };
    };

    if (file) {
        reader.readAsDataURL(file); // Convert file to Base64 for storage
    } else {
        const assignment = {
            id: Date.now(),
            title,
            description,
            file: null,
            fileName: null,
            submissions: []
        };

        const transaction = db.transaction(["assignments"], "readwrite");
        const store = transaction.objectStore("assignments");
        store.add(assignment).onsuccess = function() {
            console.log("Assignment saved without file!");
            getAssignmentsFromDB();
        };
    }

    clearAssignmentForm();
}

function getAssignmentsFromDB() {
    const transaction = db.transaction(["assignments"], "readonly");
    const store = transaction.objectStore("assignments");
    const request = store.getAll();

    request.onsuccess = function(event) {
        assignments = event.target.result;
        updateAssignmentsList();
    };

    request.onerror = function() {
        console.error("Error retrieving assignments.");
    };
}


function updateAssignmentsList() {
    const assignmentItems = document.getElementById('assignmentItems');
    assignmentItems.innerHTML = '';

    assignments.forEach(assignment => {
        const li = document.createElement('li');
        li.className = 'assignment-item';
        li.innerHTML = `${assignment.title}`;
        li.addEventListener('click', () => showAssignmentDetails(assignment.id));
        assignmentItems.appendChild(li);
    });
}

function showAssignmentDetails(id) {
    const assignment = assignments.find(a => a.id === id);
    if (!assignment) return;

    const createSection = document.getElementById('create-assignment');
    const listSection = document.getElementById('assignments-list');
    const detailsSection = document.getElementById('assignment-details');
    const info = document.getElementById('assignment-info');
    const count = document.getElementById('submitted-count');

    let fileHTML = "<p>No file attached</p>";
    if (assignment.file) {
        const byteCharacters = atob(assignment.file.split(',')[1]); 
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: "application/octet-stream" });

        const fileURL = URL.createObjectURL(blob);
        fileHTML = `<a class="assignment-download" href="${fileURL}" download="${assignment.fileName}">📂 Download Assignment</a>`;
    }

    info.innerHTML = `
        <div><b>Title:</b><p>${assignment.title}</p></div>
        <div><b>Description:</b><p>${assignment.description}</p></div>
        <div><b>File:</b>${fileHTML}</div>
    `;

    count.textContent = assignment.submissions.length;

    gsap.to([createSection, listSection], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        onComplete: () => {
            createSection.style.display = 'none';
            listSection.style.display = 'none';
        }
    });

    detailsSection.style.display = 'block';
    gsap.fromTo(detailsSection, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });

    // 🛑 Attach delete functionality to the button
    document.querySelector(".delete-assignments button").onclick = function () {
        deleteAssignment(assignment.id);
    };
}

function deleteAssignment(assignmentId) {
    if (!db) {
        console.error("Database not opened yet.");
        return;
    }

    const transaction = db.transaction("assignments", "readwrite");
    const store = transaction.objectStore("assignments");

    const deleteRequest = store.delete(assignmentId);

    deleteRequest.onsuccess = function () {
        console.log(`✅ Assignment ${assignmentId} deleted successfully`);

        // Remove from local array
        assignments = assignments.filter(a => a.id !== assignmentId);

        // Update UI
        updateAssignmentsList();
        assignmentBack(); // Go back to list after deletion
    };

    deleteRequest.onerror = function (event) {
        console.error("❌ Error deleting assignment:", event.target.error);
    };
}


function assignmentBack() {
    const createSection = document.getElementById('create-assignment');
    const listSection = document.getElementById('assignments-list');
    const detailsSection = document.getElementById('assignment-details');

    gsap.to(detailsSection, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
            detailsSection.style.display = 'none';
            createSection.style.display = 'flex';
            listSection.style.display = 'flex';
            gsap.fromTo([createSection, listSection], { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5 });
        }
    });
}

function clearAssignmentForm() {
    document.getElementById('assignmentTitle').value = '';
    document.getElementById('assignmentDesc').value = '';
    document.getElementById('assignmentFile').value = '';
}

function toggleUploadButton() {
    const title = document.getElementById('assignmentTitle').value;
    const description = document.getElementById('assignmentDesc').value;
    document.getElementById('uploadAssignment').disabled = !(title && description);
}

function AssignmentsFunction() {
    setTimeout(() => {
        if (!db) {
            openDatabase(() => {
                getAssignmentsFromDB();
            });
        } else {
            getAssignmentsFromDB();
        }

        const titleInput = document.getElementById('assignmentTitle');
        const descInput = document.getElementById('assignmentDesc');

        if (titleInput && descInput) {
            titleInput.addEventListener('input', toggleUploadButton);
            descInput.addEventListener('input', toggleUploadButton);
        } else {
            console.warn("Assignment form elements not found.");
        }
    }, 100);
}

// <--------------------Notifications-------------------->

const notificationBtn = document.getElementById("notification-btn");
const popup = document.getElementById("notification-popup");
const closePopup = document.getElementById("close-popup");

gsap.set(popup, { opacity: 0, y: -600 });

notificationBtn.addEventListener("click", () => {
  if (popup.classList.contains("hidden")) {
    popup.classList.remove("hidden");
    gsap.to(popup, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  } else {
    gsap.to(popup, { opacity: 0, y: -600, duration: 0.6, ease: "power2.in", onComplete: () => popup.classList.add("hidden") });
  }
});

closePopup.addEventListener("click", () => {
  gsap.to(popup, { opacity: 0, y: 600, duration: 0.6, ease: "power2.in", onComplete: () => popup.classList.add("hidden") });
});