const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const elasticsearch = require('elasticsearch');
const path = require('path');
const app = express();
const {listEmployees} = require('./routes/employeesCrud');
const { addEmployeePage, deleteEmployee, editEmployees, editEmployeesPage, getCuisineList} = require('./routes/employees');
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
app.get('/admin/employees/add', addEmployeePage);
app.get('/admin/employees/edit/:id', editEmployeesPage);
app.get('/admin/employees/delete/:id', deleteEmployee);
app.post('/admin/employees/add', editEmployees);
app.post('/admin/employees/edit/:id', editEmployees);
app.get('/', searchIndex);
app.post('/api/search', searchActionPage);
app.get('/api/autocomplete-cuisine',getCuisineList);
// set the app to listen on the port
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});