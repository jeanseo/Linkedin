module.exports = {
    searchIndex: (req, res) => {
        //Requête de récupération des types de cuisine
        let client = require('../connection.js');
        client.search({
            index: 'companies,employees',
            type: '_doc',
            body: {
                "aggs": {
                    "industry_bucket": {
                        "terms": {
                            "field": "industry",
                            "size": 15
                        }
                    },
                    "job_title_bucket": {
                        "terms": {
                            "field": "job_title",
                            "size": 15
                        }
                    }
                },
                "size": 0
            }
            },function (error, response,status){
                console.log(response);
                if(error){
                    console.log("search error: "+error)
                }else {
                    console.log(response.aggregations.industry_bucket.buckets);
                    res.render('search.ejs', {
                        title: "Linquedine",
                        industryList : response.aggregations.industry_bucket.buckets,
                        jobTitleList : response.aggregations.job_title_bucket.buckets
                    });
                }
        });

    },
    searchActionPage: (req, res) => {
        let client = require('../connection.js');
        let bodybuilder = require('bodybuilder');
        let body = bodybuilder();
        //Gestion de la recherche par mots clés
        if (req.body.searchText !== ""){
            body.query("multi_match",{
                query: req.body.searchText+"*",
                fields: ["name.last^2","name.first","company^5","company.name^2","industry^2","company.industry","job_title^6"],
                fuzziness : "auto"
            });
        }


        //Gestion de la recherche par filtres
        if (req.body.industry != null){
            if (Array.isArray(req.body.industry)) {
                body.filter("terms","industry",req.body.industry);
            } else {
                body.filter("term","industry",req.body.industry);
            }
        }

        if (req.body.jobTitle != null){
            if (Array.isArray(req.body.jobTitle)) {
                body.filter("terms","job_title",req.body.jobTitle);
            } else {
                body.filter("term","job_title",req.body.jobTitle);
            }
        }

        //Gestion de la recherche par la carte
        if(req.body.coords!==""){
            coords = JSON.parse(req.body.coords);
            let box = {
                top_left : {
                    lat : coords._northEast.lat,
                    lon : coords._southWest.lng
                },
                bottom_right : {
                    lat : coords._southWest.lat,
                    lon : coords._northEast.lng
                }
            };
            body.andFilter("geo_bounding_box","coord",box);
        }


        let index;
        switch (req.body.index_select) {
            case  ('all'):
                index = "companies,employees";
                break;
            case ('employees'):
                index = "employees";
                break;
            case  ('companies'):
                index = "companies";
                break;
        }
        body.size(12);
        let bodyText = body.build();
        console.log(JSON.stringify(bodyText));
        client.search({
                index: index,
                type: '_doc',
                body: bodyText
        },function (error, response,status){
            if(error){
                console.log("search error: "+error)
            }else {
                res.send(response.hits.hits);
            }
        });
    },
};
