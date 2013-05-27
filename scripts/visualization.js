console.log("Loaded"); 

var $container = $('#container');
var cw = $container.width();
//Set container height to width
//16:9 aspect ratio
$container.css({'height': (cw * .5625) +'px'});

var WIDTH = $container.width();
var HEIGHT = $container.height();
var mouseX = 0; 
var mouseY = 0;

var VIEW_ANGLE = 45;
var ASPECT = WIDTH/HEIGHT;
var NEAR = 0.1;
var FAR = 1000;


/*-------------Set up scene essentials --------------- */

//Change this to support Safari
var renderer = new THREE.WebGLRenderer();

var camera = new THREE.OrthographicCamera ( 
	WIDTH/ -2, 
	WIDTH/2, 
	HEIGHT /2, 
	HEIGHT / -2,
	NEAR,
	FAR);

var scene = new THREE.Scene();

/* ------------Set up geometry*-----------------------*/
var color = 0x0000C0;
var platform = new baseChunk(80, color, "img/pop.jpg", "Hip Hop");
scene.add(platform);

/*-----------------Lighting--------------------*/
var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
directionalLight.position.set(0, 1, 0);

hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 0.75, 1 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 1 );


scene.add(camera);
scene.add(hemiLight);
scene.add(new THREE.AmbientLight( 0x00010 ) );
scene.add(directionalLight);
camera.position.z = 300;

renderer.setSize(WIDTH, HEIGHT);
$container.append(renderer.domElement);

//---------------Render Stuff-----------------

//Get the browser specific animation frame var.
var requestAnimationFrame = window.requestAnimationFrame ||  window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

//set it to a variable with same name across browsers
window.requestAnimationFrame = requestAnimationFrame;

//This function calls itself when browser is ready to animate
function renderScene(){

	platform.rotation.y = mouseX * 0.005;
    platform.rotation.x = mouseY * 0.005;

	renderer.render(scene, camera);
	requestAnimationFrame(renderScene);
	//console.log("hi");
}

//Start the render loop.
requestAnimationFrame(renderScene);

/*Handle various keyboard clicks*/

document.addEventListener('keydown', onKeyDown, false);
function onKeyDown ( event ) {

	switch ( event.keyCode ) {
		case 76: /*l*/
		directionalLight.visible = !directionalLight.visible;
		break;

	}
}


//For debugging
document.addEventListener('mousemove', function(event){
	//update mousex and y
	mouseX = ( event.clientX - WIDTH/2 );
    mouseY = ( event.clientY - HEIGHT/2 );
}, false);




/*
//http://konrad.strack.pl/blog/image-concatenation-with-imagemagick#.UaMB80BwqrQ
http://www.elated.com/articles/rotatable-3d-product-boxshot-threejs/
*/