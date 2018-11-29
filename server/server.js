var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

const hbs = require('hbs');
const fs = require('fs');

// var {mongoose} = require('./db/mongoose');
// var {Todo} = require('./models/todo');
// var {User} = require('./models/user');

const port = process.env.PORT || 3000;
var app = express();
console.log(__dirname);

hbs.registerPartials(__dirname + '/../views/partials')
app.set('view engine', 'hbs');

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.');
		}
	});
	next();
});

app.use(express.static(__dirname + '/../public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear()
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get('/', (req, res) => {
	res.render('home.hbs');
});

app.get('/about', (req, res) => {
	res.render('about.hbs');
});

app.get('/equipment', (req, res) => {
	res.render('equipment.hbs');
});

app.get('/portfolio', (req, res) => {
	res.render('portfolio.hbs');
});

app.get('/blog', (req, res) => {
	res.render('blog.hbs');
});

// Getting Blog post by ID soon

// // app.get('/blog/:id', (req, res) => {
//
// })

app.all('*', function(req, res) {
  res.render("error.hbs");
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = {app};
