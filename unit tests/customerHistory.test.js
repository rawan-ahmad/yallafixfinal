 /**
 * @jest-environment jsdom
 */

async function loadCustomerHistory() {
    const response = await fetch('http://localhost:3000/api/customer-history');
    const history = await response.json();
    renderCustomerHistory(history);
}

// Function to render the customer's request history
function renderCustomerHistory(history) {
    const historyContainer = document.getElementById('customerHistory');
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


describe('loadCustomerHistory and renderCustomerHistory', () => {
    beforeEach(() => {
        // Set up a mock DOM
        document.body.innerHTML = `
            <div id="customerHistory"></div>
        `;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('should fetch customer history and render it correctly', async () => {
        // Mock data returned by the API
        const mockHistory = [
            {
                task: 'Repair Refrigerator',
                techName: 'Alice Doe',
                customerName: 'Charlie Brown',
                status: 'In Progress',
            },
            {
                task: 'Install Solar Panels',
                techName: 'Bob Smith',
                customerName: 'David Johnson',
                status: 'Completed',
            },
        ];

        // Mock the fetch API
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve(mockHistory),
            })
        );

        // Functions to test
        const loadCustomerHistory = async () => {
            const response = await fetch('http://localhost:3000/api/customer-history');
            const history = await response.json();
            renderCustomerHistory(history);
        };

        const renderCustomerHistory = (history) => {
            const historyContainer = document.getElementById('customerHistory');
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

        // Execute the function
        await loadCustomerHistory();

        // Assertions
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:3000/api/customer-history'); // Check fetch call
        const historyContainer = document.getElementById('customerHistory');
        const requestCards = historyContainer.querySelectorAll('.request-card');

        expect(requestCards.length).toBe(mockHistory.length); // Check the number of cards rendered
        expect(requestCards[0].innerHTML).toContain('Repair Refrigerator'); // Check content of first card
        expect(requestCards[1].innerHTML).toContain('Install Solar Panels'); // Check content of second card
    });
});
