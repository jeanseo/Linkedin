
module.exports = {
    addEmployeePage: (req, res) => {
        res.render('add-employee.ejs', {
            title: 'Linquedine | Add new employee'
            , message: ''
        });
    },
    editEmployeesPage: (req, res) => {
        //TODO Gérer les notes, et les coordonnées géographiques, ainsi que le type de cuisine en tags
        let employeeId = req.params.id;
        let query = {
            index: "employees",
            type: "_doc",
            id: employeeId
        };
        const client = require('../connection.js');
        client.get(query, function (error, response,status) {
            if (error){
                console.log("search error: "+error)
            }
            else {
                if (response.found){
                    let companiesList = Array();
                    if(!Array.isArray(response._source.previous_companies)){
                        companiesList.push(response._source.previous_companies);
                    } else {
                        companiesList = response._source.previous_companies;
                    }
                    res.render('edit-employee.ejs', {
                        title: 'Linquedine | Edit employee'
                        ,employee: response._source
                        ,companiesList: companiesList
                        ,message: ''
                    });
                }
            }
        });
    },
    editEmployees: (req, res) => {
        let first_name = req.body.first_name;
        let last_name = req.body.last_name;
        let age = req.body.age;
        let job_title = req.body.job_title;
        let email = req.body.email;
        let phone = req.body.phone;
        let registered = req.body.registered;
        let picture = req.body.picture;
        let about = req.body.about;
        let companyId = req.body.companyId;
        let companyName = req.body.companyName;
        let ids = req.body.id;
        let old_job_title = req.body.old_job_title;
        let employeeId = req.params.id;

        //Recuperation des anciennes sociétés dans un tableau
        let old_jobs=[];
        if (ids!=null && old_job_title!=null){
            if (!Array.isArray(req.body.id)) {
                old_jobs = {
                    id: ids,
                    old_job_title: old_job_title
                };
            }else{
                req.body.id.forEach((id, index) => {
                    old_jobs[index] = {
                        id: ids[index],
                        job_title: old_job_title[index]
                        };
                });
            }
        }
        const client = require('../connection.js');
        if(employeeId!==undefined){
            //update
            let query = {
                "doc":{
                    "name.first" : first_name,
                    "name.last" : last_name,
                    "age" : age,
                    "job_title" : job_title,
                    "email" : email,
                    "phone" : phone,
                    "registered" : registered,
                    "picture" : picture,
                    "about" : about,
                    "company.id" : companyId,
                    "company.name" : companyName,
                    "previous_companies" : old_jobs
                }
            };

            client.update({
                index: 'employees',
                type: "_doc",
                id:employeeId,
                body: query
            },function(err,resp,status) {
                console.log(resp);
                //return res.status(500).send(err);
            });
        }else{
            //ajout
            let query = {
                "address": {
                    "building":building,
                    "street" : street,
                    "zipcode" : zipCode
                },
                "borough": borough,
                "cuisine": cuisine,
                "name" : name,
                "grades" : old_jobs

            };

            client.index({
                index: 'employees',
                type: '_doc',
                body: query
            },function(err,resp,status) {
                console.log(resp);
                //return res.status(500).send(err);
            });
        }

        res.redirect('/admin/employees');

    },

    deleteEmployee: (req, res) => {
        let employeeId = req.params.id;
        const client = require('../connection.js');
        client.delete({
            index: 'employees',
            type: "_doc",
            id: employeeId
        }, function (error, response) {
            console.log(response);
            return res.status(500).send(error);
        });
        res.redirect('/admin/employees');
    },

    getCuisineList: (req, res) => {
        const client = require('../connection.js');
        console.log("request "+JSON.stringify(req.query.term));
        let body = {
            aggs: {
                cuisines : {
                    terms : {
                        field : "cuisine",
                        include : req.query.term+".*",
                        size: 5
                    }
                }
            },
            size : 0
        };
        client.search({
                index: 'employees',
                type: '_doc',
                body: body
            },function (error, response,status){
                if(error){
                    console.log("search error: "+error);
                }else {
                    rawCuisinesList = response.aggregations.cuisines.buckets;
                    let cuisinesList = [];
                    rawCuisinesList.forEach((cuisine)=>{
                       cuisinesList.push(cuisine.key);
                    });
                    res.send(cuisinesList) ;
                }

            }
        );
    }
};