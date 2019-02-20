module.exports = {
    searchIndex: (req, res) => {
        //Requête de récupération des types de cuisine
        let client = require('../connection.js');
        client.search({
            index: 'restaurants',
            type: '_doc',
            body: {
                "aggs": {
                    "cuisine_bucket": {
                        "terms": {
                            "field": "cuisine",
                            "size": 15
                        }
                    },
                    "borough_bucket": {
                        "terms": {
                            "field": "borough.raw"
                        }
                    },
                },
                "size": 0
            }
            },function (error, response,status){
                console.log(response);
                if(error){
                    console.log("search error: "+error)
                }else {
                    res.render('search.ejs', {
                        title: "RR - Restos Ratings | Search Restaurants",
                        cuisineList : response.aggregations.cuisine_bucket.buckets,
                        boroughList : response.aggregations.borough_bucket.buckets
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
            body.query("match","name",req.body.searchText);
        }

        //Gestion de la recherche par filtres
        if (req.body.cuisine != null){
            if (Array.isArray(req.body.cuisine)) {
                body.filter("terms","cuisine",req.body.cuisine);
            } else {
                body.filter("term","cuisine",req.body.cuisine);
            }
        }

        if (req.body.borough != null){
            if (Array.isArray(req.body.borough)) {
                body.filter("terms","borough",req.body.borough);
            } else {
                body.filter("term","borough",req.body.borough);
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
            body.andFilter("geo_bounding_box","address.coord",box);
        }


        // TODO: Gestion du tri par moyenne

        body.size(20);
        let bodyText = body.build();
        client.search({
                index: 'restaurants',
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
