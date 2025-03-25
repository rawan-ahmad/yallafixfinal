const userId = 1;  // Change this to test different users

fetch(`http://localhost:5501/profile/${userId}`)
    .then(response => response.json())
    .then(user => {
        const profileDiv = document.getElementById("profile");

        if (!user) {
            profileDiv.innerHTML = "<p>User not found</p>";
            return;
        }

        let profileHTML = `
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
        `;

        if (user.role === "technician") {
            profileHTML += `<p><strong>Extra Info:</strong> ${user.extraInfo}</p>`;
        }

        profileDiv.innerHTML = profileHTML;
    })
    .catch(error => console.error("Error fetching user profile:", error));
