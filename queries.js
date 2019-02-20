module.exports = {
    getItems: (champ,max,callback) => {
        let client = require('./connection.js');
        // client.search({
        //     index: 'employees',
        //     type: '_doc',
        //     body: {
        //         "aggs": {
        //             "cuisine_bucket": {
        //                 "terms": {
        //                     "field": champ,
        //                     "size": max
        //                 }
        //             }
        //         },
        //         "size": 0
        //     }, function(error, response, status) {
        //         console.log("coucou");
        //         if (error) {
        //             console.log("search error: " + error)
        //             return null;
        //         } else {
        //             return response;
        //         }
        //     }
        // });

    }
};