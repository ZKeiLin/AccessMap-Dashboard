'use strict'
// import mapboxgl from 'mapbox-gl';
// import DATA from './dataModel';

// Set up the map
mapboxgl.accessToken = 'pk.eyJ1IjoiemtlaSIsImEiOiJjajlic3hpeGYxajlzMnFsc3lpcmM3ZnVyIn0.stjuXAylUunlikhHKQZM-Q';
const map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v9',
center: [-122.335167, 47.608013], // starting position [lng, lat]
zoom: 14
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
    // label(crossingsWith, crossingsWithout);
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
            'base': 1.75,
            'stops': [[12, 2], [22, 180]]
            },
            'circle-color': "#3CB371"
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
              'base': 1.75,
              'stops': [[12, 2], [22, 180]]
              },
              'circle-color': "#B22222"
          }
          });
  
    });
}

function getCounty(pointsData){
$.getJSON("counties.geojson", function (data) {
    county(data);
    count(pointsData, data);
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
            'fill-color': 'rgba(200, 100, 240, 0.4)',
            'fill-outline-color': 'rgba(200, 100, 240, 1)'
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
    var count = {};
    var allPoints = points;
    allPoints.features.map(function(point){
        point.geometry.coordinates = point.geometry.coordinates[0]

    })
    console.log(allPoints);
    var ptsWithin = turf.within(allPoints, polygons);
    // districs.forEach(function(district){
    //     console.log(points.features);
    //     console.log(district);
    //     var ptsWithin = turf.within(points.features, district);
    //     // one.push(ptsWithin);
    //     count[district] = ptsWithin;        
    //     console.log(ptsWithin);
    // });
    console.log(count);
    
    
}


