import {Map} from "./node_modules/mapbox-gl/dist/mapbox-gl";

 
var map = new Map({
    container: 'map',
    zoom: 5,
    minZoom: 4,
    center: [95.899147, 18.088694],
    style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL'
});
 
map.on('load', function () {
    map.addSource('canvas-source', {
        type : 'canvas',
        canvas : 'canvasID',
        coordinates: [
            [91.4461, 21.5006],
            [100.3541, 21.5006],
            [100.3541, 13.9706],
            [91.4461, 13.9706]
        ],
        // Set to true if the canvas source is animated. If the canvas is static, animate should be set to false to improve performance.
        animate: true
    });
 
    map.addLayer({
        id: 'canvas-layer',
        type: 'raster',
        source: 'canvas-source'
    });
});