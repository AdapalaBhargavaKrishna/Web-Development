// <--------------------roll-Number-------------------->
const urlParams = new URLSearchParams(window.location.search);
const rollNumber = urlParams.get("rollNumber");
if (rollNumber) {
    document.getElementById("rollNumber").innerText = rollNumber
} else {
    document.getElementById("rollNumber").innerText = ""
}

let sectionName
// <--------------------SectionName-------------------->

document.addEventListener("DOMContentLoaded", () => {
    const getSection = roll => {
        const num = parseInt(roll.slice(-3), 10);
        return (num >= 1 && num <= 70) || (num >= 301 && num <= 307) ? "it1" :
               (num >= 71 && num <= 137) || (num >= 308 && num <= 314) ? "it2" :
               (num >= 138 && num <= 210) || (num >= 315 && num <= 320) ? "it3" : "it2";
    };

    console.log(getSection(rollNumber));
    sectionName = getSection(rollNumber);
});


// <--------------------Time Table-------------------->

const timetables = {
    it1: [
        ["Monday", "DBMS", "DAA", "PE - 1", "Lunch", "DCCST", "DBMS", "LAB"],
        ["Tuesday", "DBMS", "Environmental Science", "Mini Project 1", "ALGO Lab", "Mentoring", "PE - 1"],
        ["Wednesday", "DBMS Lab", "DBMS", "PQT", "DCCST", "PE - 1", "Engineering Economics"],
        ["Thursday", "PQT", "DAA", "Environmental Science", "DCCST", "DBMS", "LAB"],
        ["Friday", "DBMS", "PE - 1", "DBMS Lab", "Engineering Economics", "ALGO Lab", "Mini Project 1"]
    ],
    it2: [
        ["Monday", "PQT", "DAA", "PE-1", "Lunch", "DCCST", "DBMS LAB", "DBMS LAB"],
        ["Tuesday", "MP LAB", "MP LAB", "PQT","ES", "EEA", "SPORTS"],
        ["Wednesday", "DBMS", "DAA", "PQT", "PE - 1", "ES", "DCCST"],
        ["Thursday", "PE - 1", "EEA", "DCCST", "DBMS", "MENTORING", "PQT"],
        ["Friday", "EEA", "DAA", "ALGO LAB", "ALGO LAB ", "DBMS", "LIBRARY"]
    ],
    it3: [
        ["Monday", "DAA", "DBMS", "PE - 1", "Lunch", "PQT", "DCCST", "LAB"],
        ["Tuesday", "Mini Project 1", "Environmental Science", "DBMS", "Mentoring", "ALGO Lab", "PQT"],
        ["Wednesday", "DBMS", "DBMS Lab", "DAA", "PQT", "Engineering Economics", "PE - 1"],
        ["Thursday", "DCCST", "PE - 1", "Environmental Science", "DBMS", "DAA", "LAB"],
        ["Friday", "Engineering Economics", "ALGO Lab", "Mini Project 1", "DBMS Lab", "DBMS", "PQT"]
    ]
};

// <--------------------Sections-------------------->

function showSection(section) {
    fetch(`sections/student/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("mainbar").innerHTML = data;

            // Wait for DOM update before executing section-specific code
            requestAnimationFrame(() => {

                if (section === "timetable") updateTimetable(sectionName);
                if (section === "Fees") feesSection();
                if (section === "announcements") loadAnnouncements();
                if (section === "assignments") {
                    openDatabase(function () {
                        AssignmentsFunction();
                    });
                }
            });
        })
        .catch(error => {
            console.error("Error loading section:", error);
            document.getElementById("mainbar").innerHTML = `<h2>Error Loading ${section}</h2>`;
        });
}

function logout() {
    window.location.href = "index.html";
}

// <--------------------GSAP-------------------->

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

// <--------------------Attendance-------------------->

document.addEventListener("DOMContentLoaded", () => {
    const attendanceButton = document.getElementById("attendanceBtn");

    if (attendanceButton) {
        attendanceButton.addEventListener("click", async () => {
            setTimeout(async () => {
                await updateAttendanceTable(rollNumber);

            }, 100);
        });
    } else {
        console.error("Attendance button not found!");
    }
});

async function fetchAttendance(rollNumber) {
    try {
        const response = await fetch(`http://localhost:3000/get-attendance?rollNumber=${rollNumber}`);
        const data = await response.json();

        console.log(data)

        populateDateDropdown(data);

        return data;
    } catch (error) {
        console.error("Error fetching attendance data:", error);
        return [];
    }
}

