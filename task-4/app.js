const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;


// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get('/', (req, res) => {
    res.render('index');
});

// Route to handle form submission
app.post('/submit', (req, res) => {
    const { name, email, age, gender, password, confirmPassword } = req.body;

    // Log received data
    console.log(`Received data: 
        Name: ${name},
        Email: ${email},
        Age: ${age},
        Gender: ${gender},
        Password: ${password}
    `);

    // For now, send a response file
    res.render('output');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});




