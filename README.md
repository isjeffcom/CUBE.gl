# CUBE.gl

CUBE.gl is a geospatial data visualization framework that allows data analytics to visualize large-scale geo-related datasets or creating digital twin in a few line of code. The CUBE.gl is built upon the three.js.


## Features

- Visualize numeric data by cylinder, arc, text etc.

- Visualize datasets by point cloud and heatmap.

- Visualize geographic data by buildings, roads, terrain, tile map, administrative geojson and custom polygon.

- Load model and attach other object, eg. THREE.Light.

- Create animation by WGS84 coordinate path (eg. vehicle) or simply circular around something (eg. satellite).

-  Attach shader to an object to create visual effects.

## Install



### by CDN

Simply add this line in your .HTML file.

```html
<script src="https://unpkg.com/cube.gl@latest/dist/cube.js"></script>
```



### by NPM

By importing the project from NPM module system, you need to install node.js. Open a terminal, direct to your project folder, execute following command:

`npm i cube.gl`



[Developer Guide](https://isjeffcom.github.io/CUBE.gl-doc)



## Hello World



### Create first scene



1. Create a div block with id in HTML:

```html
<div id="container" style="position: absolute; width: 100%; height: 100%;"></div>
```



2. Write following code

```javascript
// Get target container
const container = document.getElementById('container')

// Init CUBE instance
const C = new CUBE.Space(container, {
	background: "333333", // Set Background Color
	center: {latitude: 34.710554, longitude: 103.699520}, // Set a geo location center
	scale: .002, // Set a map scale
	camera:{
		position: {x: 5, y: 5, z: 5} // Set camera default position
	}
})

// Add a basic box with wgs84 coordinate
const posi = new CUBE.Coordinate("GPS", {latitude: 34.710554, longitude: 103.699520}).ComputeWorldCoordinate()
const box = C.Add(new CUBE.Shapes("Box", posi.world).Box(1))
box.position.y = 1

// Animate scene every frame
Update()
function Update(){
    requestAnimationFrame(Update)
    C.Runtime()
}
```

*The scale is set to 0.002 because we are going to load a administrative map for an whole country in the next step, set it to 5-10 if you want to visualize in city / street level.*



Run your project, you will see a green cube placed in the middle of your screen as the coordinate is equal to the center coordinate.



![example-1](./assets/use/example-1.png)



3. Now let's explore more. Add the following line **before Update()**

```javascript
// Add Geojson Map Layer
const china = 'https://gistcdn.githack.com/isjeffcom/787220f51465c8365b4ccc7247a919e7/raw/1afd3f92f64d8dd01534b6831d65de395f07b43e/china.geojson'
fetch(china).then(async (res)=>{
    C.Add(new CUBE.GeoJsonLayer("china", await res.json()).AdministrativeMap({border: true, height: .5}))
})

// Add an cylinder bar at Shanghai City Center
const shanghai = {latitude: 31.230689, longitude: 121.473723}
const bar = new CUBE.Data("shanghai").Cylinder(shanghai, 150, 40, .5, 0xff6600)
C.Add(bar)
```

*If the .geojson file fail to request, download it from [here](https://gist.github.com/isjeffcom/787220f51465c8365b4ccc7247a919e7) * 



Run your project, you will see an administrative map of China display in the center, with a cylinder bar and... Great. You have finished your first project.



![example-2](./assets/use/example-2.png)



