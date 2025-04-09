const express = require('express');
const app = express();
const cors = require('cors');

app.use(express.json());
app.use(cors());

const users = {
    1: { id: 1, name: "John Doe", role: "technician", email: "john@example.com", phone: "123-456-7890", extraInfo: "Certified electrician", pic: "default_pfp.png" },
    2: { id: 2, name: "Jane Smith", role: "client", email: "jane@example.com", phone: "987-654-3210", extraInfo: "Regular customer", pic: "default_pfp.png"  }
};

app.get("/profile/:id", (req, res) => {
    const userId = req.params.id;
    const user = users[userId];

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
});

let serviceRequests = [
    { id: '1', customerName: 'John Doe', task: 'Plumbing', techName: 'Sara Elizabeth', status: 'Pending' },
    { id: '2', customerName: 'Jane Smith', task: 'Electrical', techName: 'Johnson', status: 'Pending' }
];

let technicianHistory = [];
let customerHistory = [];

// Endpoint to get all service requests
app.get('/api/service-requests', (req, res) => {
    res.json(serviceRequests.filter(req => req.status === 'Pending'));
});

// Endpoint to accept a service request
app.post('/api/service-requests/:id/accept', (req, res) => {
    const id = req.params.id;
    const request = serviceRequests.find(r => r.id === id);

    if (request) {
        request.status = 'Accepted';
        technicianHistory.push(request);
        customerHistory.push(request);
        res.json({ message: 'Request accepted' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

// Endpoint to reject a service request
app.post('/api/service-requests/:id/reject', (req, res) => {
    const id = req.params.id;
    const request = serviceRequests.find(r => r.id === id);

    if (request) {
        request.status = 'Rejected';
        res.json({ message: 'Request rejected' });
    } else {
        res.status(404).json({ message: 'Request not found' });
    }
});

// Endpoint to get technician history
app.get('/api/technician-history', (req, res) => {
    res.json(technicianHistory);
});

// Endpoint to get customer history
app.get('/api/customer-history', (req, res) => {
    res.json(customerHistory);
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Endpoint to create a new service request
app.post('/api/service-requests', (req, res) => {
  const { id, customerName, task, techName, status } = req.body;

  const newRequest = { id, customerName, task, techName, status };
  serviceRequests.push(newRequest);

  res.status(201).json({ message: 'Request created successfully', request: newRequest });
});
