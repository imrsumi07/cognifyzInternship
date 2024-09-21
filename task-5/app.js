const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

// In-memory storage for demonstration
let users = []; // You might use a database in a real application

// Middleware
app.use(bodyParser.json()); // For parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve the main page
app.get('/', (req, res) => {
    res.render('index');
});

// API Endpoints

// Create - POST
app.post('/api/users', (req, res) => {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
        return res.status(400).send('All fields are required');
    }
    const newUser = {
        id: users.length + 1,
        name,
        email,
        phone,
        password
    };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Read - GET all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Read - GET single user by ID
app.get('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    res.json(user);
});

// Update - PUT
app.put('/api/users/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) return res.status(404).send('User not found');
    const { name, email, phone, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (password) user.password = password;
    res.json(user);
});

// Delete - DELETE
app.delete('/api/users/:id', (req, res) => {
    users = users.filter(u => u.id !== parseInt(req.params.id));
    res.status(204).send();
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