function populateDateDropdown(attendanceData) {
    const dateDropdown = document.getElementById("dateDropdown");

    if (!dateDropdown) {
        console.error("Date dropdown not found!");
        return;
    }

    const uniqueDates = [...new Set(attendanceData.map(record => record.date))];

    dateDropdown.innerHTML = '<option value="">---Select date---</option>';

    uniqueDates.forEach(date => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = date;
        dateDropdown.appendChild(option);
    });

    dateDropdown.addEventListener("change", () => {
        const selectedDate = dateDropdown.value;
        displayAttendanceByDate(selectedDate, attendanceData);
    });
}

function displayAttendanceByDate(selectedDate, attendanceData) {
    const table = document.querySelector(".date-attendance table");

    if (!table) {
        console.error("Attendance table not found!");
        return;
    }

    table.innerHTML = `
        <tr>
          <th>Date</th>
          <th>Subject</th>
          <th>Status</th>
        </tr>
    `;

    const filteredData = attendanceData.filter(record => record.date === selectedDate);

    filteredData.forEach(record => {
        record.students.forEach(student => {
            if (student.rollNumber === rollNumber) {
                const row = document.createElement("tr");
                const statusClass = student.status.toLowerCase() === "present" ? "present" : "absent";
                const statusText = student.status.charAt(0).toUpperCase() + student.status.slice(1).toLowerCase();
                row.innerHTML = `
                    <td>${record.date}</td>
                    <td>${record.subject}</td>
                    <td class="${statusClass}">${statusText}</td>
                `;
                table.appendChild(row);
            }
        });
    });
}

function processAttendance(attendanceData) {
    let attendanceSummary = {};

    attendanceData.forEach(record => {
        const subject = record.subject;

        if (!attendanceSummary[subject]) {
            attendanceSummary[subject] = { held: 0, attended: 0 };
        }

        attendanceSummary[subject].held += 1;

        const student = record.students.find(s => s.rollNumber === rollNumber);

        if (student && student.status.toLowerCase() === "present") {
            attendanceSummary[subject].attended += 1;
        }
    });

    return attendanceSummary;
}

async function updateAttendanceTable(rollNumber) {
    const tableBody = document.querySelector(".subject-attendance-table tbody");

    if (!tableBody) {
        console.error("Error: Attendance table body not found! Ensure the section is visible before updating.");
        return;
    }

    try {
        const attendanceData = await fetchAttendance(rollNumber);
        const attendanceSummary = processAttendance(attendanceData);

        let totalClassesHeld = 0;
        let totalClassesAttended = 0;

        for (let i = 0; i < tableBody.rows.length; i++) {
            let subjectCell = tableBody.rows[i].cells[1];
            let heldCell = tableBody.rows[i].cells[2];
            let attendedCell = tableBody.rows[i].cells[3];
            let percentageCell = tableBody.rows[i].cells[4];

            let subject = subjectCell.textContent.trim();
            if (attendanceSummary[subject]) {
                let held = attendanceSummary[subject].held;
                let attended = attendanceSummary[subject].attended;
                let percentage = ((attended / held) * 100).toFixed(2);

                heldCell.textContent = held;
                attendedCell.textContent = attended;
                percentageCell.textContent = `${percentage}%`;

                totalClassesHeld += held;
                totalClassesAttended += attended;
            }
        }

        TotalAttendance = totalClassesHeld > 0 ? `${((totalClassesAttended / totalClassesHeld) * 100).toFixed(2)}` : "0";

        let totalRow = tableBody.rows[tableBody.rows.length - 1];
        totalRow.cells[2].textContent = totalClassesHeld;
        totalRow.cells[3].textContent = totalClassesAttended;
        totalRow.cells[4].textContent = TotalAttendance

        document.querySelector(".att-percentage").textContent = TotalAttendance + "%"
        console.log(TotalAttendance)

        let message = "";
        let messageColor = "green";

        if (TotalAttendance >= 90) {
            message = "Excellent attendance! Keep it up.";
        } else if (TotalAttendance >= 75) {
            message = "Good attendance. Maintain consistency.";
        } else if (TotalAttendance >= 60) {
            message = "Your attendance is low. Try to attend more classes.";
            messageColor = "red";
        } else if (TotalAttendance >= 45) {
            message = "Warning: Your attendance is below the required level.";
            messageColor = "red";
        } else {
            message = "Critical alert: Immediate improvement needed.";
            messageColor = "red";
        }

        const messageElement = document.querySelector(".att-message");
        messageElement.textContent = message;
        messageElement.style.color = messageColor;

    } catch (error) {
        console.error("Error updating attendance table:", error);
    }
}

