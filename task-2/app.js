const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended:true}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Set EJS as the template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.post('/submit', (req, res) => {
    console.log(req.body);
    res.render('output');
    
});

app.listen(port, () => {
    console.log('Server is running on http://localhost:'+port);
});