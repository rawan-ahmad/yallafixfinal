const technicians = [
    {
        name: "Ali Hassan",
        task: "Plumbing",
        phone: "123-456-7890",
        experience: "Beginner",
        priceRange: "$",
        profilePic: "default_pfp.png"
    },
    {
        name: "Sara Ahmed",
        task: "Electrical",
        phone: "987-654-3210",
        experience: "Expert",
        priceRange: "$$$$",
        profilePic: "default_pfp.png"
    },
    {
        name: "John Smith",
        task: "Carpentry",
        phone: "555-123-4567",
        experience: "Intermediate",
        priceRange: "$$$",
        profilePic: "default_pfp.png"
    },
    {
        name: "Emma Jones",
        task: "HVAC Repair",
        phone: "333-789-4561",
        experience: "Beginner",
        priceRange: "$$",
        profilePic: "default_pfp.png"
    }
];

function displayTechnicians() {
    const technicianList = document.getElementById("technicianList");
    technicianList.innerHTML = "";

    technicians.forEach(technician => {
        const techDiv = document.createElement("div");
        techDiv.className = "technician-card";
        techDiv.innerHTML = `
            <img src="${technician.profilePic}" alt="${technician.name}" class="technician-img" />
            <div class="technician-info">
                <h3>${technician.name}</h3>
                <p><strong>${technician.task}</strong></p>
                <p><strong>Phone:</strong> ${technician.phone}</p>
                <p><strong>Experience:</strong> ${technician.experience}</p>
                <p><strong>Price:</strong> ${technician.priceRange}</p>
            </div>
        `;

        technicianList.appendChild(techDiv);
    });
}

displayTechnicians();

function displayTechnicians() {
    const technicianList = document.getElementById("technicianList");
    technicianList.innerHTML = "";

    technicians.forEach(technician => {
        const techDiv = document.createElement("div");
        techDiv.className = "technician-card";
        techDiv.innerHTML = `
            <div class="card-content">
                <img src="${technician.profilePic || 'https://via.placeholder.com/120'}" alt="${technician.name}" class="technician-img" />
                <div class="technician-info">
                    <h3>${technician.name}</h3>
                    <p><strong>${technician.task}</strong></p>
                    <p><strong>Phone:</strong> ${technician.phone}</p>
                    <p><strong>Experience:</strong> ${technician.experience}</p>
                    <p><strong>Price:</strong> ${technician.priceRange}</p>
                </div>
            </div>
            <a href="tel:${technician.phone}" class="contact-btn">Contact by Phone</a>
            <button class="start-service-btn">Start Service</button>
        `;

        const contactBtn = techDiv.querySelector(".contact-btn");
        const startBtn = techDiv.querySelector(".start-service-btn");

        techDiv.addEventListener("click", () => {
            techDiv.classList.toggle("active");
        });

        contactBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            contactBtn.style.display = "none";
            startBtn.style.display = "block";
        });

        startBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            window.location.href = "service-loading.html"; // Adjust path as needed
        });

        technicianList.appendChild(techDiv);
    });
}


