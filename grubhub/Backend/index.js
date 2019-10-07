//import the require dependencies
var express = require('express');
var mysql = require('mysql');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var cors = require('cors');
app.set('view engine', 'ejs');

//use cors to allow cross origin resource sharing
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

//use express session to maintain session data
app.use(session({
    secret              : 'cmpe273_kafka_passport_mongo',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));

// app.use(bodyParser.urlencoded({
//     extended: true
//   }));
app.use(bodyParser.json());

//Allow Access Control
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
    res.setHeader('Cache-Control', 'no-cache');
    next();
  });

//The connection established between database and backend
const connection = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'pushpavathideeksha',
        database: 'grub_hub'
    }
); 

  var userdata = [{
      userName : "admin",
      userPassword : "admin",
      userEmail: "admin@grub.com"

  }]

  //callback function
  connection.connect(function(error){
    if(!!error){
        console.log('Error');
    }else{
        console.log('connected to SQL');
    }
  })

  app.get('/', function(req, res){
      //about mysql
      connection.query("INERT * FROM grub_hub.user_login",(error, rows) =>{
        if(!!error){
            console.log('Error in query');
            console.log('Error in query by rosy');
        }else{
            console.log('successfull query');
            console.log(rows);
            return(res.rows);
        }
      });
  })

  var books = [
    {"BookID" : "1", "Title" : "Book 1", "Author" : "Author 1"},
    {"BookID" : "2", "Title" : "Book 2", "Author" : "Author 2"},
    {"BookID" : "3", "Title" : "Book 3", "Author" : "Author 3"}
]

//Route to handle Post Request Call
app.post('/login',function(req,res){
    
    // Object.keys(req.body).forEach(function(key){
    //     req.body = JSON.parse(key);
    // });
    // var username = req.body.username;
    // var password = req.body.password;
    console.log("Inside Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    Users.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        }
    })

    
});

