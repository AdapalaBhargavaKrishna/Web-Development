function showMessage(role) {
    const welcomeText = document.getElementById("welcomeText");
    welcomeText.style.opacity = "0"; // Reset animation
    setTimeout(() => {
        welcomeText.innerText = `Welcome, ${role}!`;
        welcomeText.style.animation = "none"; // Reset animation
        void welcomeText.offsetWidth; // Trick to restart animation
        welcomeText.style.animation = "fadeSlide 0.5s ease-out forwards";
    }, 200);
}

function showLogin(role) {
    const buttons = document.getElementById("buttons");
    const loginForm = document.getElementById("loginForm");
    const right = document.getElementById("right");
    const formTitle = document.getElementById("formTitle");


    buttons.classList.add("vertical");

    formTitle.innerText = `Welcome, ${role}`;
    right.style.display = "flex";
    loginForm.style.display = "block";

}
