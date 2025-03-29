// <--------------------roll-Number-------------------->

const rollNumber = localStorage.getItem("rollNumber");
if (rollNumber) {
    document.getElementById("rollNumber").innerText = rollNumber
} else{
    document.getElementById("rollNumber").innerText = ""
}

// <--------------------Sections-------------------->

function showSection(section) {
    fetch(`sections/student/${section}.html`)
        .then(response => response.text())
        .then(data => {
            document.getElementById("mainbar").innerHTML = data;

            // Wait for DOM update before executing section-specific code
            requestAnimationFrame(() => {

                if (section === "assignments") AssignmentsFunction();
                if (section === "Fees") feesSection();
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

// <--------------------Assignment-------------------->

function AssignmentsFunction() {
    const assignmentItems = document.querySelectorAll(".assignment-item");
    const assignmentView = document.querySelector(".assignment-view");
    const assignmentDetails = document.querySelector(".assignment-details");
    const backButton = document.querySelector(".details-heading button");

assignmentItems.forEach(item => {
    item.addEventListener("click", () => {
        gsap.to(assignmentView, { x: 2000, duration: 0.5, onComplete: () => {
            assignmentView.style.display = "none";
            assignmentDetails.style.display = "flex";
            gsap.fromTo(assignmentDetails, { opacity: 0, x: -500 }, { opacity: 1, x: 0, duration: 0.5 });
        }});
    });
});

backButton.addEventListener("click", () => {
    gsap.to(assignmentDetails, { opacity: 0, duration: 0.5, onComplete: () => {
        assignmentDetails.style.display = "none";
        assignmentView.style.display = "flex";
        gsap.fromTo(assignmentView, { opacity: 0, x: -100 }, { opacity: 1, x: 0, duration: 0.5 });
    }});
});
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

            // Update status based on amount
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

    // Update proceed button
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
        paymentContainer.style.display = "flex"; // Show the payment section
    }

    if (feeHeadRight) {
        feeHeadRight.style.display = "flex"; // Show the fee head
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

    // Set today's date for receipt
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