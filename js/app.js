var mymap = L.map('mapid').setView([20.737, -23.923], 3);
L.mapbox.accessToken = 'pk.eyJ1IjoibG1hc2VsbG8iLCJhIjoiY2lwNTh1ZjdsMDAxNXc3a3NxdXc2b2c3ZCJ9.cVbV5tXbHcDIu8P2psRCrQ';
L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=' + L.mapbox.accessToken, {
    attribution: '© <a href="https://www.mapbox.com/map-feedback/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 16,
    minZoom: 3
}).addTo(mymap);

var markers = L.mapbox.featureLayer()
    .setGeoJSON(alumnos);

var clusterGroup = new L.MarkerClusterGroup();
markers.eachLayer(function(layer) {
    clusterGroup.addLayer(layer);
});
mymap.addLayer(clusterGroup);

$('.menu-ui a').on('click', function() {
    // For each filter link, get the 'data-filter' attribute value.
    var filter = $(this).data('filter');
    $(this).addClass('active').siblings().removeClass('active');

    mymap.removeLayer(clusterGroup);

    markers.eachLayer(function(layer) {
        clusterGroup.removeLayer(layer);
        if (filter === 'all')
          clusterGroup.addLayer(layer);

        else if (filter in layer.feature.properties)
          if (layer.feature.properties[filter] === true)
            clusterGroup.addLayer(layer);
    });

    mymap.addLayer(clusterGroup);
});
