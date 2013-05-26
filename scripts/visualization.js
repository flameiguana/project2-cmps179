console.log("Loaded");

var WIDTH = 400;
var HEIGHT = 400;

var VIEW_ANGLE = 45;
var ASPECT = WIDTH/HEIGHT;
var NEAR = 0.1;
var FAR = 1000;


//Change this to support Safari
var renderer = new THREE.WebGLRenderer();
var camera = new THREE.PerspectiveCamera (
	VIEW_ANGLE,
	ASPECT,
	NEAR,
	FAR);

var radius = 50, segments = 16, rings = 16;
var sphereGeometry = new THREE.SphereGeometry(radius, segments, rings);
var sphereMaterial = new THREE.MeshLambertMaterial(
	{
		color: 0xCC0000 
	});

var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

var pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.x = 10;
pointLight.position.y = 50;
pointLight.position.z = 130;

var scene = new THREE.Scene();
scene.add(camera);
scene.add(sphere);
scene.add(pointLight);
camera.position.z = 300;

renderer.setSize(WIDTH, HEIGHT);

var $canvas = $('#canvas');
$canvas.append(renderer.domElement);

//---------------Render Stuff-----------------
//Get the browser specific animation frame var.
var requestAnimationFrame = window.requestAnimationFrame ||  window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

//set it to a variable with same name across browsers
window.requestAnimationFrame = requestAnimationFrame;

//This function calls itself when browser is ready to animate
function renderScene(){
	renderer.render(scene, camera);
	requestAnimationFrame(renderScene);
	//console.log("hi");
}

//Start the render loop.
requestAnimationFrame(renderScene);
