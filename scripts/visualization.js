console.log("Loaded"); 

var $container = $('#container');
var cw = $container.width();
//Set container height to width
//16:9 aspect ratio
$container.css({'height': (cw * .5625) +'px'});
$('#usage').css({'height' : (cw * .5625) +'px'})
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
var unit = HEIGHT * .26;
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
var charts = makeCharts(segments);


/*-----------------Lighting--------------------*/
//Use three directional lights to make boxes not look flat.

var frontLight = new THREE.DirectionalLight(0xFFFFFF, .85);
frontLight.position.set(0, 1, 1);
scene.add(frontLight);

var rightLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
rightLight.position.set(1, 0, 1);
scene.add(rightLight);

var leftLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
leftLight.position.set(-1, 1, 0);
scene.add(leftLight);

/*Don't like this:
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
hemiLight.color.setHSL( 0.6, 0.75, 1 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 1 );
scene.add(hemiLight);
*/

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
function rotateCamera(switchAfterwards){

	canRotateCamera = false;
	if(camera.position.x > 490)
		sideView = false;
	else
		sideView = true;
	if(!sideView){
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
	if(switchAfterwards)
		switchCharts();
}

var shouldStack = false;

//Switches the stacks heights without changing camera.
function changeStacks(){
		if(shouldStack){
			for(var i = 0; i < charts.length; i++)
				charts[i].stack(animationTime, easingFunction);
		}
		else{
			for(var i = 0; i < charts.length; i++){
				charts[i].unstack(animationTime, easingFunction);
				//charts[i].plane.visible = false;
			}
		}
		shouldStack = !shouldStack;
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
			y: originalLocations[counter].y,
			rotationX : 0
		})
		.to(
			{
			 y: originalLocations[counter].y - unit,
			 rotationX : degToRad(90)
			}, 400)
		.easing(TWEEN.Easing.Linear.None)
		.onUpdate(function(){
			segments[current].position.y = this.y;
			segments[current].rotation.x= this.rotationX;
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
		originalY: segments[current].position.y - unit, //recall that it will have been moved down
		rotationX: degToRad(90)
	})
	.to(
		{
		 y : unit,
		 rotationX : degToRad(360)
		}, 400)
	.easing(TWEEN.Easing.Linear.None)
	.onUpdate(function(){
		segments[current].position.y = this.originalY + this.y;
		segments[current].rotation.x = this.rotationX;
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

var overViewMode = false;
//This function calls itself when browser is ready to animate
function renderScene(){
	var timer = Date.now() * 0.0004;
	if(overViewMode){
		camera.position.x = Math.cos( timer ) * 200;
		camera.position.z = Math.sin( timer ) * 200;
	}
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
			if(overViewMode){
				changeStacks();
			}
			else if(canRotateCamera){
				rotateCamera();
			}
			break;
		case 83: /*s*/
			if(canCycle && !sideView)
				switchCharts();
			else
				rotateCamera(true);
			break;
		case 70: /*f*/
			var scale = 1.25;
			if(!overViewMode){
				camera.left = camera.left * scale;
				camera.right = camera.right * scale;
				camera.top = camera.top * scale;
				camera.bottom = camera.bottom * scale;
				camera.updateProjectionMatrix();
				camera.position.y = 200;
				overViewMode = true;}
			else {
				if(!shouldStack){
					changeStacks();
				}
				camera.left = camera.left * 1/scale;
				camera.right = camera.right * 1/scale;
				camera.top = camera.top * 1/scale;
				camera.bottom = camera.bottom * 1/scale;
				camera.updateProjectionMatrix();
				camera.position.set(0,0,500);
				overViewMode = false;
			}
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