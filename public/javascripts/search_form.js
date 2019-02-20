$(document).ready( function () {
    //Initialisation
    search();
    //Initialisation de la carte
    let marker;
    L.mapquest.key = 'h7vSDMtyh7vIapJaASz9DQHmzH4Au9Od';
    let fg = L.featureGroup();
    let map = L.mapquest.map('map', {
        center: [48.853, 2.35],
        layers: [L.mapquest.tileLayer('map'),fg],
        zoom: 11
    });
    let markers = [];

    map.addControl(L.mapquest.control());


    // Recherche par du texte
    $( "#searchForm" ).submit(function( event ) {
        // Stop form from submitting normally
        event.preventDefault();
        search("form","");
    });

    //Recherche par les checkboxes
    $(":checkbox").change(function (event) {
        search("form","");
    });

    //Recherche par la carte
    $("#search-area").click(function (event){
       search("map",map.getBounds());
    });

    function search(type,coord){
        const employeeTemplate = '<li>'
            +'<h4></h4>'
            +'</li>';
        const companyTemplate = '<li>'
            +'<h4></h4>'
            +'</li>';
        if (type==="map"){
            $("#coords").val(JSON.stringify(coord));
        }else {
            $("#coords").val("");
        }
        let data = $('form').serialize();
        let $form = $( "#searchForm" ),
            url = $form.attr( "action" );
        // Send the data using post
        let posting = $.post( url, data );
        posting.done(function( data ) {
            $("#result ol").empty();
            //On supprime les anciens markers
            markers.forEach((markerToDelete)=>{
                map.removeLayer(markerToDelete);
            });
            markers=[];
            data.forEach((doc)=>{
                //Affichage des résultats
                let li;
                switch (doc._index){
                    case 'employees':
                        li=$(employeeTemplate);
                        $(li).children("h4").text(doc._source.name.first+" "+doc._source.name.last) ;
                        $("#result ol").append($(li));

                        break;
                    case 'companies':
                        li=$(companyTemplate);
                        $(li).children("h4").text(doc._source.company) ;
                        $("#result ol").append($(li));
                        markers.push(new L.marker([ doc._source.coord.lat, doc._source.coord.lon ])
                            .addTo(map)
                            .bindPopup('<strong>' + doc._source.company + '</strong><br/>' +doc._source.industry));

                        break;
                }
            });
        });
    }

});

