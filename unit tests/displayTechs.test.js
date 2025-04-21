/**
 * @jest-environment jsdom
 */

/* Rawan's unit test */

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
                showToast(`Request sent to ${technician.name}`);
                contactBtnsContainer.style.display = "none";
            } else {
                showToast("Failed to send request. Please try again.");
            }

            loadCustomerHistory();
            loadTechHistory();
        });

        technicianList.appendChild(techDiv);
    });
}

global.fetch = jest.fn();

describe('displayTechnicians', () => {
    let techniciansMock;
    let technicianList;

    beforeEach(() => {
        // Mock technician data
        techniciansMock = [
            {
                name: "Technician A",
                task: "Plumbing",
                phone: "1234567890",
                experience: "5 years",
                priceRange: "$50 - $100",
                profilePic: "",
            },
        ];

        // Set up DOM elements
        document.body.innerHTML = `
            <div id="technicianList"></div>
        `;
        technicianList = document.getElementById('technicianList');

        // Mock global functions
        global.technicians = techniciansMock;
        global.showToast = jest.fn();
        global.loadCustomerHistory = jest.fn();
        global.loadTechHistory = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the technician cards', () => {
        displayTechnicians();
        const technicianCards = technicianList.querySelectorAll('.technician-card');
        expect(technicianCards.length).toBe(techniciansMock.length);

        const technicianName = technicianCards[0].querySelector('h3').textContent;
        expect(technicianName).toBe(techniciansMock[0].name);
    });

    it('should show contact buttons on card click', () => {
        displayTechnicians();
        const techCard = technicianList.querySelector('.technician-card');
        const contactBtnsContainer = techCard.querySelector('.contact-buttons');

        expect(contactBtnsContainer.style.display).toBe('none');
        techCard.click();
        expect(contactBtnsContainer.style.display).toBe('flex');
    });

    it('should show start button on contact click', () => {
        displayTechnicians();
        const techCard = technicianList.querySelector('.technician-card');
        const contactPhoneBtn = techCard.querySelector('.phone-btn');
        const startBtnContainer = techCard.querySelector('.start-btn-container');

        expect(startBtnContainer.style.display).toBe('none');
        contactPhoneBtn.click();
        expect(startBtnContainer.style.display).toBe('flex');
    });

    it('should send a request to the server on Start Service click', async () => {
        fetch.mockResolvedValueOnce({ ok: true });

        displayTechnicians();
        const techCard = technicianList.querySelector('.technician-card');
        const startBtn = techCard.querySelector('.start-service-btn');

        await startBtn.click();

        expect(fetch).toHaveBeenCalledWith('http://localhost:3000/api/service-requests', expect.any(Object));
        expect(global.showToast).toHaveBeenCalledWith(`Request sent to ${techniciansMock[0].name}`);
        expect(global.loadCustomerHistory).toHaveBeenCalled();
        expect(global.loadTechHistory).toHaveBeenCalled();
    });

    it('should show an error toast if the server request fails', async () => {
        fetch.mockResolvedValueOnce({ ok: false });

        displayTechnicians();
        const techCard = technicianList.querySelector('.technician-card');
        const startBtn = techCard.querySelector('.start-service-btn');

        await startBtn.click();

        expect(global.showToast).toHaveBeenCalledWith("Failed to send request. Please try again.");
    });
});
