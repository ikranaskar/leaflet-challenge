var myMap = L.map("map", {
  center: [17, 8],
  zoom: 2
});

var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});


  // Create a baseMaps
  var baseMaps = {
      "Street Map": street,
      "Topographic": topo
  };

  L.control.layers(baseMaps).addTo(myMap);

// store json as queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";


// Perform a get request to the query url
d3.json(queryUrl).then(function (data) {
  var coord = data.features;

  function getColor(magnitude) {
      if (magnitude > 5) {
        return "##000000";
      }
      if (magnitude > 4) {
        return "#ff0000";
      }
      if (magnitude > 3) {
        return "#ffa07a";
      }
      if (magnitude > 2) {
        return "#ffaffa";
      }
      if (magnitude > 1) {
        return "#d4ee00";
      }
      return "#98ee00";
    }
  
  for (var i = 0; i < coord.length; i++) {
      var lat = coord[i].geometry.coordinates[0];
      var lon = coord[i].geometry.coordinates[1];
      var size = coord[i].properties.mag;
      var place = coord[i].properties.place;
      var both = [lat, lon];
      var color1 = coord[i].properties.mag;
      L.circle(both, {
          fillOpacity: .5,
          color: " ",
          fillColor: getColor(color1),
          radius: size * 17000
      }).bindPopup(`<h3>${place}</h3>`).addTo(myMap);
  }

  let legend = L.control({
      position: "bottomright"
  });

  legend.onAdd = function () {
      let div = L.DomUtil.create("div", "info legend");
      const magnitudes = [0, 1, 2, 3, 4, 5];
      const colors = [
          "#98ee00",
          "#d4ee00",
          "#eecc00",
          "#ee9c00",
          "#ea822c",
          "#ea2c2c"
      ];

      for (var i = 0; i < magnitudes.length; i++) {
          console.log(colors[i]);
          div.innerHTML +=
            "<i style='background: " + colors[i] + "'></i> " +
            magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
        }
        return div;
      
  }
  legend.addTo(myMap);


  // createFeatures(data.features);
});

var tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";

d3.json(tectonic).then(function (tect){
  L.geoJson(tect,{
  color: "orange",
  weight:2
  }).addTo(myMap);
});

