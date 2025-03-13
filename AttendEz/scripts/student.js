function showSection(section) {
    fetch(`sections/student/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("mainbar").innerHTML = data;

            // Wait for DOM update before executing section-specific code
            requestAnimationFrame(() => {
                if (section === "Fees") populateFeeTable();
                if (section === "announcements") loadAnnouncements();
                if (section === "assignments") AssignmentsFunction();
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

// Function to show Date-Wise Attendance
function showDateWise() {
    gsap.to(".subject-wise", { opacity: 0, y: -20, duration: 0.3, display: "none" });
    gsap.fromTo(".date-wise", 
        { opacity: 0, y: 50, display: "none" }, 
        { opacity: 1, y: 0, duration: 0.5, display: "flex" }
    );
}

// Function to show Subject-Wise Attendance
function showSubjectWise() {
    gsap.to(".date-wise", { opacity: 0, y: -50, duration: 0.5, display: "none" });
    gsap.fromTo(".subject-wise", 
        { opacity: 0, y: 50, display: "none" }, 
        { opacity: 1, y: 0, duration: 0.5, display: "flex" }
    );
}

gsap.from(".faculty-timetable table", {
    opacity: 0,
    y: 30,
    duration: 1,
    ease: "power2.out"
});