//Route to handle Post Request Call
app.post('/userLogin',function(req,res){
    
    console.log("Inside User Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    let userName = req.body.userName;
    let userPassword = req.body.user;
    const userLoginQuery = "SELECT userName, userPassword FROM user_login WHERE userName IN ('"+ userName +"')";
    connection.query(userLoginQuery, [userName, userPassword], (error, results, fields)=>{
        console.log(results);
       // console.log(results[0].ownerName);
        if(!!error){
            console.log('Error in query');
            res.statusCode = 500;
            return res.json({errors: ["cannot insert the user details"]});
        }
        else {
            if(results[0].userName === req.body.userName && results[0].userPassword)
            {
                res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
                req.session.results = results;
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log("entered here");
                res.end("Successful Login");
            }
            var queryResults = JSON.stringify(results);
            console.log(queryResults);
        }
    });

    
});

//Route to handle Post Request Call to login for owner....
app.post('/ownerLogin',function(req,res){
    
    console.log("Inside Owner Login Post Request");
    //console.log("Req Body : ", username + "password : ",password);
    console.log("Req Body : ",req.body);
    let ownerName = req.body.ownerName;
    let ownerPassword = req.body.ownerPassword;
    const  ownerRegQuery = "SELECT ownerName, ownerPassword FROM owner_login WHERE ownerName IN ('"+ ownerName +"')";
    connection.query(ownerRegQuery, [ownerName, ownerPassword], (error, results, fields)=>{
        console.log(results);
       // console.log(results[0].ownerName);
        if(!!error){
            console.log('Error in query');
            res.statusCode = 500;
            return res.json({errors: ["cannot insert the user details"]});
        }
        else {
            if(results[0].ownerName === req.body.ownerName && results[0].ownerPassword)
            {
                res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
                req.session.results = results;
                res.writeHead(200,{
                    'Content-Type' : 'text/plain'
                })
                console.log("entered here");
                res.end("Successful Login");
            }
            var queryResults = JSON.stringify(results);
            console.log(queryResults);
        }
    });
   /* Users.filter(function(user){
        if(user.username === req.body.username && user.password === req.body.password){
            res.cookie('cookie',"admin",{maxAge: 900000, httpOnly: false, path : '/'});
            req.session.user = user;
            res.writeHead(200,{
                'Content-Type' : 'text/plain'
            })
            res.end("Successful Login");
        }
    })*/

    
});

//Route to handle Post Request call for userRegister
app.post('/userRegister', function(req, res){

    console.log("Inside the userRegister Request");
    console.log("Req Body :", req.body);
    let userName = req.body.userData.userName;
    let userEmail = req.body.userData.userEmail;
    let userPassword = req.body.userData.userPassword;
    //let hashPassword = bcrypt.hashSync(password, saltRounds);
    const userRegQuery = "INSERT INTO user_login (userName, userEmail, userPassword) VALUES ('"+ userName +"', '"+userEmail + "', '"+ userPassword +"')";
    console.log(userRegQuery); 
    connection.query(userRegQuery, [userName, userEmail, userPassword] ,(error, results, fields) =>{
        if(!!error){
            console.log(userName);
            console.log('Error in query');
            res.statusCode = 500;
            return res.json({errors: ["cannot insert the user details"]});
        } else{
            console.log('successfull query');
            console.log(res.rows);
            return res.json();
        }
      });


});

//Route to handle get Request call for ownerProfile
app.get('/ownerProfile', function(req, res){

    console.log("Inside the ownerProfile GET Request");
    console.log("Req Body :", req.body);
    let ownerName = req.body.ownerName;
    let ownerEmail = req.body.ownerEmail;
    let ownerPhone = req.body.ownerPhone;
    let ownerImage = req.body.ownerImage;
    let restaurantName = req.body.restaurantName;
    let restaurantImage = req.body.restaurantImage;
    let cuisine = req.body.cuisine;
    //let hashPassword = bcrypt.hashSync(password, saltRounds);
    const ownerQuery = "SELECT ownerName, ownerEmail, ownerPhone, ownerImage, restaurantName, restaurantImage, cuisine FROM owner_login WHERE ownerName IN ( '"+ ownerName + "')";
    console.log(ownerQuery); 
    connection.query(ownerQuery, [ownerName, ownerEmail, ownerImage, ownerPhone, restaurantName, restaurantImage, cuisine] ,(error, results, fields) =>{
        if(!!error){
            console.log(ownerName);
            
            console.log('Error in query');
            res.statusCode = 500;
            return res.json({errors: ["cannot insert the user details"]});
        } else{
            console.log('successfull query');
            console.log(results);
            return res.json(results);
        }
      });


});

//Route to handle post Request call for ownerProfile
app.post('/ownerProfile', function(req, res){

    console.log("Inside the ownerProfile Post Request");
    console.log("Req Body :", req.body);
    let ownerName = req.body.ownerName;
    let ownerEmail = req.body.ownerEmail;
    let ownerPhone = req.body.ownerPhone;
    let ownerImage = req.body.ownerImage;
    let restaurantName = req.body.restaurantName;
    let restaurantImage = req.body.restaurantImage;
    let cuisine = req.body.cuisine;
    //let hashPassword = bcrypt.hashSync(password, saltRounds);
    const ownerQuery = "UPDATE owner_login SET ownerName = '"+ ownerName +"', ownerEmail = '"+ ownerEmail + "', ownerPhone = '"+ ownerPhone + "', ownerImage = '" + ownerImage + "', restaurantName = '"+ restaurantName + "', restaurantImage = '"+ restaurantImage + "', cuisine = '"+ cuisine + "' WHERE ownerName IN ( '"+ ownerName + "')";
    console.log(ownerQuery); 
    connection.query(ownerQuery, [ownerName, ownerEmail, ownerImage, ownerPhone, restaurantName, restaurantImage, cuisine] ,(error, results, fields) =>{
        if(!!error){
            console.log(ownerName);
            
            console.log('Error in query');
            res.statusCode = 500;
            return res.json({errors: ["cannot insert the user details"]});
        } else{
            console.log('successfull query');
            console.log(results);
            return res.json(results);
        }
      });
});



//Route to handle Post Request call for ownerRegister
app.post('/ownerRegister', function(req, res){

    console.log("Inside the ownerRegister Request");
    console.log("Req Body :", req.body);
    let ownerName = req.body.ownerName;
    let ownerPassword = req.body.ownerPassword;
    let ownerEmail = req.body.ownerEmail;
    let restaurantName = req.body.restaurantName;
    let restaurantZipcode = req.body.restaurantZipcode;
    //let hashPassword = bcrypt.hashSync(password, saltRounds);
    const ownerRegQuery = "INSERT INTO owner_login (ownerName, ownerEmail, ownerPassword, restaurantName, restaurantZipcode) VALUES ('"+ ownerName +"', '"+ownerEmail + "', '"+ ownerPassword +"', '"+restaurantName+"', '"+restaurantZipcode+"')"; 
    console.log(ownerRegQuery);
    connection.query(ownerRegQuery, [ownerName, ownerEmail, ownerPassword, restaurantName, restaurantZipcode] ,(error, results, fields) =>{
        if(!!error){
            //console.log(userName);
            console.log('Error in query');
            res.statusCode = 500;
            return res.json({errors: ["cannot insert the user details"]});
        } else{
            console.log('successfull query');
            console.log(res.rows);
            return res.json();
        }
      });


});


//Route to get All Books when user visits the Home Page
app.get('/home', function(req,res){
    console.log("Inside Home Login");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    console.log("Books : ",JSON.stringify(books));
    res.end(JSON.stringify(books));
    
})

//backend for creating a book
app.post('/create', function(req,res){
    console.log("Inside the create");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    let newcreate = {
        BookID: req.body.BookID,
        Title: req.body.Title,
        Author: req.body.Author
    }
    books.push(newcreate);
    res.end();
})

//backend for deleting a book
app.post('/delete', function(req,res){
    console.log("Inside the create");    
    res.writeHead(200,{
        'Content-Type' : 'application/json'
    });
    for(let i=0; i<books.length; i++){
        if(books[i].BookID === req.body.BookID){
            books.splice(i,1);
        }
    }
    res.end();
})

//start your server on port 3001
app.listen(3001);
console.log("Server Listening on port 3001");