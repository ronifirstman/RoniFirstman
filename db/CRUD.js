const connection = require('./db');

const loginToWebsite = (req, res)=>{
    //validate body exists
    if (!req.body) { 
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    //pull data from body to json
    const login_customer = {
        "email": req.body.email,
        "password": req.body.password
    };
    console.log(login_customer.email, login_customer.password);
    res.cookie("email", login_customer.email);
    //run query
    connection.query("SELECT email, password FROM customers where email like ?", login_customer.email + "%", (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        if (mysqlres.length == 0) {
            res.render('Login', {
                Title: 'Login',
                PageTitle: 'Login To Use Our Services',
                user_login: false,
                user_email: login_customer.email,
                email_error: 'Email doesnt exists, you need to register first'
            });
            return;
        }
        else {
            if (mysqlres[0].password == login_customer.password) {
                res.redirect("/setEmailCookie/" + mysqlres[0].email);
                return;
            } else {
                res.render('Login', {
                    Title: 'Login',
                    PageTitle: 'Login To Use Our Services',
                    user_login: false,
                    password_error: 'Wrong Password'
                });
                return;
            }
        }
    });
};

const registrationToDB = (req, res)=>{
    //validate body exists
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    };
    //pull data from body to json
    const new_customer = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "phone_number": req.body.phone_number,
        "address": req.body.address,
        "age": req.body.age,
        "password": req.body.password
    };
    res.cookie("email", new_customer.email);
    connection.query("select * from customers where email like ?", req.body.email + "%", (err, mysqlres) =>{
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }        
        else if (mysqlres.length == 0) {
            //run query
            const Q1 = "INSERT INTO customers SET ?";
            connection.query(Q1, new_customer, (err, mysqlres1) => {
                if (err) {
                    console.log("error: ", err);
                    res.status(400).send({message: "error in create customer: " + err});
                    return;
                }
                console.log("new customer created: ", { id: mysqlres1.insertId, ...new_customer});
                res.render('FindAppointment', {
                    Title: 'Find Appointment',
                    PageTitle: 'Find me an appoitment..',
                    user_login: true,
                    message: "User Was Created Successfully",
                });            
                return;
            });
        }
        else {
            res.render('RegistrationPage', {
                title: 'Registration Page',
                page_h1: 'Registration',
                emailError: "This email already exists, please login",
                user_login: false,
            });
            return;
        }
    })
};

const findAppointment = (req,res)=> {
    // validate body exists
    if (!req.body) {
        res.status(400).send({message: "please fill all the fileds in order to search an appointment"});
        return;    
    }
    // pull data from body to JSON
    const new_search = {
        "type_of_service": req.body.type_of_service, 
        "price": req.body.max_price,
        "date_of_service": req.body.date_of_service,
        "time_of_service_start": req.body.time_of_service_start,
        "time_of_service_end": req.body.time_of_service_end,
    }
    //query
    connection.query("SELECT * FROM salons where type_of_service = ? and price <= ? and date = ? and appointment_time >= ? and appointment_time <= ?", 
                        [new_search.type_of_service, new_search.price, new_search.date_of_service, new_search.time_of_service_start, new_search.time_of_service_end], (err, mysqlres) => {
        if (err) {
            console.log("error: error: ", err);
            res.status(400).send({message:"could not find appointment"});
            return;
        }
        console.log(mysqlres)
        res.render('Results', {
            Title: 'Results',
            PageTitle: 'What I Found For You..',
            user_login: true,
            appointment_list: mysqlres
        })
        return;
    })

};

const updatePersonalInfo = (req, res)=>{
    // validate body exists
    if (!req.body) {
        res.status(400).send({message: "Content can not be empty!"});
        return;
    }
    var userEmail = req.cookies.email;
    // pull data from body to JSON
    const newData = {
        "first_name": req.body.first_name,
        "last_name": req.body.last_name,
        "email": req.body.email,
        "phone_number": req.body.phone_number,
        "address": req.body.address,
        "age": req.body.age,
        "password": req.body.password
    }
    //query
    connection.query("UPDATE customers SET ? where email = ?", [newData, userEmail], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error in update user: " + err + newData});
            return;
        }
        res.redirect('MyProfile');        
        return;
    });
};

const showMyProfile = (req,res) => {
    if (!req.cookies.email) {
        res.render('Login', {
            Title: 'Login',
            PageTitle: 'Login To Use Our Service',
            user_login: false,
            message: "Please Login First"
        });
    }
    else {
        var userEmail = req.cookies.email;
        connection.query('select Salon_Name, type_of_service, AVG(ratings) as ratings from ratings group by Salon_Name, type_of_service; select Salon_Name, type_of_service, AVG(ratings) as ratings from ratings where email = ? group by Salon_Name, type_of_service; SELECT * FROM customers where email = ?; select distinct Salon_Name from salons;', [userEmail,userEmail],(err, mysqlres) => {
            if (err) {
                console.log("error:", err);
                res.status(400).send({ message: "error in selecting all customers" + err });
                return;
            }
            console.log(mysqlres[0]);
            console.log(mysqlres[1]);
            console.log(mysqlres[2]);
            console.log(mysqlres[3]);
            res.render('MyProfile', {
                title: 'My Profile',
                page_h1: 'My Profile',
                email: userEmail,
                user_login: true,
                userRatings: mysqlres[0],
                myRatings: mysqlres[1],
                userDetails: mysqlres[2][0],
                salons: mysqlres[3]
            });
        });
    }
};

const addRating = (req, res) => {
    //validate body exists
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
        return;
    };
    //pull data from body to json
    const new_rating = {
        "email": req.cookies.email,
        "Salon_Name": req.body.Salon_Name,
        "type_of_service": req.body.type_of_service,
        "ratings": req.body.ratings
    };
    //run query
    const Q1 = "INSERT INTO ratings SET ?";
    connection.query(Q1, new_rating, (err, mysqlres) => {
        if (err) {
            console.log("error:", err);
            res.status(400).send({ message: "error in adding rating: " + err });
            return;
        }
        console.log("new rating created: ", { id: mysqlres.insertId, ...new_rating});
        res.redirect('MyProfile');
        return;
    })
};

const removeRating = (req, res) => {
    var userEmail = req.cookies.email;
    var Salon_Name = req.params.Salon_Name;
    connection.query("DELETE FROM ratings WHERE email = ? and Salon_Name = ?", [userEmail, Salon_Name], (err, mysqlres) => {
        if (err) {
            console.log("error: ", err);
            res.status(400).send({message: "error: " + err});
            return;
        }
        else {
            res.redirect('http://localhost:8000/MyProfile');
        }
    });
};

module.exports = { registrationToDB, loginToWebsite, findAppointment, updatePersonalInfo, addRating, showMyProfile, removeRating };