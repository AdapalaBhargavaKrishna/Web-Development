function showSection(section) {
    fetch(`sections/${section}.html`)
        .then(response => response.text()) // Convert response to text
        .then(data => {
            document.getElementById("mainbar").innerHTML = data; // Insert HTML
        })
        .catch(error => {
            console.error("Error loading section:", error);
            document.getElementById("mainbar").innerHTML = `<h2>Error Loading ${section}</h2>`;
        });
}

function logout() {
    window.location.href = "index.html";
}