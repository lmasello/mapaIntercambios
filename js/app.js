var mymap = L.map('mapid').setView([20.737, -23.923], 3);
L.mapbox.accessToken = 'pk.eyJ1IjoibG1hc2VsbG8iLCJhIjoiY2lwNTh1ZjdsMDAxNXc3a3NxdXc2b2c3ZCJ9.cVbV5tXbHcDIu8P2psRCrQ';
L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 16,
    minZoom: 3
}).addTo(mymap);

var markers = L.mapbox.featureLayer()
    .setGeoJSON(alumnos);

function makeGroup(){
  var clusterGroup = new L.MarkerClusterGroup();
  mymap.addLayer(clusterGroup);
  return clusterGroup;
};

// create a marker cluster group for each type of country
var groups = {
  "czechRep": makeGroup(),
  "spain": makeGroup(),
  "france": makeGroup(),
  "bra": makeGroup(),
  "it": makeGroup(),
};

var universityToCountry = {
  "UTCP- PRAGA": "czechRep",
  "UPC-ETSEIB": "spain",
  "UPC-EUETIB": "spain",
  "UPC-FIB": "spain",
  "EC PARIS": "france",
  "INSA LYON": "france",
  "USP (SAN PABLO)": "bra",
  "TELECOM BRETAGNE": "france",
  "U BOLONIA": "it",
  "UE - GENOVA": "it",
  "UP MADRID": "spain",
  "UPV": "spain"
}

markers.eachLayer(function(layer) {
  var universidad = layer.feature.properties.universidad;
  var country = universityToCountry[universidad];
  groups[country].addLayer(layer);
});


$('.menu-ui a').on('click', function() {
    // For each filter link, get the 'data-filter' attribute value.
    var filter = $(this).data('filter');
    $(this).addClass('active').siblings().removeClass('active');
    for (var i=0; i<groups.length; i++)
      mymap.removeLayer(groups[i]);

    markers.eachLayer(function(layer) {
        var universidad = layer.feature.properties.universidad;
        var country = universityToCountry[universidad];
        groups[country].removeLayer(layer);
        if (filter === 'all')
          groups[country].addLayer(layer);

        else if (filter in layer.feature.properties)
          if (layer.feature.properties[filter] === true)
            groups[country].addLayer(layer);
    });
});
