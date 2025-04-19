const technicians = [
    {
        name: "Ali Hassan",
        task: "Plumbing",
        phone: "123-456-7890",
        experience: "Beginner",
        priceRange: "$",
        profilePic: "images/default_pfp.png"
    },
    {
        name: "Sara Ahmed",
        task: "Electrical",
        phone: "987-654-3210",
        experience: "Expert",
        priceRange: "$$$$",
        profilePic: "images/default_pfp.png"
    },
    {
        name: "John Smith",
        task: "Carpentry",
        phone: "555-123-4567",
        experience: "Intermediate",
        priceRange: "$$$",
        profilePic: "images/default_pfp.png"
    },
    {
        name: "Emma Jones",
        task: "HVAC Repair",
        phone: "333-789-4561",
        experience: "Beginner",
        priceRange: "$$",
        profilePic: "images/default_pfp.png"
    }
];


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
            <div class="contact-buttons" style="display: none;">
                <a href="tel:${technician.phone}" class="contact-btn phone-btn">Contact by Phone</a>
                <a href="sms:${technician.phone}" class="contact-btn sms-btn">Contact by SMS</a>
            </div>
            <div class="start-btn-container" style="display: none;">
                <button class="start-service-btn">Start Service</button>
            </div>
        `;

        const contactBtnsContainer = techDiv.querySelector(".contact-buttons");
        const contactPhoneBtn = techDiv.querySelector(".phone-btn");
        const contactSmsBtn = techDiv.querySelector(".sms-btn");
        const startBtnContainer = techDiv.querySelector(".start-btn-container");
        const startBtn = techDiv.querySelector(".start-service-btn");

        techDiv.addEventListener("click", () => {
            contactBtnsContainer.style.display = "flex";
        });

        [contactPhoneBtn, contactSmsBtn].forEach(btn => {
            btn.addEventListener("click", (e) => {
                e.stopPropagation();
                contactBtnsContainer.style.display = "none";
                startBtnContainer.style.display = "flex";
            });
        });


        // Handle request submission
        startBtn.addEventListener("click", async (e) => {
            e.stopPropagation();
            const customerName = "John Doe"; // Replace with dynamic customer name if available
            const task = technician.task;
            const techName = technician.name;

            const newRequest = {
                id: Date.now().toString(),
                customerName,
                task,
                techName,
                status: "Pending",
            };

            // Send the request to the server
            const response = await fetch('http://localhost:3000/api/service-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRequest),
            });

            if (response.ok) {
                alert(`Request sent to ${technician.name}`);
                contactBtnsContainer.style.display = "none";
            } else {
                alert("Failed to send request. Please try again.");
            }

            loadCustomerHistory();
            loadTechHistory();
        });


        //startBtn.addEventListener("click", (e) => {
        //   e.stopPropagation();
        //  window.location.href = "service-loading.html";
        //  });


        technicianList.appendChild(techDiv);
    });
}
