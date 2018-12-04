const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const hbs = require('hbs');
const fs = require('fs');

var {mongoose} = require('./db/mongoose');
var {Item} = require('./models/item');

const port = process.env.PORT || 3000;
var app = express();
// console.log(__dirname);

app.use(bodyParser.json());

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

app.get('/equipment', (req, res, next) => {
	Item.find(function(err, item) {
		res.render('equipment.hbs', { categories: item });
	});

});

app.get('/portfolio', (req, res) => {
	res.render('portfolio.hbs');
});

app.get('/blog', (req, res) => {
	res.render('blog.hbs');
});

// POST ROUTES

app.post('/equipment', (req, res) => {
	console.log("Post command received");
	console.log(req.body);
	var item = new Item({
		title: req.body.title,
		quantity: req.body.quantity,
		category: req.body.category,
		description: req.body.description
	});

	item.save().then((doc) => {
		res.send(doc);
	}, (e) => {
		res.status(400).send(e);
	});
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
