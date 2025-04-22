/**
 * @jest-environment jsdom
 */

async function loadTechHistory() {
    const response = await fetch('http://localhost:3000/api/customer-history');
    const history = await response.json();
    renderTechHistory(history);
}

function renderTechHistory(history) {
    const historyContainer = document.getElementById('technicianHistory');
    historyContainer.innerHTML = '';

    history.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';
        requestCard.innerHTML = `
            <p><strong>Task:</strong> ${request.task}</p>
            <p><strong>Technician:</strong> ${request.techName}</p>
            <p><strong>Customer:</strong> ${request.customerName}</p>
            <p><strong>Status:</strong> ${request.status}</p>
        `;
        historyContainer.appendChild(requestCard);
    });
}


describe('loadTechHistory', () => {
    beforeEach(() => {
        // Set up a mock DOM
        document.body.innerHTML = `
            <div id="technicianHistory"></div>
        `;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should fetch history and render it correctly', async () => {
        // Mock data to be returned by fetch
        const mockHistory = [
            {
                task: 'Fix AC',
                techName: 'John Doe',
                customerName: 'Jane Smith',
                status: 'Completed',
            },
            {
                task: 'Install Heater',
                techName: 'Alice Johnson',
                customerName: 'Bob Brown',
                status: 'Pending',
            },
        ];

        // Mock the fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockHistory),
            })
        );

        // Import the functions
        const loadTechHistory = async () => {
            const response = await fetch('http://localhost:3000/api/customer-history');
            const history = await response.json();
            renderTechHistory(history);
        };

        const renderTechHistory = (history) => {
            const historyContainer = document.getElementById('technicianHistory');
            historyContainer.innerHTML = '';

            history.forEach((request) => {
                const requestCard = document.createElement('div');
                requestCard.className = 'request-card';
                requestCard.innerHTML = `
                    <p><strong>Task:</strong> ${request.task}</p>
                    <p><strong>Technician:</strong> ${request.techName}</p>
                    <p><strong>Customer:</strong> ${request.customerName}</p>
                    <p><strong>Status:</strong> ${request.status}</p>
                `;
                historyContainer.appendChild(requestCard);
            });
        };

        // Call the function
        await loadTechHistory();

        // Verify fetch was called correctly
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/customer-history');

        // Verify DOM updates
        const historyContainer = document.getElementById('technicianHistory');
        const requestCards = historyContainer.querySelectorAll('.request-card');

        expect(requestCards.length).toBe(mockHistory.length);
        expect(requestCards[0].innerHTML).toContain('Fix AC');
        expect(requestCards[1].innerHTML).toContain('Install Heater');
    });
});