function showDateWise() {
    gsap.to(".subject-wise", { opacity: 0, y: -20, duration: 0.3, display: "none" });
    gsap.fromTo(".date-wise",
        { opacity: 0, y: 50, display: "none" },
        { opacity: 1, y: 0, duration: 0.5, display: "flex" }
    );
}

function showOverall() {
    gsap.to(".date-wise", { opacity: 0, y: -50, duration: 0.5, display: "none" });
    gsap.fromTo(".subject-wise",
        { opacity: 0, y: 50, display: "none" },
        { opacity: 1, y: 0, duration: 0.5, display: "flex" }
    );
}

// <--------------------Time Table-------------------->

function updateTimetable(section) {
    if (section) {

        const timetableBody = document.getElementById("timetableBody");
        timetableBody.innerHTML = "";
        timetables[section].forEach((row) => {
            let tr = "<tr>";
            tr += `<th>${row[0]}</th>`;
            console.log(timetableBody.innerHTML)
            row.slice(1).forEach(subject => {
                if (subject === "Lunch") {
                    
                    tr += '<td rowspan="5" class="lunch-break">Lunch Break</td>';
                } else {
                    tr += `<td>${subject}</td>`;
                }
            });
            tr += "</tr>";
            timetableBody.innerHTML += tr;
        });
    }
}

// <--------------------Assignment-------------------->

let db;

function openDatabase(callback) {
    const request = indexedDB.open("AttendZ_DB", 1);

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains("assignments")) {
            const assignmentStore = db.createObjectStore("assignments", { keyPath: "id" });
            assignmentStore.createIndex("title", "title", { unique: false });
        }
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        console.log("IndexedDB opened successfully.");
        if (callback) callback();
    };

    request.onerror = function (event) {
        console.error("IndexedDB error:", event.target.errorCode);
    };
}

function AssignmentsFunction() {
    const assignmentItems = document.querySelectorAll(".assignment-item");
    const assignmentView = document.querySelector(".assignment-view");
    const assignmentDetails = document.querySelector(".assignment-details");
    const backButton = document.querySelector(".details-heading button");

    assignmentItems.forEach(item => {
        item.addEventListener("click", () => {
            gsap.to(assignmentView, {
                x: 2000,
                duration: 0.5,
                onComplete: () => {
                    assignmentView.style.display = "none";
                    assignmentDetails.style.display = "flex";
                    gsap.fromTo(assignmentDetails, { opacity: 0, x: -500 }, { opacity: 1, x: 0, duration: 0.5 });
                }
            });
        });
    });

    backButton.addEventListener("click", () => {
        gsap.to(assignmentDetails, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                assignmentDetails.style.display = "none";
                assignmentView.style.display = "flex";
                gsap.fromTo(assignmentView, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.5 });
            }
        });
    });

    console.log("called")
    getAssignmentsBySection(sectionName, displayAssignments);
}

function getAssignmentsBySection(sectionName, callback) {
    const transaction = db.transaction(['assignments'], 'readonly');
    const store = transaction.objectStore('assignments');
    const request = store.openCursor();

    const assignments = [];

    request.onsuccess = function (event) {
        const cursor = event.target.result;
        console.log("YUP")
        if (cursor) {
            const assignment = cursor.value;

            if (assignment.sectionName === sectionName) {
                assignments.push(assignment);
            }
            cursor.continue();
        } else {
            console.log(assignments)
            console.log("Finished")
            callback(assignments);
        }
    };

    request.onerror = function (event) {
        console.error('Error fetching assignments:', event.target.error);
    };
}

