// Initialize the map
let map = L.map('map').setView([20, 0], 2);

// Add the tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 18,
}).addTo(map);

// Fetch the earthquake data from the USGS GeoJSON feed
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(data => {
  // Function to determine marker size based on earthquake magnitude
  function getRadius(magnitude) {
    return magnitude ? magnitude * 4 : 1;
  }

  // Function to determine marker color based on earthquake depth
  function getColor(depth) {
    return depth > 90 ? '#ff5f65' :
           depth > 70 ? '#fca35d' :
           depth > 50 ? '#fdb72a' :
           depth > 30 ? '#f7db11' :
           depth > 10 ? '#dcf400' :
                        '#a3f600';
  }

  // Add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: function(feature) {
      return {
        radius: getRadius(feature.properties.mag),
        fillColor: getColor(feature.geometry.coordinates[2]),
        color: '#000',
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8
      };
    },
    onEachFeature: function(feature, layer) {
      layer.bindPopup(`<h3>Magnitude: ${feature.properties.mag}</h3><hr><p>Location: ${feature.properties.place}</p><p>Depth: ${feature.geometry.coordinates[2]}</p>`);
    }
  }).addTo(map);

  // Add legend to the map
  let legend = L.control({ position: 'bottomright' });

  legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += '<h4>Depth</h4>';

    for (let i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
  };

  legend.addTo(map);
});
