module.exports = {
  listEmployees: (req, res) => {

    let client = require('../connection.js');
    //on récupère le nombre de réponses
    client.search({
      index: 'restaurants',
      type: '_doc',
      body: {
        "query": {
          "match_all" : {}
        },
        "size" : 0
      }
    },function (error, response,status) {
      if (error){
        console.log("search error: "+error)
      }
      else {
        client.search({
          index: 'restaurants',
          type: '_doc',
          body: {
            "query": {
              "match_all" : {}
            },
            "size" : response.hits.total
          }
        },function (error, response,status){
              if(error){
                console.log("search error: "+error)
              }else {
                res.render('crud.ejs', {
                  title: "RR - Restos Ratings | Edit Restaurants"
                  ,restaurants  : response.hits.hits
                });
              }
            }
        );
      }
    });
  },
};

