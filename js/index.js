"use strict";

const seattleCoordinates = [-122.3321, 47.6062];

// Set up map
mapboxgl.accessToken = 'pk.eyJ1IjoiYWtrYXJoIiwiYSI6ImNqMThjNHllMTA3MXczOHFzeXZza2hpbXkifQ.W-eBkYLcQLAoZCKLGWxDgQ';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: seattleCoordinates,
    zoom: 12
});
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.GeolocateControl());

var coordinates = document.querySelector("#coordinates");
var isDragging;
var isCursorOverPoint;
var canvas = map.getCanvasContainer();
var point = {
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": seattleCoordinates
        }
    }]
};

function mouseDown() {
    if (!isCursorOverPoint) return;
    isDragging = true;
    canvas.style.cursor = 'grab';
    map.on('mousemove', onMove);
    map.once('mouseup', onUp);
}

function onMove(e) {
    if (!isDragging) return;
    let coords = e.lngLat;
    canvas.style.cursor = 'grabbing';
    point.features[0].geometry.coordinates = [coords.lng, coords.lat];
    map.getSource('point').setData(point);
}

function onUp(e) {
    if (!isDragging) return;
    let coords = e.lngLat;
    console.log(coords);
    coordinates.style.display = 'block';
    canvas.style.cursor = '';
    isDragging = false;
    map.off('mousemove', onMove);
}

map.on('load', function () {
    map.addSource('point', {
        "type": "geojson",
        "data": point
    });

    map.addLayer({
        "id": "point",
        "type": "circle",
        "source": "point",
        "paint": {
            "circle-radius": 10,
            "circle-color": "#3887be"
        }
    });

    map.on('mouseenter', 'point', function () {
        map.setPaintProperty('point', 'circle-color', '#3bb2d0');
        canvas.style.cursor = 'move';
        isCursorOverPoint = true;
        map.dragPan.disable();
    });

    map.on('mouseleave', 'point', function () {
        map.setPaintProperty('point', 'circle-color', '#3887be');
        canvas.style.cursor = '';
        isCursorOverPoint = false;
        map.dragPan.enable();
    });

    map.on('mousedown', mouseDown);
});

const INCIDENT_DATA_ENDPOINT = "https://data.seattle.gov/resource/y7pv-r3kh.geojson?$limit=8000&$$app_token=<<api_key>>";
const SODA_API_KEY = "LGR70k7tHk8BqntKzzDsELIOs";


let response;
function handleResponse(data) {
    response = data;
}

function getFloatingTimeStamp() {
    let d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}



