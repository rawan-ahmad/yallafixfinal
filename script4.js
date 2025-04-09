const userId = 1;  // Change this to test different users

fetch(`http://localhost:3000/profile/${userId}`)
    .then(response => response.json())
    .then(user => {
        const profileDiv = document.getElementById("profile");

        if (!user) {
            profileDiv.innerHTML = "<p>User not found</p>";
            return;
        }
        const profilePicUrl = user.pic || "default_pfp.png";
        let profileHTML = `
           <div>
                <img src="${profilePicUrl}" alt="Profile Picture" class="profile-pic">
            </div>
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
