var sql = require("./db");
const path = require("path");
const csv = require("csvtojson");

const createCustomersTable = (req, res, next) => {
    var Q1 = "CREATE TABLE IF NOT EXISTS `customers` ( \
        first_name VARCHAR(20) NOT NULL,\
        last_name VARCHAR(20) NOT NULL,\
        email VARCHAR(255) NOT NULL PRIMARY KEY,\
        phone_number VARCHAR(10) NOT NULL,\
        address VARCHAR(255) NOT NULL,\
        age INT NOT NULL,\
        password VARCHAR(255) NOT NULL\
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;"
      sql.query(Q1,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating customers table"});
            return;
        }
        console.log('customers table created successfully');
        return;
    })
    next();
};

const createRatingsTable = (req, res, next) => {
    var Q2 = "CREATE TABLE IF NOT EXISTS `ratings` (\
        ratingID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,\
        email VARCHAR(255) NOT NULL,\
        Salon_Name VARCHAR(50) NOT NULL,\
        type_of_service VARCHAR(50) NOT NULL,\
        ratings INT NOT NULL,\
        FOREIGN KEY (email) REFERENCES customers(email)\
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    sql.query(Q2,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating ratings table"});
            return;
        }
        console.log('ratings table created successfully');
        return;
    })
    next();
};

const createSalonsTable = (req, res) => {
    var Q3 = "CREATE TABLE IF NOT EXISTS `salons` (\
        salonID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,\
        Salon_Name VARCHAR(50) NOT NULL,\
        address VARCHAR(100) NOT NULL,\
        contact_number VARCHAR(10) NOT NULL,\
        type_of_service VARCHAR(50) NOT NULL,\
        price DECIMAL(10,2) NOT NULL,\
        date DATE NOT NULL,\
        appointment_time TIME NOT NULL\
        )ENGINE=InnoDB DEFAULT CHARSET=utf8;"
    sql.query(Q3,(err,mysqlres)=>{
        if (err) {
            console.log("error ", err);
            res.status(400).send({message: "error in creating salons table"});
            return;
        }
        console.log('salons table created successfully');
        console.log('all tables was created')
        return;
    })
};


const InsertCustomersData = (req,res)=>{
    var Q4 = "INSERT INTO customers SET ?";
    const csvFilePath= path.join(__dirname, "customers.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
        jsonObj.forEach(element => {
            var NewEntry = {
                "first_name": element.first_name,
                "last_name": element.last_name,
                "email": element.email,
                "phone_number": element.phone_number,
                "address": element.address,
                "age": element.age,
                "password": element.password
            }
            sql.query(Q4, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting data", err);
                }
                console.log("created row sucssefuly ");
            });
        });
    });    
    res.send("customers data inserted");

}; 

const InsertRatingsData = (req,res)=>{
    var Q5 = "INSERT INTO ratings SET ?";
    const csvFilePath= path.join(__dirname, "ratings.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
        jsonObj.forEach(element => {
            var NewEntry = {
                "ratingID": element.ratingID,
                "email": element.email,
                "Salon_Name": element.Salon_Name,
                "type_of_service": element.type_of_service,
                "ratings": element.ratings
            }
            sql.query(Q5, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting data", err);
                }
                console.log("created row sucssefuly ");
            });
        });
    });
    
    res.send("ratings data inserted");

};

const InsertSalonsData = (req,res)=>{
    var Q6 = "INSERT INTO salons SET ?";
    const csvFilePath= path.join(__dirname, "salons.csv");
    csv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
    // console.log(jsonObj);
        jsonObj.forEach(element => {
            var NewEntry = {
                "salonID": element.salonID,
                "Salon_Name": element.Salon_Name,
                "address": element.address,
                "contact_number": element.contact_number,
                "type_of_service": element.type_of_service,
                "price": element.price,
                "date": element.date,
                "appointment_time": element.appointment_time
            }
            sql.query(Q6, NewEntry, (err,mysqlres)=>{
                if (err) {
                    console.log("error in inserting data", err);
                }
                console.log("created row sucssefuly ");
            });
        });
    });
    console.log()
    res.send("salons data inserted");
};

//show tables
const ShowCustomersTable = (req,res)=>{
    var Q7 = "SELECT * FROM customers";
    sql.query(Q7, (err, mysqlres)=>{
        if (err) {
            console.log("error in showing customers table ", err);
            res.send("error in showing customers table ");
            return;
        }
        console.log("showing customers table");
        res.send(mysqlres);
        return;
    })
};

const ShowRatingsTable = (req,res)=>{
    var Q8 = "SELECT * FROM ratings";
    sql.query(Q8, (err, mysqlres)=>{
        if (err) {
            console.log("error in showing ratings table ", err);
            res.send("error in showing ratings table ");
            return;
        }
        console.log("showing ratings table");
        res.send(mysqlres);
        return;
    })
};

const ShowSalonsTable = (req,res)=>{
    var Q12 = "SELECT * FROM salons";
    sql.query(Q12, (err, mysqlres)=>{
        if (err) {
            console.log("error in showing salons table ", err);
            res.send("error in showing salons table ");
            return;
        }
        console.log("showing salons table");
        res.send(mysqlres);
        return;
    })
};

//drop tables
const dropRatingsTable = (req,res,next)=>{
    var Q9 = "DROP TABLE ratings";
    sql.query(Q9, (err, mysqlres)=>{
        if (err) {
            console.log("error in dropping ratings table ", err);
            res.status(400).send({message: "error in dropping ratings table" + err});
            return;
        }
        console.log("ratings table dropped");
        return;
    });
    next();
};

const dropCustomersTable = (req,res,next)=>{
    var Q10 = "DROP TABLE customers";
    sql.query(Q10, (err, mysqlres)=>{
        if (err) {
            console.log("error in dropping customers table ", err);
            res.status(400).send({message: "error in dropping customers table" + err});
            return;
        }
        console.log("users table dropped");
        return;
    });
    next();
};

const dropSalonsTable = (req,res)=>{
    var Q11 = "DROP TABLE salons";
    sql.query(Q11, (err, mysqlres)=>{
        if (err) {
            console.log("error in dropping salons table ", err);
            res.status(400).send({message: "error in dropping salons table" + err});
            return;
        }
        console.log("salons table dropped");
        res.send("all tables dropped");
        return;
    });
};

module.exports={createCustomersTable, createRatingsTable, createSalonsTable, InsertCustomersData, InsertRatingsData, InsertSalonsData, ShowCustomersTable, ShowRatingsTable, ShowSalonsTable, dropRatingsTable, dropCustomersTable, dropSalonsTable};