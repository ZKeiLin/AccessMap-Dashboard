'use strict'
// import mapboxgl from 'mapbox-gl';
// import DATA from './dataModel';

// Set up the map
mapboxgl.accessToken = 'pk.eyJ1IjoiemtlaSIsImEiOiJjajlic3hpeGYxajlzMnFsc3lpcmM3ZnVyIn0.stjuXAylUunlikhHKQZM-Q';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v9',
center: [-122.335167, 47.608013], // starting position [lng, lat]
zoom: 12
});

// var bbox = turf.bbox(features);
var crossingsWith;
var crossingsWithout;
var withCurbBramp=[];
var withoutCurbBramp=[];


$.getJSON("crossings.geojson", function (data) {
    crossingsWith = data;
    crossingsWithout = data;
    let features = data.features;
    features.forEach(function (feature) {
        // console.log(feature);
        if(feature.properties.curbramps > 0){
            withCurbBramp.push(feature);
        }else{
            withoutCurbBramp.push(feature)
        }
    });

    crossingsWith =  {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": withCurbBramp
    }
    
    crossingsWithout =  {
        "type": "FeatureCollection",
        "crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
        "features": withoutCurbBramp
    }
    getCounty(crossingsWithout); 
    label(crossingsWith, crossingsWithout);
});


function label(crossingsWith, crossingsWithout){
    map.on('load', function() {        
        map.addLayer({
          id: 'crossingWith',
          type: "circle",
          source: {
            type: 'geojson',
            data: crossingsWith
          },

          paint: { 'circle-radius': {
            'base': 3,
            'stops': [[12, 3], [22, 180]]
            },
            'circle-color': "#91C79D"
        }
        });

        map.addLayer({
            id: 'crossingsWithout',
            type: "circle",
            source: {
              type: 'geojson',
              data: crossingsWithout
            },

            paint: { 'circle-radius': {
              'base': 3,
              'stops': [[12, 3], [22, 130]]
              },
              'circle-color': "#9F1328"
          }
          });
  
    });
}

function getCounty(pointsData){
$.getJSON("counties.geojson", function (data) {
    let DATA = data;
    DATA.features = data.features.filter(function (a) {
        return a.properties.city === "Seattle";
    });
    county(DATA);
    // count(pointsData, DATA);
})
}

function county(counties){
    map.addLayer({
        'id': 'nhood-layer',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': counties
        },
        'paint': {
            'fill-color': 'rgba(100, 149, 237, 0.2)',
            'fill-outline-color': 'rgba(0, 0, 128, 1)'
        }
    });

    var popup = new mapboxgl.Popup({closeButton: false,
        closeOnClick: false});
    map.on('mouseenter', 'nhood-layer', function (e) {
        map.getCanvas().style.cursor = 'pointer';
        popup.setLngLat(e.lngLat)
            .setHTML(e.features[0].properties.name)
            .addTo(map);
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', 'nhood-layer', function () {
        map.getCanvas().style.cursor = '';
        popup.remove();
    });
}



// var ptsWithin = turf.within(points, searchWithin);
function count(points, polygons){
    var allPoints = points;
    allPoints.features.map(function(point){
        point.geometry.coordinates = point.geometry.coordinates[0]
    })
    var allDis = polygons;
    allDis.features = allDis.features.slice(0);
    console.log(allDis);
   
    
    // console.log(allPoints);
    var ptsWithin = turf.within(allPoints, allDis);
    console.log("hleloo2");
    
    console.log(ptsWithin);
}


