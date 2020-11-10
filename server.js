const express = require('express');
const expbhs = require('express-handlebars');
const path = require('path');
const routes = require(path.join(__dirname, './routes/routing'));
const app = express();
const PORT = process.env.PORT || 3000;

//Set handlebars as viewing engine
app.engine('handlebars', expbhs({ defaultLayout: 'main '}));
app.set('view engine', 'handlebars');

//Middleware for data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Contents of public folder are staticly served
app.use(express.static('public'));

app.use(routes);