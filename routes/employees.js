
module.exports = {
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
    let name = req.body.name;
    let cuisine = req.body.cuisine;
    let building = req.body.building;
    let street = req.body.street;
    let zipCode = req.body.zipcode;
    let borough = req.body.borough;
    let restaurantId = req.params.id;

    //Recuperation des notes dans un tableau
    let grades=[];
    if (req.body.grade!=null && req.body.score!=null){
        if (!Array.isArray(req.body.grade)) {
            let date=null;

            if(req.body.date===0){
                date = Date.now();
            }else{
                date =  parseInt(req.body.date);
            }
            grades={
                date: {
                    $date: date
                },
                grade: req.body.grade,
                score: req.body.score
            };

        }else{
            let date=null;
            req.body.grade.forEach((grade, index) => {
                if(req.body.date[index]===0){
                    date = Date.now();
                }else{
                    date =  parseInt(req.body.date[index]);
                }
                grades[index] = {
                    date: {
                        $date: date
                    },
                    grade: grade,
                    score: req.body.score[index]
                    };
            });
        }
    }
    const client = require('../connection.js');
    if(restaurantId!==undefined){
        let query = {
            "doc":{
                "address.building": building,
                "address.street": street,
                "address.zipcode": zipCode,
                "borough": borough,
                "cuisine": cuisine,
                "name" : name,
                "grades" : grades
            }
        };

        client.update({
            index: 'employees',
            type: "_doc",
            id:restaurantId,
            body: query
        },function(err,resp,status) {
            console.log(resp);
            //return res.status(500).send(err);
        });
    }else{
        let query = {
            "address": {
                "building":building,
                "street" : street,
                "zipcode" : zipCode
            },
            "borough": borough,
            "cuisine": cuisine,
            "name" : name,
            "grades" : grades

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