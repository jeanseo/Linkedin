const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const path = require('path');
const app = express();
const {listEmployees} = require('./routes/crud');
const { addRestaurant, addRestaurantPage, deleteRestaurant, editRestaurant, editRestaurantPage, getCuisineList} = require('./routes/restaurants');
const {searchIndex, searchActionPage} = require('./routes/search');
const port = 3000;

// create connection to elastic search
let client = require('./connection.js');

// configure middleware
app.set('port', process.env.port || port); // set express to use this port
app.set('views', __dirname + '/views'); // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public'))); // configure express to use public folder
app.use(fileUpload()); // configure fileupload

// routes for the app

app.get('/admin/employees', listEmployees);
app.get('/add', addRestaurantPage);
app.get('/edit/:id', editRestaurantPage);
app.get('/delete/:id', deleteRestaurant);
app.post('/add', editRestaurant);
app.post('/edit/:id', editRestaurant);
app.get('/', searchIndex);
app.post('/api/search', searchActionPage);
app.get('/api/autocomplete-cuisine',getCuisineList);
// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});