function displayAssignments(assignments) {
    const assignmentContainer = document.querySelector('.assignment-items');
    assignmentContainer.innerHTML = '';

    assignments.forEach(assignment => {
        const assignmentItem = document.createElement('li');
        assignmentItem.classList.add('assignment-item');
        assignmentItem.textContent = assignment.title;

        assignmentItem.setAttribute('data-assignment-title', assignment.title);

        assignmentItem.addEventListener('click', () => {
            document.querySelectorAll('.assignment-item').forEach(item => item.classList.remove('clicked'));
            console.log("Removed")
            assignmentItem.classList.add('clicked');

            showAssignmentDetails(assignment);
        });
        assignmentContainer.appendChild(assignmentItem);
    });
}

function showAssignmentDetails(assignment) {
    const assignmentDetails = document.querySelector('.assignment-details');
    const assignmentView = document.querySelector('.assignment-view');
    const assignmentInfoContainer = document.getElementById('assignment-info');
    const fileInput = document.getElementById('assignmentFile');
    const fileNameDisplay = document.getElementById('file-name');
    fileInput.value = '';
    fileNameDisplay.textContent = 'No file chosen';

    assignmentInfoContainer.innerHTML = `
        <div><h3>Title:</h3><p>${assignment.title}</p></div>
        <div><h3>Description:</h3><p>${assignment.description}</p></div>
        <div><h3>File:</h3><button class="view-file" onclick="viewAssignmentFile('${assignment.file}')">View File</button></div>
    `;

    gsap.to(assignmentView, {
        opacity: 0, duration: 0.5, onComplete: () => {
            assignmentView.style.display = 'none';
            assignmentDetails.style.display = 'flex';
            gsap.fromTo(assignmentDetails, { opacity: 0, x: -500 }, { opacity: 1, x: 0, duration: 0.5 });
        }
    });
}

function viewAssignmentFile(fileData) {
    const link = document.createElement('a');
    link.href = fileData;
    link.download = 'assignment.pdf';
    link.click();
}

function submitAssignment() {
    const fileInput = document.getElementById('assignmentFile');
    const fileNameDisplay = document.getElementById('file-name');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please choose a file to submit.');
        return;
    }

    console.log(file.name);
    fileNameDisplay.textContent = file.name;

    const section = getStudentSection();
    const assignmentItem = document.querySelector('.assignment-item.clicked'); 
    const assignmentName = assignmentItem ? assignmentItem.getAttribute('data-assignment-title') : 'Unknown Assignment';
    const assignmentId = Date.now();

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const fileData = event.target.result;

        const assignmentData = {
            id: assignmentId,
            rollNumber: rollNumber,
            section: section,
            assignmentName: assignmentName,
            fileName: file.name,
            file: fileData,
        };

        saveAssignmentData(assignmentData);
    };

    reader.readAsDataURL(file);
}

function saveAssignmentData(data) {
    const request = indexedDB.open('studentAssignmentsDB', 1);

    request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('assignments')) {
            db.createObjectStore('assignments', { keyPath: 'id' });
        }
    };

    request.onsuccess = (event) => {
        const db = event.target.result;

        const transaction = db.transaction(['assignments'], 'readwrite');
        const store = transaction.objectStore('assignments');

        store.add(data);

        transaction.oncomplete = () => {
            alert('Assignment submitted successfully!');
            console.log('Assignment saved:', data);
        };

        transaction.onerror = (error) => {
            console.error('Error saving assignment:', error);
        };
    };

    request.onerror = (error) => {
        console.error('Error opening IndexedDB:', error);
    };
}

function getStudentSection() {
    return sectionName || "it2";
}

// <--------------------Assignment-------------------->

function loadAnnouncements() {
    fetch("http://localhost:3000/get-announcements")
        .then(response => response.json())
        .then(data => {
            let announcementList = document.querySelector(".announcement-list");

            // Clear previous announcements
            announcementList.innerHTML = ""; 

            // Filter announcements based on sectionName
            let filteredAnnouncements = data.filter(announcement => 
                announcement.section.toUpperCase() === sectionName.toUpperCase()
            );

            if (filteredAnnouncements.length === 0) {
                announcementList.innerHTML = "<p>No announcements for your section.</p>";
                return;
            }

            filteredAnnouncements.forEach(announcement => {
                let announcementDiv = document.createElement("div");
                announcementDiv.classList.add("announce-card");

                announcementDiv.innerHTML = `
                    <h3>${announcement.subject}</h3>
                    <p>${announcement.message}</p>
                    <small>${new Date(announcement.date).toLocaleString()} | Section: <strong>${announcement.section.toUpperCase()}</strong></small>
                `;

                announcementList.appendChild(announcementDiv);
            });
        })
        .catch(error => console.error("Error loading announcements:", error));
}

