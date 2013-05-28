console.log("Loaded"); 

var $container = $('#container');
var cw = $container.width();
//Set container height to width
//16:9 aspect ratio
$container.css({'height': (cw * .55) +'px'});

var WIDTH = $container.width();
var HEIGHT = $container.height();
var mouseX = 0; 
var mouseY = 0;

var VIEW_ANGLE = 45;
var ASPECT = WIDTH/HEIGHT;
var NEAR = -1000;
var FAR = 1000;


/*-------------Set up scene essentials --------------- */

//Change this to support Safari
var renderer = new THREE.WebGLRenderer();


var scene = new THREE.Scene();

///Make this window size independent
var camera = new THREE.OrthographicCamera ( 
	WIDTH/ -2, 
	WIDTH/2, 
	HEIGHT /2, 
	HEIGHT / -2,
	NEAR,
	FAR);
camera.position.set(0,0,500);
camera.lookAt(scene.position);
scene.add(camera);

/* ------------Set up geometry*-----------------------*/

//TODO Make all of this one object, witth cycleBlock internal function
var unit = 120;

var unit = HEIGHT * .3;
var rows = 4;
var segments = [];
var covers = ["img/pop.jpg", "img/hiphop.jpg", "img/rock.jpg", "img/country.jpg"];
var genres = ["img/genres/p.png", "img/genres/h.png", "img/genres/r.png", "img/genres/c.png", ]
var colors = [0xFFF826, 0xBAF325, 0xCD1F94, 0xA359DC];

for(var i = 0; i < rows; i++){
	var z = (1 - i) * unit + unit/2;
	segments[i] = new baseChunk(z, unit, colors[i], covers[i], genres[i]);
	scene.add(segments[i]);
}

/*----------------Andrew's Stuff---------------*/
var charts = [];
charts[0] = new chartQuad([100, 200, 300, 400, 500, 600, 700, 800], 1000, unit, 0, unit/2, 0);
charts[1] = new chartQuad([100, 200, 300, 400, 500, 600, 700, 800], 1000, unit, 0, unit/2, 0);
charts[2] = new chartQuad([100, 200, 300, 400, 500, 600, 700, 800], 1000, unit, 0, unit/2, 0);
charts[3] = new chartQuad([100, 200, 300, 400, 500, 600, 700, 800], 1000, unit, 0, unit/2, 0);
segments[0].add(charts[0].chart);
segments[1].add(charts[1].chart);
segments[2].add(charts[2].chart);
segments[3].add(charts[3].chart);
/*---------------End Andrew's Stuff------------*/

/*-----------------Lighting--------------------*/
var directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
directionalLight.position.set(0, 1, 0);
 
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
hemiLight.color.setHSL( 0.6, 0.75, 1 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 1 );

scene.add(hemiLight);
scene.add(new THREE.AmbientLight( 0x00010 ) );
scene.add(directionalLight);

renderer.setSize(WIDTH, HEIGHT);
$container.append(renderer.domElement);

//---------------Render Stuff-----------------

//Get the browser specific animation frame var.
var requestAnimationFrame = window.requestAnimationFrame ||  window.webkitRequestAnimationFrame ||
 window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

//set it to a variable with same name across browsers
window.requestAnimationFrame = requestAnimationFrame;

var cycle = false;
var counter = 0;
var canCycle = true;
var canRotateCamera = true;
var sideView = false;
var animationTime = 600;
var easingFunction = TWEEN.Easing.Cubic.Out;
function rotateCamera(){

	canRotateCamera = false;
	if(camera.position.x > 490)
		sideView = true;
	else
		sideView = false;
	if(sideView){
		for(var i = 0; i < charts.length; i++)
			charts[i].unstack(animationTime, easingFunction);
		var moveToFront = new TWEEN.Tween(
			{
				//TODO: also update its children. Object3d has children attribute
				x: camera.position.x,
				y: camera.position.y,
				z: camera.position.z
			})
			.to({ 
				x: 0,
				y: 0,
				z: 500,
			}, animationTime)
			.easing(easingFunction)
			.onUpdate(function(){
				camera.position.x = this.x;
				camera.position.y = this.y;
				camera.position.z = this.z;
			})
			.onComplete(function(){
				canRotateCamera = true; ///re enable key
			});
		moveToFront.start();
	}
	else{
		for(var i = 0; i < charts.length; i++)
			charts[i].stack(animationTime, easingFunction);
		var moveToSide = new TWEEN.Tween(
			{
				//TODO: also update its children. Object3d has children attribute
				x: camera.position.x,
				y: camera.position.y,
				z: camera.position.z
			})
			.to({ 
				x: 500,
				y: 0,
				z: 0,
			}, animationTime)
			.easing(easingFunction)
			.onUpdate(function(){
				camera.position.x = this.x;
				camera.position.y = this.y;
				camera.position.z = this.z;
			})
			.onComplete(function(){
				canRotateCamera = true; ///re enable key
			});
		moveToSide.start();
	}
}

function cycleBlock(blocks){
	//translate front one up, translate back, push all others forward, translate down
	var current = counter;
	var originalLocations = [];

	//Store the initial locations.
	for(var i = 0; i < rows; i++){
		//copying by reference is bad
		var position = {
			x: segments[i].position.x,
			y: segments[i].position.y,
			z: segments[i].position.z
		};

		originalLocations[i] = position;
	}

	//Set up tweeen objects.
	var moveUp = new TWEEN.Tween(
		{
			//TODO: also update its children. Object3d has children attribute
			y: originalLocations[counter].y
		})
		.to({ y: originalLocations[counter].y + unit}, 400)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function(){
			segments[current].position.y = this.y;
		});

	var moveForward = new TWEEN.Tween(
		{
			orig : originalLocations,
			zShift : 0
		})
		.to({zShift: unit}, 400)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function(){
			for(var i = 0; i < rows; i++){
				if(i != current){
					segments[i].position.z = this.orig[i].z + this.zShift;
				}
			}
		});

	var moveBack = new TWEEN.Tween(
	{
		z: originalLocations[counter].z
	})
	.to({ z : originalLocations[counter].z - unit*(rows - 1) }, 400*2)
	.easing(TWEEN.Easing.Linear.None)
	.onUpdate(function(){
		segments[current].position.z = this.z;
	});

	var moveDown = new TWEEN.Tween(
	{
		y: 0,
		originalY: segments[current].position.y + unit //recall that it will be moved up
	})
	.to({ y : unit}, 400)
	.easing(TWEEN.Easing.Linear.None)
	.onUpdate(function(){
		segments[current].position.y = this.originalY - this.y;
	})
	.onComplete(function(){
		canCycle = true; ///re enable key
	});

	//Chain all the animations together.
	moveUp.chain(moveForward);
	moveForward.chain(moveBack);
	moveBack.chain(moveDown);

	moveUp.start();

	counter++;
	if(counter === rows){
		counter = 0;
	}
}

//This function calls itself when browser is ready to animate
function renderScene(){
	var timer = Date.now() * 0.0006;

	//camera.position.x = Math.cos( timer ) * 200;
	//camera.position.z = Math.sin( timer ) * 200;
	camera.lookAt( scene.position );
	TWEEN.update();
	if(cycle === true){
		cycleBlock(segments);
		cycle = false;
	}
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
		case 67: /*c*/
			if(canCycle === true ){
				cycle = true;
				canCycle = false;
			}
			break;
		case 81: /*q*/
			if(canRotateCamera)
				rotateCamera();
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
http://www.flickr.com/groups/itunesgenres/pool/
*/