// Function to fetch and display service requests
async function loadServiceRequests() {
    const response = await fetch('http://localhost:3000/api/service-requests');
    const requests = await response.json();
    renderServiceRequests(requests);
}

// Function to render requests
function renderServiceRequests(requests) {
    const requestList = document.getElementById('requests');
    requestList.innerHTML = '';

    requests.forEach(request => {
        const requestCard = document.createElement('div');
        requestCard.className = 'request-card';
        requestCard.innerHTML = `
            <p><strong>Customer:</strong> ${request.customerName}</p>
            <p><strong>Task:</strong> ${request.task}</p>
            <p><strong>Technician:</strong> ${request.techName}</p>
            <button onclick="acceptRequest('${request.id}')">Accept</button>
            <button onclick="rejectRequest('${request.id}')">Reject</button>
        `;
        requestList.appendChild(requestCard);
    });
}

// Function to accept a request
async function acceptRequest(id) {
    await fetch(`http://localhost:3000/api/service-requests/${id}/accept`, { method: 'POST' });
    loadServiceRequests();
}

// Function to reject a request
async function rejectRequest(id) {
    await fetch(`http://localhost:3000/api/service-requests/${id}/reject`, { method: 'POST' });
    loadServiceRequests();
}

// Load requests on page load
loadServiceRequests();