// <--------------------Fees-------------------->

const feeAmounts = {
    college: 165000,
    transport: 45000,
    hostel: 115000
};

function showFees(fee) {
    const fees = {
        college: document.getElementById("college-fee"),
        transport: document.getElementById("transport-fee"),
        hostel: document.getElementById("hostel-fee"),
    };

    Object.values(fees).forEach(feeElement => {
        feeElement.style.display = "none";
        document.querySelector(".proceed-payment").style.background = "#818181";
    });

    if (!fee) {
        Object.values(fees).forEach(feeElement => {
            feeElement.style.display = "table-row";
        });
        updatePaymentDetails();
        return;
    }

    if (fees[fee]) {
        fees[fee].style.display = "table-row";
        updatePaymentDetails();
    }
}

function updatePaymentDetails() {
    let totalFee = 0;
    let amountToPay = 0;

    Object.keys(feeAmounts).forEach(fee => {
        const feeRow = document.getElementById(`${fee}-fee`);
        if (feeRow && feeRow.style.display === "table-row") {
            totalFee += feeAmounts[fee];

            const feeAmount = parseInt(feeRow.getElementsByTagName("td")[1].textContent.replace(/,/g, ""), 10);
            amountToPay += feeAmount;

            const feeStatusElement = feeRow.querySelector(".status");

            if (feeAmount > 0) {
                feeStatusElement.innerText = "Unpaid";
                feeStatusElement.classList.remove("paid");
                feeStatusElement.classList.add("unpaid");
            } else {
                feeStatusElement.innerText = "Paid";
                feeStatusElement.classList.remove("unpaid");
                feeStatusElement.classList.add("paid");
            }
        }
    });

    document.querySelector(".total-fee").innerText = `Total Fee: ₹${totalFee.toLocaleString()}`;
    document.querySelector(".to-pay").innerText = `Amount to Pay: ₹${amountToPay.toLocaleString()}`;
    document.querySelector(".total-amount strong").innerText = `₹${amountToPay.toLocaleString()}`;

    const proceedButton = document.querySelector(".proceed-payment");
    const payButton = document.querySelector(".pay-btn");
    if (amountToPay > 0) {
        proceedButton.style.background = "#ff4d4d";
        payButton.style.background = "#FF6F61";
        proceedButton.style.cursor = "pointer";
        proceedButton.disabled = false;

    } else {
        proceedButton.style.background = "#818181";
        payButton.style.background = "#818181";
        proceedButton.style.cursor = "not-allowed";
        payButton.style.cursor = "not-allowed";
        proceedButton.disabled = true;
    }
}


function showPayments() {
    const paymentContainer = document.querySelector(".fee-details-right");
    const feeHeadRight = document.querySelector(".fee-head-right");

    if (paymentContainer) {
        paymentContainer.style.display = "flex";
    }

    if (feeHeadRight) {
        feeHeadRight.style.display = "flex";
    }

    const feeDetailsLeft = document.querySelector(".fee-details-left");
    feeDetailsLeft.style.height = "25vh";
}

function showPaymodes() {
    const paymentType = document.getElementById("pay-options").value;
    const upiSection = document.getElementById("upi");
    const creditCardSection = document.getElementById("credit-card");

    upiSection.style.display = "none";
    creditCardSection.style.display = "none";

    if (paymentType === "upi") {
        upiSection.style.display = "flex";
        gsap.fromTo(upiSection,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 }
        );
    } else if (paymentType === "credit-card") {
        creditCardSection.style.display = "flex";
        gsap.fromTo(creditCardSection,
            { y: -20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 }
        );
    }
}

function feesSection() {

    console.log("Fees section loaded!");
    document.getElementById("fee-select").addEventListener("change", function () {
        showFees(this.value);
    });

    document.getElementById("pay-options").addEventListener("change", function () {
        showPaymodes();
    });

    const today = new Date().toISOString().split("T")[0];
    document.getElementById("receipt-date").value = today;
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainbar = document.querySelector('.mainbar');

    sidebar.classList.toggle('active');
    mainbar.classList.toggle('hidden');
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