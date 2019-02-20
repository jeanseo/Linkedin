module.exports = {
  listEmployees: (req, res) => {

    let client = require('../connection.js');
    //on récupère le nombre de réponses
    client.search({
      index: 'employees',
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
          index: 'employees',
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
                res.render('employeesCrud.ejs', {
                  title: "Linquedine | Manage Employees"
                  ,employees  : response.hits.hits
                });
              }
            }
        );
      }
    });
  },
};

