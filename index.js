//modules
var express = require('express');
var app = express();
var path = require('path');
var port = 8000;
const bodyparser = require("body-parser");
const CRUD = require('./db/CRUD');
const CRUD_DB = require('./db/CRUD_DB');
const cookieParser = require("cookie-parser");

app.use(express.static('static'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());

//PUG
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


//routes

//home page
app.get('/', (req, res) => {
    res.redirect("/Home");
});

app.get('/Home', (req, res) => {
    res.render('HomePage', {
        Title: 'Home Page',
        PageTitle: '',
        user_login: false 
    });
});

//login
app.get('/Login', (req, res) => {
    res.render('Login', {
        Title: 'Login',
        PageTitle: 'Login To Use Our Service',
        user_login: false 
    });
});

app.post('/LoginData', CRUD.loginToWebsite);

//registration 
app.get('/RegistrationPage', (req, res) => {
    res.render('RegistrationPage', {
        Title: 'Registration Page',
        PageTitle: 'Registration',
        user_login: false 
    });
});

app.post('/Register', CRUD.registrationToDB);

//about us
app.get('/AboutUs', (req, res) => {
    if (!req.cookies.email) {
        res.render('Login', {
            Title: 'Login',
            PageTitle: 'Login To Use Our Service',
            user_login: false,
            message: "Please Login First"
        });
    }
    else {
        res.render('AboutUs', {
            Title: 'About Us',
            PageTitle: 'About Us',
            user_login: true 
        });
    }
});

//find appointment
app.get('/FindAppointment', (req, res) => {
    if (!req.cookies.email) {
        res.render('Login', {
            Title: 'Login',
            PageTitle: 'Login To Use Our Service',
            user_login: false,
            message: "Please Login First"
        });
    }
    else {
        res.render('FindAppointment', {
            Title: 'Find Me an Appointment',
            PageTitle: 'Find me an appoitment..',
            user_login: true 
        });
    }
});

app.post('/FindAppointment', CRUD.findAppointment);

//results
app.post('/Results', (req, res) => {
    res.sendFile(path.join(__dirname, "views/Results.html"));
});

//my profile
app.get('/MyProfile', CRUD.showMyProfile);

app.post('/UpdateProfile', CRUD.updatePersonalInfo);

app.post('/addRating', CRUD.addRating);

app.get('/removeRating/:Salon_Name', CRUD.removeRating);

//cookies
app.get("/setEmailCookie/:email", (req, res) => {
    var email = req.params.email;
    res.cookie('email', email);
    res.redirect('/FindAppointment');
});

app.get('/Logout', (req,res) => {
    res.clearCookie("email");
    res.redirect('/Home');
});

//initialize DB
app.get('/createDBtables', [CRUD_DB.createCustomersTable, CRUD_DB.createRatingsTable, CRUD_DB.createSalonsTable]);

//insert data
app.get('/insertCustomers', CRUD_DB.InsertCustomersData);
app.get('/insertRatings', CRUD_DB.InsertRatingsData);
app.get('/insertSalons', CRUD_DB.InsertSalonsData);

//show tables
app.get('/showCustomers', CRUD_DB.ShowCustomersTable);
app.get('/showRatings', CRUD_DB.ShowRatingsTable);
app.get('/showSalons', CRUD_DB.ShowSalonsTable);

//drop tables 
app.get('/dropDBtables', [CRUD_DB.dropRatingsTable, CRUD_DB.dropCustomersTable, CRUD_DB.dropSalonsTable]);

//listen
app.listen(port, () => {
    console.log("server is running on port" + port);
});
