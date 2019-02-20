let client = require('./connection.js');

//Création de l'index Companies


let fs = require('fs');
let companiesJson = JSON.parse(fs.readFileSync('sources/companies.json', 'utf8'));
let companies_bulk = new Array();
companiesJson.forEach((company)=>{
    let id = company.id;
    let coord = {
        lat: parseFloat(company.latitude),
        lon: parseFloat(company.longitude)};
    delete company.id;
    delete company.latitude;
    delete company.longitude;
    company.coord = coord;
    console.log(company);
    companies_bulk.push(
        {"index":{"_index":"companies","_id":id,"_type":"_doc"}},
        company
    );
});
//console.log(companies_bulk);
let CompaniesBody = {
    mappings: {
        _doc:{
            properties:{
            coord: {type : "geo_point"}
            }
        }}
};
client.indices.create({
        index:"companies",
        body:CompaniesBody
    },function (err, resp) {
    if (err){
        console.log(err);
    }
    else{
        console.log(resp);

            client.bulk({
            body: companies_bulk
        }, function (err, resp) {
            if (err){
                console.log(err);
            }
            else{
                console.log(JSON.stringify(resp));
            }
        });
    }
});

//Création de l'index employees
let employeesJson = JSON.parse(fs.readFileSync('sources/employees.json', 'utf8'));
let employeesBulk = new Array();
employeesJson.forEach((employee)=>{
    let id = employee.id;
    delete employee.id;
    employeesBulk.push(
        {"index":{"_index":"employees","_id":id,"_type":"_doc"}},
        employee
    );
});
//console.log(JSON.stringify(employeesBulk));
let employeesBody = {
    mappings: {
        _doc:{
            properties:{

            }
        }}
};
client.indices.create({
    index:"employees",
    body:employeesBody
},function (err, resp) {
    if (err){
        console.log(err);
    }
    else{
        console.log(resp);

        client.bulk({
            body: employeesBulk
        }, function (err, resp) {
            if (err){
                console.log(err);
            }
            else{
                console.log(JSON.stringify(resp));
            }
        });
    }
});

