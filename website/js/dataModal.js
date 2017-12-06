$.getJSON("counties.geojson", function (data) {
    let DATA = data;
    DATA.features = data.features.filter(function (a) {
        return a.properties.city === "Seattle";
    });
    
    console.log(DATA);
    // count(pointsData, data);
})