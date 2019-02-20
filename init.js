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
    companies_bulk.push(
        {"index":{"_index":"companies","_id":id,"_type":"_doc"}},
        company
    );
});

let CompaniesBody = {
    mappings: {
        _doc: {
            properties: {
                coord: {type: "geo_point"},
                industry: {
                    type: "text",
                    fielddata: true,
                    fields: {
                        keyword: {
                            type: "keyword",
                            ignore_above: 256
                        }
                    }
                }
            }
        }
    }
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
                //console.log(resp);


            //Création de l'index employees
            let employeesJson = JSON.parse(fs.readFileSync('sources/employees.json', 'utf8'));
            let employeesBulk = new Array();
            employeesJson.forEach((employee)=>{
                let id = employee.id;
                delete employee.id;

                //Ajout du nom de la société actuelle

                let query = {
                    index: "companies",
                    type: "_doc",
                    id: employee.current_company
                };
                client.get(query, function (error, response,status) {
                    if (error){
                        console.log("search error: "+error)
                    }
                    else {
                        if (response.found){
                            let company = {
                                id: response._id,
                                name: response._source.company,
                                industry: response._source.industry,
                                coord: response._source.coord
                            }
                            delete employee.current_company;
                            employee.company = company;
                        }
                    }
                });


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
                            company: {
                                properties: {
                                    coord: {type: "geo_point"},
                                    id: {
                                        type: "text",
                                        fields: {
                                            keyword: {
                                                type: "keyword",
                                                ignore_above: 256
                                            }
                                        }
                                    },
                                    industry: {
                                        type: "text",
                                        fields: {
                                            keyword: {
                                                type: "keyword",
                                                ignore_above: 256
                                            }
                                        }
                                    },
                                    name: {
                                        type: "text",
                                        fields: {
                                            keyword: {
                                                type: "keyword",
                                                ignore_above: 256
                                            }
                                        }
                                    }
                                }
                            },
                            job_title: {
                                type: "text",
                                fielddata: true,
                                fields: {
                                    keyword: {
                                        type: "keyword",
                                        ignore_above: 256
                                    }
                                }
                            }
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
                    //console.log(resp);

                    client.bulk({
                        body: employeesBulk
                    }, function (err, resp) {
                        if (err){
                            console.log(err);
                        }
                        else{
                            //console.log(resp);

                        }
                    });
                }
            });

            }
            });
    }
});