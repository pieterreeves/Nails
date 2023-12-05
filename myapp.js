var express = require('express');
var path = require('path');
var db=require('./dbConfig');

var app = express(); 
var bcrypt = require('bcrypt');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.render('home');
});

app.get('/home', function (req, res) {
	res.render('home');
});

app.get('/about', function(req, res, next) {
	res.render('about', {title: 'About'});
});

app.get('/services', function(req, res, next) {
	res.render('services', {title: 'Services'});
});

app.get('/contact', function(req, res, next) {
	var sql = `SELECT * FROM contact`;
	db.query(sql,function(err,result) {
		if (err) throw err; 
		console.log(result);		
		res.render('contact', {title: 'Contact',contactdata:result});
	}) 
});

app.get('/pricelist', function(req, res, next) {
	db.query(`SELECT * FROM pricelist;`, function (err, result) {
		if (err) throw err;
		console.log(result);
		res.render('pricelist', { title: 'xyz', pricelistData: result});
	});	
});

app.get('/bookappointment', function(req, res, next) {
	res.render('bookappointment', {title: 'Bookappointment'});
});

app.get('/login', function(req, res, next) {
	res.render('login', {title: 'Login'});
});

app.get('/createuser', function(req, res, next){
	res.render('createuser', {title: 'Create User'});
});

app.post('/createuser',async function(req, res, next){
	var name = req.body.username;
	var email=req.body.email
	var password = req.body.password;
	var hashedpassword = await bcrypt.hash(password, 10);
    var sql = `INSERT INTO users (name, email, password) VALUES ("${name}", "${email}", "${hashedpassword}")`;
	db.query(sql,  function(err, result) { 
		if(err) throw err;
		console.log('record inserted');
		res.redirect('/login');
	});
});

app.post('/bookappointment', function(req, res, next) {
	var name = req.body.name;
	var email = req.body.email;
    var contactnumber = req.body.contactnumber;
	var date = req.body.date;
	var time = req.body.time;
	var sql = `INSERT INTO bookappointment (name,email,contactnumber,date,time) VALUES ("${name}","${email}", "${contactnumber}","${date}","${time}")`;
	console.log(sql);
	db.query(sql,  function(err, result) {
		if(err) throw err;
		console.log('record inserted');
		res.redirect('/');
	});
});
	
app.post('/createuser', async function(req, res, next) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var hashedpassword = await bcrypt.hash(password, 10);
    var sql = `INSERT INTO users (name,email, password) VALUES ("${username}","${email}", "${hashedpassword}")`;
	await db.query(sql, async function(err, result) {
		if(err) throw err;
		console.log('record inserted');
		res.redirect('/');
	});
});

app.post('/login', async function(req, res, next) {
	var email = req.body.email;
	var password = req.body.password;
	var sql = `SELECT * FROM users WHERE email = "${email}"`;
	await db.query(sql, async function(err, result) {
		if (err) throw err; 
		console.log(result);
		if(result.length ==0) {
			console.log('user does not exist...........');
		}
		else {
			console.log(result);
			var hashedpassword = result[0].password;
			if(await bcrypt.compare(password, hashedpassword)) {
				console.log('User is logged in!');
				res.send(email + " is logged in!");
		}
		else {
			console.log('password incorrect!');
			res.send("password incorrect!");
		}}
	});
});

app.listen(3000);
console.log("Listening on Port 3000");
			
