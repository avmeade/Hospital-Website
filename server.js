'use strict';
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const jwtKey = 'my_secret_key'
const jwtExpirySeconds = 3000
const mysql = require('mysql2');
const con = mysql.createConnection({
    host: "istwebclass.org",
    user: "ameade1_admin",
    password: "admin",
    database: "ameade1_milestone262"
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!!");
});
app.set('port', (process.env.PORT || 3000));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/public/home.html"));
});
app.get('/getloggedout/', function (req, res) {
    res.cookie('token', 2, { maxAge: 0 })
    //takes you home
    res.send({ redirect: '/backend/index.html'});
});
app.get('/getloggedin/', function (req, res) {

    var viewpage = 0;
    var datahold = [];
    const validtoken = req.cookies.token
    console.log('token new:', validtoken);
    var payload;
    
    if(!validtoken) {
        viewpage = 0;
        console.log("NVT");
    } else {
        try {
            payload = jwt.verify(validtoken, jwtKey); //jwtkey states paassword was correct
            console.log('payload new:', payload.empkey);
            viewpage = payload.empkey;

            var sqlsel = 'select * from employeeTable where employeeKey = ?';
            var inserts = [viewpage];

            var sql = mysql.format(sqlsel, inserts);

            con.query(sql, function (err, data) {
                if (err) {
                    console.error(err);
                    process.exit(1);
                }
                console.log("Show 1" + data);
                
                datahold = data;

                res.send(JSON.stringify(data));
            });

          } catch (e) {
            if (e instanceof jwt.JsonWebTokenError) {
                viewpage = 0;
                console.log("NVT2");
            }
            viewpage = 0;
            console.log("NVT3");
          }
    }
    
});
app.post('/loginemp/', function (req, res) {
    var eemail = req.body.employeeemail;
    var epw = req.body.employeepw;

    var sqlsel = 'select * from employeeTable where eEmail = ?';

    var inserts = [eemail];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result

        if (data.length > 0) {
            console.log("User name correct: ");
            var empkey=data[0].employeeKey;
            console.log(data[0].employeeKey);


            bcrypt.compare(epw, data[0].ePassword, function (err, passwordCorrect ) {
                console.log(epw);
                console.log(data[0].ePassword)
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    const token = jwt.sign({ empkey }, jwtKey, {
                        algorithm: 'HS256',
                        expiresIn: jwtExpirySeconds
                      });

                    res.cookie('token', token, { maxAge: jwtExpirySeconds * 1000 })
                    res.send({ redirect: '/backend/searchemployee.html'});
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});
app.post('/loginpat/', function (req, res) {
    var pemail = req.body.patientemail;
    var ppw = req.body.patientpw;

    var sqlsel = 'select * from patientTable where pEmail = ?';

    var inserts = [pemail];

    var sql = mysql.format(sqlsel, inserts);
    console.log(sql);

    con.query(sql, function (err, data)     {
        //Checks to see if there is data in the result
        if (data.length > 0) {
            console.log("User name correct: ");
            console.log(data[0].pPassword);

            bcrypt.compare(ppw, data[0].pPassword, function (err, passwordCorrect ) {
                if (err) {
                    throw err;
                } else if (!passwordCorrect) {
                    console.log("Password Incorrect");
                } else {
                    console.log("Password Correct");
                    
                    res.send({ redirect: '/home.html'}); //need to change this to portal for patient
                }
            });
        } else {
            console.log("Incorrect user name or password!!");
        }
    });
});
//get employee type from server
app.get('/getemptypes/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM employeetypes';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getemps/', function (req, res) {


    var sqlsel = 'select * from employeeTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getappo/', function (req, res) {
    var sqlsel = 'select * from appointment';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getorderdets/', function (req, res) {
    var sqlsel = 'select * from orderDetails';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getappodet/', function (req, res) {
    var sqlsel = 'select * from appointmentDetails';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getpatorder/', function (req, res) {
    var sqlsel = 'select * from patientOrder';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getprodinv/', function (req, res) {
    var sqlsel = 'select * from productInventory';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getproinv/', function (req, res) {
    var sqlsel = 'select * from productInventory where';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getcusts/', function (req, res) {
    var sqlsel = 'select * from patientTable';
    var sql = mysql.format(sqlsel);
    
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        res.send(JSON.stringify(data));
    });
});
app.get('/getstatus/', function (req, res) {
    var sqlsel = 'select * from appointmentstatus';
    var sql = mysql.format(sqlsel);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleemp/', function (req, res) {
    var ekey = req.query.upempkey;
    var sqlsel = 'select * from employeeTable where employeeKey = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleprodinv/', function (req, res) {

    var ekey = req.query.upempkey;

    var sqlsel = 'select * from productInventory where productInventoryKey = ?';
    var inserts = [ekey];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});

app.get('/getsingleapp/', function (req, res) {

    var akey = req.query.upappkey;

    var sqlsel = 'select * from appointment where appointmentKey = ?';
    var inserts = [akey];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleodetails/', function (req, res) {

    var akey = req.query.upappkey;

    var sqlsel = 'select * from orderDetails where orderDetailKey = ?';
    var inserts = [akey];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});
app.post('/updatesingleapp', function (req, res, ) {

    var aid = req.body.upappointmentid;
    var adetailid = req.body.upappointmentdetailid; //select list
    var aemployeeid = req.body.upappointmentemployeeid; //selectlist 2
    var apatientid = req.body.upappointmentpatientid;
    var akey = req.body.upappointmentkey;
    
    var sqlins = "UPDATE appointment SET appointmentID = ?, appointmentDetailsID = ?, employeesID = ?, " +
        "  patientsID = ?" +
        " WHERE appointmentKey = ? ";
    var inserts = [aid, adetailid, aemployeeid, apatientid, akey];

    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});    
app.get('/getsinglepat/', function (req, res) {

    var pkey = req.query.uppatkey;

    var sqlsel = 'select * from patientTable where patientKey = ?';
    var inserts = [pkey];

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});
app.get('/getsinglepro/', function (req, res) {

    var pkey = req.query.upprokey;

    var sqlsel = 'select * from productTable where productKey = ?';
    var inserts = [pkey];

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
        
    });
});
app.get('/getsingleproinv/', function (req, res) {

    var pkey = req.query.upprokey;

    var sqlsel = 'select * from productInventory where productInventoryKey = ?';
    var inserts = [pkey];

    var sql = mysql.format(sqlsel, inserts);
    
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
        
    });
});
//Search through employeeTable for employee that matches the inserts from user
app.get('/getemp/', function (req, res) {
    var eid = req.query.employeeid;
    var efirstname = req.query.employeefirstname;
    var elastname = req.query.employeelastname;
    var eemail = req.query.employeeemail;
    var eaddress = req.query.employeeaddress;
    var ecity = req.query.employeecity;
    var ezip = req.query.employeezip;
    var estate = req.query.employeestate;
    var etype = req.query.employeetype;

    var sqlsel = 'SELECT * FROM employeeTable WHERE employeeID LIKE ? and eFirstName LIKE ? and eLastName LIKE ? and eEmail LIKE ? and eAddress LIKE ?' +
                ' and eCity LIKE ? and eZip LIKE ? and eState LIKE ? and employeetype LIKE ?';
    
    var inserts = ['%' + eid + '%', '%' + efirstname + '%', '%' + elastname + '%', '%' + eemail + '%', 
            '%' + eaddress + '%', '%' + ecity + '%', '%' + ezip + '%', '%' + estate + '%', '%' + etype + '%']

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//patients search 
app.get('/getpat/', function (req, res) {
    var pid = req.query.patientid;
    var pfirstname = req.query.patientfirstname;
    var plastname = req.query.patientlastname;
    var pemail = req.query.patientemail;
    var paddress = req.query.patientaddress;
    var pcity = req.query.patientcity;
    var pzip = req.query.patientzipcode;
    var pstate = req.query.patientstate;

    var sqlsel = 'SELECT * FROM patientTable WHERE patientID LIKE ? and pFirstName LIKE ? and pLastName LIKE ? and pEmail LIKE ? and pAddress LIKE ?' +
                ' and pCity LIKE ? and pZip LIKE ? and pState LIKE ?';
    
    var inserts = ['%' + pid + '%', '%' + pfirstname + '%', '%' + plastname + '%', '%' + pemail + '%', 
            '%' + paddress + '%', '%' + pcity + '%', '%' + pzip + '%', '%' + pstate + '%']

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//grab product inventory from table
app.get('/getproductinventorydata/', function (req, res) {
    var pinventoryid = req.query.productinventoryid;
    var ppid = req.query.invproductid;
    var pquantity = req.query.productquantity;
    

    var sqlsel = 'SELECT * FROM productInventory WHERE productInventoryID LIKE ? and productsID LIKE ? and productQuantity LIKE ?';
    
    var inserts = ['%' + pinventoryid + '%', '%' + ppid + '%', '%' + pquantity + '%']

    var sql = mysql.format(sqlsel, inserts);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getpro/', function (req, res) {
    var pid = req.query.productid;
    var pname = req.query.productname;
    var pprice = req.query.productprice;
    
    var sqlsel = 'SELECT * FROM productTable WHERE productID LIKE ? and productName LIKE ? and productPrice LIKE ?';
    
    var inserts = ['%' + pid + '%', '%' + pname + '%', '%' + pprice + '%']

    var sql = mysql.format(sqlsel, inserts);

    

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});

app.get('/getproductnames/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM productTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getprod/', function (req, res) {
    var pid = req.query.productid;
    var pname = req.query.productname;
    var pprice = req.query.productprice;

    var sqlsel = 'SELECT * FROM productTable WHERE productID LIKE ? and productName LIKE ? and productPrice LIKE ?';
    
    var inserts = ['%' + pid + '%', '%' + pname + '%', '%' + pprice + '%']

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getodetaildata/', function (req, res) {
    var pid = req.query.orderdetailid;
    var odorderid = req.query.orderdetailorderid;
    var odproductid = req.query.orderdetailproductid;
    var odquantity = req.query.orderdetailquantity;
    var odtotal = req.query.orderdetailtotal;

    var sqlsel = 'SELECT * FROM orderDetails WHERE orderDetailID LIKE ? and pOrdersID LIKE ? and productsID LIKE ? and orderDetailQUantity LIKE ? and orderDetailTotal LIKE ?';
    
    var inserts = ['%' + pid + '%', '%' + odorderid + '%', '%' + odproductid + '%', '%' + odquantity + '%', '%' + odtotal + '%']

    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//appointment
app.get('/getappointments/', function (req, res) {
    var aid = req.query.appointmentid;
    var appdetailid = req.query.appointmentdetailid;
    var appempid = req.query.appointmentempid;
    var apppatid = req.query.appointmentpatid;

    if (appdetailid > 0) {
        var typeaddon1 = ' and appointmentDetailsID = ?';
        var typeaddonvar1 = appdetailid;
    } else {
        var typeaddon1 = ' and appointmentDetailsID Like ?'; 
        var typeaddonvar1 = '%%';
    }
    if (appempid > 0) {
        var typeaddon2 = ' and employeesID = ?';
        var typeaddonvar2 = appempid;
    } else {
        var typeaddon2 = ' and employeesID Like ?';
        var typeaddonvar2 = '%%';
    }
    if (apppatid > 0) {
        var typeaddon3 = ' and patientsID = ?';
        var typeaddonvar3 = apppatid;
    } else {
        var typeaddon3 = ' and patientsID Like ?';
        var typeaddonvar3 = '%%';
    }

    var sqlsel = 'SELECT appointment.*, appointmentDetails.appointmentDetailID, employeeTable.eFirstName, patientTable.pFirstName from appointment' +
    ' inner join appointmentDetails on appointmentDetails.appointmentDetailID = appointment.appointmentDetailsID' +
    ' inner join employeeTable on employeeTable.employeeID = appointment.employeesID' +
    ' inner join patientTable on patientTable.patientID = appointment.patientsID' +
    ' where appointmentKey LIKE ?' + typeaddon1 + typeaddon2 + typeaddon3;
    
    var inserts = ['%' + aid + '%', typeaddonvar1, typeaddonvar2, typeaddonvar3]
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getpatientorder/', function (req, res) {
    var patientorderid = req.query.patientorderid;
    var patientorderdate = req.query.patientorderdate;
    var patientordertime = req.query.patientordertime;
    var patientname = req.query.patientname;
    var patientid = req.query.patientid;
    var orderdetailsid = req.query.orderdetailsid;

    if (patientid > 0) {
        var typeaddon1 = ' and patientID = ?';
        var typeaddonvar1 = patientid;
    } else {
        var typeaddon1 = ' and patientsID Like ?'; 
        var typeaddonvar1 = '%%';
    }
    if (orderdetailsid > 0) {
        var typeaddon2 = ' and orderDetailID = ?';
        var typeaddonvar2 = orderdetailsid;
    } else {
        var typeaddon2 = ' and orderDetailID Like ?';
        var typeaddonvar2 = '%%';
    }
    

    var sqlsel = 'SELECT patientOrder.*, patientTable.patientID, orderDetails.orderDetailID from patientOrder' +
    ' inner join patientTable on patientTable.patientID = patientOrder.patientsID' +
    ' inner join orderDetails on orderDetails.orderDetailID = patientOrder.orderDetailsID' +
    ' where pOrderKey LIKE ?' + typeaddon1 + typeaddon2;
    var inserts = ['%' + patientorderid + '%', '%' + patientorderdate + '%','%' + patientordertime + '%','%' + patientname + '%' , typeaddonvar1, typeaddonvar2]
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//order detail search 
app.get('/getorderdetails/', function (req, res) {
    var odid = req.query.orderdetailid;
    var pordersid = req.query.orderdetailorderid;
    var productsid = req.query.orderdetailproductid;
    var orderdetailquantity = req.query.orderdetailquantity;
    var orderdetailtotal = req.query.orderdetailtotal;

    if (pordersid > 0) {
        var typeaddon1 = ' and pOrderID = ?';
        var typeaddonvar1 = pordersid;
    } else {
        var typeaddon1 = ' and pOrderID Like ?'; 
        var typeaddonvar1 = '%%';
    }
    if (productsid > 0) {
        var typeaddon2 = ' and productsID = ?';
        var typeaddonvar2 = productsid;
    } else {
        var typeaddon2 = ' and productsID Like ?';
        var typeaddonvar2 = '%%';
    }
    var sqlsel = 'SELECT orderDetails.*, patientOrder.pOrderID, productTable.productID from orderDetails' +
    ' inner join patientOrder on patientOrder.pOrderID = orderDetails.pOrdersID' +
    ' inner join productTable on productTable.productID = orderDetails.productsID' +
    ' where orderDetailKey LIKE ?' + typeaddon1 + typeaddon2 + ' and orderDetailQuantity Like ? and orderDetailTotal Like ? ';
    
    var inserts = ['%' + odid + '%', typeaddonvar1, typeaddonvar2,'%' + orderdetailquantity + '%','%' + orderdetailtotal + '%' ]
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//search appointment details
app.get('/getappointmentdetails/', function (req, res) {
    var appointmentdetalid = req.query.appointmentdetailid;                        
    var appointmentid = req.query.appointmentid;
    var appdetailnotes = req.query.appointmentnotes;
    var appdetailstatus = req.query.appointmentstatus;
    var appdetaildate = req.query.appointmentdate;
    var appdetailtime = req.query.appointmenttime;
 
    if (appointmentid > 0) {                                    
        var typeaddon1 = ' and appointmentID = ?';
        var typeaddonvar1 = appointmentid;
    } else {
        var typeaddon1 = ' and appointmentID Like ?'; 
        var typeaddonvar1 = '%%';
    }
    if (appdetailstatus > 0) {                                   
        var typeaddon2 = ' and statusID = ?';
        var typeaddonvar2 = appdetailstatus;
    } else {
        var typeaddon2 = ' and statusID Like ?';
        var typeaddonvar2 = '%%';
    }
    
    var sqlsel = 'SELECT appointmentDetails.*,appointment.appointmentID, appointmentstatus.statusID from appointmentDetails' +
    ' inner join appointment on appointment.appointmentID = appointmentDetails.appointmentsID' +
    ' inner join appointmentstatus on appointmentstatus.statusID = appointmentDetails.appointmentstatus' +
    ' where appointmentDetailKey LIKE ?' + typeaddon1 + ' and appointmentNotes LIKE ?' + typeaddon2 + ' and appointmentDate Like ? and appointmentTime Like ? ORDER BY appointmentDetailID';
    
    var inserts = ['%' + appointmentdetalid + '%', typeaddonvar1,'%' + appdetailnotes + '%', typeaddonvar2,'%' + appdetaildate + '%','%' + appdetailtime + '%' ]
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//search product inventory
app.get('/getproductinventory/', function (req, res) {
    var productinvid = req.query.productinvid;                        
    var productNameID = req.query.productid;
    var productquantity = req.query.prodinvquantity;
    if (productNameID > 0) { 
        var typeaddon1 = ' and productsID = ?';
        var typeaddonvar1 = productNameID;
    } else {
        var typeaddon1 = ' and productsID Like ?'; 
        var typeaddonvar1 = '%%';
    }

    var sqlsel = 'SELECT productInventory.*,productTable.productID from productInventory' +
    ' inner join productTable on productTable.productID = productInventory.productsID' +
    ' where productInventoryKey LIKE ?' + typeaddon1 + ' and productQuantity LIKE ?';
    var inserts = ['%' + productinvid + '%', typeaddonvar1,'%' + productquantity + '%']
    var sql = mysql.format(sqlsel, inserts);
    //console.log(sql);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
//grab productTable
app.get('/getproducttypes/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM productTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getappdetails/', function (req, res) {
    var sqlsel = 'SELECT * FROM appointmentDetails';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getpatientid/', function (req, res) {
    var sqlsel = 'SELECT * FROM patientTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getprodid/', function (req, res) {
    var sqlsel = 'SELECT * FROM productTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getemployeeid/', function (req, res) {
    var sqlsel = 'SELECT * FROM employeeTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getappointmentdetailid/', function (req, res) {
    var sqlsel = 'SELECT * FROM appointmentDetails';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getappointmentid/', function (req, res) {
    var sqlsel = 'SELECT * FROM appointment';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getpatientorderid/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM patientOrder';
    var sql = mysql.format(sqlsel);
    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getproductIDs/', function (req, res) {
    
    var sqlsel = 'SELECT * FROM productTable';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getorderdetailid/', function (req, res) {  
    var sqlsel = 'SELECT * FROM orderDetails';
    var sql = mysql.format(sqlsel);

    con.query(sql, function(err, data2) { 
        if(err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data2));
    });
});
//insert patient
app.post('/patient', function (req, res,) {

    var pid = req.body.patientid;
    var pfname = req.body.patientfirstname;
    var plname = req.body.patientlastname;
    var ppw = req.body.patientpw;
    var pemail = req.body.patientemail;
    var paddress = req.body.patientaddress;
    var pcity = req.body.patientcity;
    var pzip = req.body.patientzip;
    var pstate = req.body.patientstate;
    var ptype = req.body.patienttype;
    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(ppw, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            theHashedPW = hashedPassword;
            //SQL statement to enter into database
            var sqlins = "INSERT INTO patientTable (patientID, pFirstName, pLastName," +
                 "pPassword, pEmail, pAddress, pCity, pZip, pState, patienttype) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            
            var inserts = [pid, pfname, plname, theHashedPW, pemail, paddress, pcity, pzip, pstate, ptype];
                
            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertpatient.html');
                res.end();
            });
        }
    });
});
//insert employee // 
app.post('/employee', function (req, res,) {
    var eid = req.body.employeeid;
    var efname = req.body.employeefirstname;
    var elname = req.body.employeelastname;
    var epw = req.body.employeepw;
    var eemail = req.body.employeeemail;
    var eaddress = req.body.employeeaddress;
    var ecity = req.body.employeecity;
    var ezip = req.body.employeezip;
    var estate = req.body.employeestate;
    var etype = req.body.employeetype;
    var saltRounds = 10;
    var theHashedPW = '';
    bcrypt.hash(epw, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.log("Bad on encrypt");
            return;
        } else {
            theHashedPW = hashedPassword;
            //SQL statement to enter into database
            var sqlins = "INSERT INTO employeeTable (employeeID, eFirstName, eLastName," +
                 "ePassword, eEmail, eAddress, eCity, eZip, eState, employeetype) " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            var inserts = [eid, efname, elname, theHashedPW, eemail, eaddress, ecity, ezip, estate, etype];
            var sql = mysql.format(sqlins, inserts);
            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertemployee.html');
                res.end();
            });
        }
    });
});
//update single entry of employee
app.post('/updatesingleemp', function (req, res, ) {

    var eid = req.body.upemployeeid;
    var efname = req.body.upemployeefirstname;
    var elname = req.body.upemployeelastname;
    var eemail = req.body.upemployeeemail;
    var eaddress = req.body.upemployeeaddress;
    var ecity = req.body.upemployeecity;
    var ezip = req.body.upemployeezip;
    var estate = req.body.upemployeestate;
    var ekey = req.body.upemployeekey; //idk if we need this line. 
    
    var sqlins = "UPDATE employeeTable SET employeeID = ?, eFirstName = ?, eLastName = ?, " +
        " eEmail = ?, eAddress = ?, eCity = ?, eZip = ?, eState =? " +
        " WHERE employeeKey = ? ";
    var inserts = [eid, efname, elname, eemail, eaddress, ecity, ezip, estate, ekey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});    
//patient update 
app.post('/updatesinglepat', function (req, res, ) {

    var pid = req.body.uppatientid;
    var pfname = req.body.uppatientfirstname;
    var plname = req.body.uppatientlastname;
    var pemail = req.body.uppatientemail;
    var paddress = req.body.uppatientaddress;
    var pcity = req.body.uppatientcity;
    var pzip = req.body.uppatientzipcode;
    var pstate = req.body.uppatientstate;
    var pkey = req.body.uppatientkey; //idk if we need this line. 
    
    var sqlins = "UPDATE patientTable SET patientID = ?, pFirstName = ?, pLastName = ?, " +
        " pEmail = ?, pAddress = ?, pCity = ?, pZip = ?, pState =? " +
        " WHERE patientKey = ? ";
    var inserts = [pid, pfname, plname, pemail, paddress, pcity, pzip, pstate, pkey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});    
app.post('/updatesinglepro', function (req, res, ) {

    var pid = req.body.upproductid;
    var pname = req.body.upproductname;
    var pprice = req.body.upproductprice;
    var pkey = req.body.upproductkey; //idk if we need this line. 
    
    var sqlins = "UPDATE productTable SET productID = ?, productName = ?, productPrice = ? " +
        " WHERE productKey = ? ";
    var inserts = [pid, pname, pprice, pkey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            res.end();
        });
});
app.post('/updatesingleproinv', function (req, res, ) {

    var pinvid = req.body.upprodinvid;
    var prodid = req.body.uptheproductid;
    var pquantity = req.body.upproductinvquantity;
    var pkey = req.body.upproductinvkey;  
    
    var sqlins = "UPDATE productInventory SET productInventoryID = ?, productsID = ?, productQuantity = ? " +
        " WHERE productInventoryKey = ? ";
    var inserts = [pinvid, prodid, pquantity, pkey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            res.end();
        });
});
app.post('/product', function (req, res,) {
    var productid = req.body.productid;
    var pname = req.body.productname;
    var pprice = req.body.productprice;


            //SQL statement to enter into database
            var sqlins = "INSERT INTO productTable (productID, productName, productPrice) " +
                " VALUES (?, ?, ?)";
            var inserts = [productid, pname, pprice];
                
            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertproduct.html');
                res.end();
            });
});
app.post('/patientorder', function (req, res,) {
        var patientorderid = req.body.patientorderid;
        var patientorderdate = req.body.patientorderdate;
        var patientordertime = req.body.patientordertime;
        var patientname = req.body.patientname; 
        var patientid = req.body.patientid;
        var orderdetailsid = req.body.orderdetailid; 
            //SQL statement to enter into database
            var sqlins = "INSERT INTO patientOrder (pOrderID, pOrderDate, pOrderTime, patientName, patientsID, orderDetailsID) " +
                " VALUES (?, ?, ?, ?, ?, ?)";
            var inserts = [patientorderid, patientorderdate, patientordertime, patientname, patientid, orderdetailsid];
            var sql = mysql.format(sqlins, inserts);
            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertpatientorder.html');
                res.end();
            });
});
app.post('/appointment', function (req, res,) {

    var appointmentid = req.body.appointmentid;
    var appointmentdetailid = req.body.appointmentdetailid;
    var employeeid = req.body.employeeid;
    var patientid = req.body.patientid;
    
            //SQL statement to enter into database
            var sqlins = "INSERT INTO appointment (appointmentID, appointmentDetailsID, employeesID," +
                 "patientsID) " +
                " VALUES (?, ?, ?, ?)";
            var inserts = [appointmentid, appointmentdetailid, employeeid, patientid];
            var sql = mysql.format(sqlins, inserts);
            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertappointment.html');
                res.end();
            });
});
app.post('/orderdetail', function (req, res,) {
    var orderdetailid = req.body.orderdetailid;
    var porderid = req.body.porderid;
    var productid = req.body.productid;
    var orderdetailquantity = req.body.orderdetailquantity;
    var orderdetailtotal = req.body.orderdetailtotal;

            //SQL statement to enter into database
            var sqlins = "INSERT INTO orderDetails (orderDetailID, pOrdersID, productsID, orderDetailQuantity, orderDetailTotal) " +
                " VALUES (?, ?, ?, ?, ?)";
            var inserts = [orderdetailid, porderid, productid, orderdetailquantity, orderdetailtotal ];
                
            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertorderdetails.html');
                res.end();
            });
});
app.post('/productinventory', function (req, res,) {
    var productinventoryid = req.body.productinventoryid;
    var productid = req.body.productid;
    var productinventoryquantity = req.body.productinventoryquantity;

            //SQL statement to enter into database
            var sqlins = "INSERT INTO productInventory (productInventoryID, productsID, productQuantity) " +
                " VALUES (?, ?, ?)";
            var inserts = [productinventoryid, productid, productinventoryquantity];
                
            var sql = mysql.format(sqlins, inserts);

            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertproductinventory.html');
                res.end();
            });
});
app.post('/appointmentdetail', function (req, res,) {
    var appointmentdetailid = req.body.appointmentdetailid;
    var appointmentid = req.body.appointmentid;
    var appointmentnotes = req.body.appointmentnotes;
    var appointmentstatus = req.body.appointmentstatus;
    var appointmentdate = req.body.appointmentdate;
    var appointmenttime = req.body.appointmenttime;

            //SQL statement to enter into database
            var sqlins = "INSERT INTO appointmentDetails (appointmentDetailID,appointmentsID,appointmentNotes,appointmentstatus,appointmentDate, appointmentTime)" + " VALUES (?, ?, ?, ?, ?, ?)";
            var inserts = [appointmentdetailid, appointmentid, appointmentnotes, appointmentstatus, appointmentdate, appointmenttime];
                
            var sql = mysql.format(sqlins, inserts);
            con.execute(sql, function (err, result) {
                if (err) throw err;
                console.log("1 record inserted");
                //After submit redirects to page below
                res.redirect('insertappointmentdetail.html');
                res.end();
            });
});
//get single appdetail
app.get('/getsingleappdetail/', function (req, res) {

    var akey = req.query.upappdetailkey;

    var sqlsel = 'select * from appointmentDetails where appointmentDetailKey = ?';
    var inserts = [akey];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        res.send(JSON.stringify(data));
    });
});
app.get('/getsingleorderdetail/', function (req, res) {
    var akey = req.query.upappdetailkey;
    var sqlsel = 'select * from patientOrder where pOrderKey = ?';
    var inserts = [akey];
    var sql = mysql.format(sqlsel, inserts);
    con.query(sql, function (err, data) {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        
        res.send(JSON.stringify(data));
    });
});
//update single app details
app.post('/updatesingleappdetail', function (req, res, ) {

    var aappdid = req.body.upappointmentdetailid;
    var aappid = req.body.upappointmentid;
    var anotes = req.body.upappointmentnotes;
    var astatus = req.body.upappointmentstatus;
    var adate = req.body.upappointmentdate;
    var atime = req.body.upappointmenttime;
    var akey = req.body.upappointmentdetailkey;

    var sqlins = "UPDATE appointmentDetails SET appointmentDetailID = ?, appointmentsID = ?, appointmentNotes = ?, " +
        " appointmentStatus = ?, appointmentDate = ?, appointmentTime = ? " +
        " WHERE appointmentDetailKey = ? ";
    var inserts = [aappdid, aappid, anotes, astatus, adate, atime, akey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});    
//update order details update single 
app.post('/updatesingleorderdetail', function (req, res, ) {

    var orderdetailid = req.body.uporderdetailid;
    var orderid = req.body.upporderid;
    var orderprodid = req.body.upprodid;
    var orderdqty = req.body.uporderdetailquantity;
    var orderdtotal = req.body.uporderdetailtotal;
    var okey = req.body.uporderdetailkey;

    var sqlins = "UPDATE orderDetails SET orderDetailID = ?, pOrdersID = ?, productsID = ?, " +
        " orderDetailQuantity = ?, orderDetailTotal = ? " +
        " WHERE orderDetailKey = ? ";
    var inserts = [orderdetailid, orderid, orderprodid, orderdqty, orderdtotal, okey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});  
app.post('/updatesinglePatientOrder', function (req, res, ) {
    var patorderid =  req.body.uppatientorderid;
    var patorderdate = req.body.uppatientorderdate;
    var patordertime = req.body.uppatientordertime;
    var patordername = req.body.uppatientordername;
    var patientid = req.body.uppatientid;
    var orderdetailid = req.body.uporderdetailsid;
    var akey = req.body.uppatientorderkey;

    var sqlins = "UPDATE patientOrder SET pOrderID = ?, pOrderDate = ?, pOrderTime = ?, " +
        " patientName = ?, patientsID = ?, orderDetailsID = ? " +
        " WHERE pOrderKey = ? ";
    var inserts = [patorderid, patorderdate, patordertime, patordername, patientid, orderdetailid, akey];
    var sql = mysql.format(sqlins, inserts);
    con.execute(sql, function (err, result) {
            if (err) throw err;
            console.log("1 record updated");
            
            res.end();
        });
});  
app.listen(app.get('port'), function () {
    console.log('Server started: http://localhost:' + app.get('port') + '/');
});
