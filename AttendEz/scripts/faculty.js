const TotStudents = ["71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90",
    "91", "92", "93", "94", "95", "96", "97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
    "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130",
    "131", "132", "133", "134", "135", "136", "137", "308", "309", "310", "311", "312", "313", "314"];

const subjects = ["PQT","DCCST","DBMS","DAA","MAD","DAV","FOC","EEA","ES","DBMS LAB","DAA LAB","Mini Project"];

function showSection(section) {
    fetch(`sections/${section}.html`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById("mainbar").innerHTML = data;

            // Call additional functions for specific sections
            if (section === "Fees") {
                populateFeeTable();
            }
        })
        .catch(error => {
            console.error("Error loading section:", error);
            document.getElementById("mainbar").innerHTML = `<h2>Error Loading ${section}</h2>`;
        });
}


function logout() {
    window.location.href = "index.html";
}

let rollNumbers = [];
let attendance = {};


function selectType(type) {
    const rollNumbersDiv = document.getElementById('rollNumbers');
    const batchSelect = document.getElementById('batch-select');
    rollNumbersDiv.innerHTML = '';

    // Reset attendance data
    attendance = {};
    document.getElementById('absenteesList').innerHTML = ''; // Clear absentees list

    if (type === "class") {
        batchSelect.value = "";
        rollNumbers = TotStudents;
    } else if (type === "batch") {
        const selectedBatch = document.getElementById('batch-select').value;
        if (selectedBatch === "Batch-1") {
            rollNumbers = ["71", "72", "73", "74", "75", "76", "77", "78", "79", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96"];
        } else if (selectedBatch === "Batch-2") {
            rollNumbers = ["97", "98", "99", "100", "101", "102", "103", "104", "105", "106", "107", "108", "109", "110", "111", "112", "113", "114", "115", "116", "117", "118", "119", "120", "121"];
        } else if (selectedBatch === "Batch-3") {
            rollNumbers = ["121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "308", "309", "310", "311", "312", "313", "314"];
        }
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
function finalizeAttendance() {
    rollNumbers.forEach(roll => {
        if (!(roll in attendance)) {
            attendance[roll] = 'absent'; // Mark as absent if not explicitly selected
        }
    });
    const absentees = Object.keys(attendance).filter(roll => attendance[roll] === 'absent');
    const absenteesListDiv = document.getElementById('absenteesList');
    absenteesListDiv.innerHTML = `<h3>Absentees: ${absentees.join(', ')}</h3>`;
    rollNumbers.forEach(updateRollNumberDisplay);
    document.getElementById("clear-button").style.display = "block";
}

function clearAttendance() {
    attendance = {};
    document.getElementById('absenteesList').innerHTML = '';
    document.getElementById('rollNumbers').innerHTML = '';
    document.getElementById("clear-button").style.display = "none";
}

function addRow() {
    let tbody = document.getElementById("timetable-body");
    let row = document.createElement("tr");
    
    let dayCell = document.createElement("td");
    dayCell.innerHTML = `<input type='text' placeholder='Day'>`;
    row.appendChild(dayCell);
    
    for (let i = 0; i < 6; i++) {
        let cell = document.createElement("td");
        cell.innerHTML = `<input type='text' placeholder='Subject, Room No'>`;
        row.appendChild(cell);
    }
    
    tbody.appendChild(row);
}

function clearTable() {
    document.getElementById("timetable-body").innerHTML = "";
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

tl.from(".mainbar h2, .mainbar p", {
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


function populateFeeTable() {
    let feeTable = document.getElementById("feeTable");
    feeTable.innerHTML = ""; // Clear previous entries

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

const subjectSelect = document.getElementById("subject-select");

subjects.forEach(subject => {
    let option = document.createElement("option");
    option.value = subject.toLowerCase(); // Set value in lowercase
    option.textContent = subject; // Display name
    subjectSelect.appendChild(option);
});

const overallMarksBtn = document.querySelector(".marks-buttons button");
const displayMarks = document.querySelector(".display-marks");
const searchRollNosDiv = document.querySelector(".search-rollnos");

overallMarksBtn.addEventListener("click", function () {
    searchRollNosDiv.style.display = "flex";  // Show search section
    displayOverallMarks();
});

subjectSelect.addEventListener("change", function () {
    if (subjectSelect.value !== "") {
        searchRollNosDiv.style.display = "flex";  // Show search section
    }
});