const technicians = [
    { name: "Ali Hassan", task: "Plumbing", phone: "123-456-7890" },
    { name: "Sara Ahmed", task: "Electrical", phone: "987-654-3210" },
    { name: "John Smith", task: "Carpentry", phone: "555-123-4567" },
    { name: "Emma Jones", task: "HVAC Repair", phone: "333-789-4561" }
];

function displayTechnicians() {
    const technicianList = document.getElementById("technicianList");

    technicians.forEach(technician => {
        const techDiv = document.createElement("div");
        techDiv.className = "technician";
        techDiv.innerHTML = `
        <strong>${technician.name}</strong> - ${technician.task}
        <div class="phone-number">📞 ${technician.phone}</div>
        <div class="info">Experience: ${technician.experience} - Pricing: ${technician.priceRange} </div>
    `;

        techDiv.addEventListener("click", () => {
            const phoneDiv = techDiv.querySelector(".phone-number");
            const infoDiv = techDiv.querySelector(".info");
            phoneDiv.style.display = phoneDiv.style.display === "block" ? "none" : "block";
            infoDiv.style.display = infoDiv.style.display === "block" ? "none" : "block";
        });


        technicianList.appendChild(techDiv);
    });
}

// Initialize technician list
displayTechnicians();