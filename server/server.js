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
		res.render('equipment.hbs', { category: item });
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
	// console.log("Post command received");
	// console.log("This is the category: " + req.body.category);
	// console.log("This is the title: " + req.body.product.title);
	// console.log("This is the quantity: " + req.body.product.quantity);
	// console.log("This is the description: " + req.body.product.description);

	var item = new Item({
		category: req.body.category,
		"product.title": req.body.product.title,
		quantity: req.body.product.quantity,
		"product.description": req.body.product.description
	});
	// console.log(item);

	item.save().then((doc) => {
		// console.log(doc);
		res.send(doc);
		console.log("Product sent");
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
