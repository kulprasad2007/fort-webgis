var map = L.map("map",
 {
      center: [19.39290, 75.88915],
      zoom: 7,
      zoomControl: false,
});
var baselayers, overlays;
map.setView([19.39290, 75.88915], 7);

var googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

//Openstreet Map

var openopenStreetMap = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}",
  {
    foo: "bar",
    maxZoom: 20,
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }
);

//Openstreet mini Map

var openopenStreetminiMap = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}",
  {
    foo: "bar",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> <a href="https://www.prasadkulkarni.in/">Prasad Kulkarni</a>',
  }
);
//CartoDb Map

var CartoDB_Positron = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 20,
  }
).addTo(map);


// scale
L.control
  .scale({ position: "bottomleft", maxWidth: 200, imperial: false })
  .addTo(map);

//zoom control
L.control.zoom({ position: "topright" }).addTo(map);

  //layer control
baselayers = {
  "Carto DB": CartoDB_Positron,
  "Open Street MAp": openopenStreetminiMap,
  "Google Street": googleStreets,
};
var control_layers = L.control.layers(baselayers, overlays).addTo(map);

var india_map = L.geoJSON.ajax("./data/india_map.geojson", {
  style: function (feature) {
    return {
      color: "#ced4da",
      fillColor: "#fff",
      weight: 2,
       fillOpacity: 0.5,
    };
  },
}).addTo(map);


var maha_map = L.geoJSON.ajax("./data/maha_map.geojson", {
  style: function (feature) {
    return {
      color: "orange",
      fillColor: "#fff",
      weight: 2,
       fillOpacity: 0.5,
    };
  },
}).addTo(map);

  // Add the fort layer to the layer control
  control_layers.addOverlay(maha_map, "Maharashtra Map");

// Add custom icon for forts
var fortIcon = L.icon({
  iconUrl: "./images/fort.png", // Ensure the correct path to your custom icon
  iconSize: [30, 50], // Size of the icon
  iconAnchor: [15, 30], // Anchor point of the icon
  popupAnchor: [0, -30], // Popup position relative to the icon
});

var fort = L.geoJSON
  .ajax("./data/fort.geojson", {
    pointToLayer: function (feature,latlng) {
      return style_fort(feature,latlng);
    },
    onEachFeature: process_fort,
  })
  .addTo(map);


  function style_fort(feature,latlng) {
  var icon = L.icon({
      iconUrl: "images/fort.png",
      iconSize: [30, 30],
      iconAnchor: [10, 10],
      popupAnchor: [0, 0],
    });

    return L.marker(latlng, { icon: icon });
  }
  
  function process_fort(feature, layer) {
    var att_fort = feature.properties;
    layer.bindPopup(
      "Fort Name: " + att_fort.name + "<br>नाव: " + att_fort.name_marathi
    );
  }


  var credits = L.controlCredits({
    imageurl: './images/logo_map.png',
    imagealt: 'credits',
    tooltip: 'Made by Prasad Kulkarni',
    width: '50px',
    height: '50px',
    expandcontent: 'Interactive Map<br/>by <a href="https://www.prasadkulkarni.in/" target="_blank">Prasad Kulkarni</a>'
  }).addTo(map);

// Create a separate layer for the labels
var labelLayer = L.geoJSON.ajax("./data/fort.geojson", {
  pointToLayer: function (feature, latlng) {
    if (feature.properties && feature.properties.name) {
      return L.marker(latlng, {
        icon: L.divIcon({
          className: "fort-label-container", // Custom class for the label container
          html: `<div class="fort-label">${feature.properties.name}</div>`,
          iconSize: [100, 20], // Adjust the size to fit the label
          iconAnchor: [50, -20], // Center the label above the point
        }),
      });
    }
  },
}).addTo(map);

// Add the label layer to the layer control
control_layers.addOverlay(labelLayer, "Fort Labels");







