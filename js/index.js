"use strict";

const seattleCoordinates = [-122.3321, 47.6062];

let state = {
    currCoords: seattleCoordinates
}

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

const INCIDENT_DATA_ENDPOINT = "https://data.seattle.gov/resource/y7pv-r3kh.geojson?$limit=20000&$where=year>=2016 ";
const SODA_API_KEY = "LGR70k7tHk8BqntKzzDsELIOs";

document.querySelector("#slider").addEventListener("input", function() {
    state.inputWindow = this.value;
    let text = "Selected Time: " + this.value + ":00:00 ";
    this.value < 12 ? text += "AM" : text += "PM";
    document.querySelector("#time").textContent = text;
})

function updateQuery() {
    let radiusParam = "AND within_circle(location, " + state.currCoords.lat + ", " + state.currCoords.lng + ", " + 2000 + ")";
    let apiKeyParam = "&$$app_token=<<api_key>>";
    let query = INCIDENT_DATA_ENDPOINT + radiusParam + apiKeyParam;
    query = query.replace("<<api_key>>", SODA_API_KEY);
    return query;
}

function getCounts(data) {
    let result = {};
    data.forEach(function (incident) {
        let offense = incident.properties.offense_type;
        if (result.hasOwnProperty(offense)) {
            result[offense] = result[offense] + 1;
        } else {
            result[offense] = 1;
        }
    });
    return result;
}

function plot(xValues, yValues) {
    let img = new Image();
    img.src = "./img/palette.png";
    let ctx = document.querySelector("#breakdown").getContext('2d');
    let pattern = ctx.createPattern(img, 'repeat');

    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xValues,
            datasets: [{
                label: '# of Incidents',
                data: yValues,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
    console.log(labels);
    console.log(values);
}

function sendRequest(query) {
    $.get(query).done(function (response) {
        processData(response);
    });
}

// 2017-11-28T06:36:00.000
function processData(data) {
    let totalIncidents = data.features.length;
    let date = new Date();
    if (state.inputWindow < 10) {
        let temp = "0" + state.inputWindow;
        state.inputWindow = parseInt(temp, 10);
    }
    let window = state.inputWindow !== undefined ? state.inputWindow : date.getHours();
    let toVisualize = [];
    data.features.forEach(function (incident) {
        let time = incident.properties.occurred_date_or_date_range_start.substring(11);
        let hour = time.substring(0, 2);
        if (parseInt(hour, 10) === window) {
            toVisualize.push(incident);
        }
    })
    let score = Math.round(((toVisualize.length / totalIncidents) * 100) * 100) / 100;

    let div = document.createElement("div");
    let heading = document.createElement("p");
    heading.textContent = "Incident Score";
    heading.classList.add("lead");

    let p = document.createElement("p");
    p.textContent = score + "%";
    p.classList.add("text-secondary", "font");

    let breakdown = document.createElement("button");
    breakdown.textContent = "Breakdown";
    breakdown.classList.add("btn", "btn-info");
    breakdown.setAttribute("data-toggle", "modal");
    breakdown.setAttribute("data-target", "#chart");

    let time;
    if (state.inputWindow === undefined) {
        time = date.toLocaleTimeString();
    } else {
        time = window + ":00:00 ";
        if (state.inputWindow < 12) {
            time += "AM";
        } else {
            time += "PM";
        }
    }
    document.querySelector("#modalTitle").textContent = "Incidents Breakdown Around " + time;

    breakdown.addEventListener("click", function () {
        let counts = getCounts(toVisualize);
        plot(Object.keys(counts), Object.values(counts));
    });

    div.appendChild(heading);
    div.appendChild(p);
    div.appendChild(breakdown);

    let popup = new mapboxgl.Popup({ closeOnClick: true });
    popup.setLngLat([state.currCoords.lng, state.currCoords.lat]);
    popup.setDOMContent(div);
    popup.addTo(map);
}

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
    state.currCoords = coords;
    let query = updateQuery();
    sendRequest(query);
    coordinates.style.display = 'block'; // TODO: Remove later -- not doing anything
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

function getFloatingTimeStamp() {
    let d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}



