const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const { find } = require('./placementlist.js'); // ✅ All files are in the root

// View engine setup
app.set('view engine', 'ejs');
app.set('views', __dirname); // ✅ Views (EJS files) are in the same folder

// Static CSS setup
app.use(express.static(__dirname)); // ✅ style.css is in the same folder

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://projectdb:project@cluster0.wjsakka.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => { console.log('connectedd!!!') })
.catch(e => { console.log(e) });

const students = require('./placementlist.js'); // ✅ Corrected path
const users = require('./usermodel.js'); // ✅ Corrected path

isCompany = false;

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/home', (req, res) => {
    res.render('home'); 
});

app.get('/placements/:year', (req, res) => {
    let { year } = req.params;
    const id = parseInt(year);
    students.find({ year: id })
        .then((list) => {
            res.render('placement.ejs', { list });
        }).catch(e => { console.log(e) });
});

app.get('/signup', (req, res) => {
    res.render('signup.ejs');
});

app.post('/signup', (req, res) => {
    const { username, password, isStudent } = req.body;
    const newUser = new users({ name: username, password: password, isStudent: isStudent });
    newUser.save().then(() => {
        res.redirect('/home');
    });
});

app.get('/company/:id', (req, res) => {
    const { id } = req.params;
    students.find({ company: id })
        .then(list => {
            isCompany = true;
            res.render('placement.ejs', { list, isCompany });
        }).catch(e => { console.log(e) });
});

let nextList = [];

app.post('/placements', (req, res) => {
    const { username, password: pass } = req.body;
    users.find({ name: username })
        .then(b => {
            if (b[0].password == pass) {
                if (b[0].isStudent == true) {
                    students.find({}).then(list => {
                        nextList = list;
                        isCompany = false;
                        res.render('placement.ejs', { list, isCompany });
                    });
                } else {
                    res.render('company.ejs');
                }
            } else {
                res.render('home', { errorMessage: 'Invalid Username or Password!' });
            }
        }).catch(err => {
            res.render('home', { errorMessage: 'Invalid Username or Password!' });
        });
});

app.get('/add', (req, res) => {
    res.render('add.ejs');
});

app.post('/add', (req, res) => {
    students.insertMany([req.body])
        .then(() => {
            console.log("success");
        });
    res.render('company.ejs');
});

app.listen(3000, () => {
    console.log('port 3000 started!!');
});
