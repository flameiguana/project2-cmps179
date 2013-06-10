var $albumDiv = $('#album-info'); 
var $container = $('#container');
var cw = $container.width();
//Set container height to width
//16:9 aspect ratio
$container.css({'height': (cw * .5625) +'px'});
$('#usage').css({'height' : (cw * .5625) +'px'})
var WIDTH = $container.width();
var offset;
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
renderer.setSize(WIDTH, HEIGHT);
$container.append(renderer.domElement);
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
var genres = ["img/genres/p.jpg", "img/genres/h.jpg", "img/genres/r.jpg", "img/genres/c.jpg"];
var genreIDs = ["pop", "hip-hop", "rock", "country"];
var colors = [0xFF0000, 0xFF7A00, 0x03899C, 0x00CC00];

for(var i = 0; i < rows; i++){
	var z = (1 - i) * unit + unit/2;
	segments[i] = new baseChunk(z, unit, colors[i], covers[i], genres[i], genreIDs[i]);
	scene.add(segments[i]);
}

/*----------------Andrew's Stuff---------------*/
var charts = makeCharts(segments);


/*-----------------Lighting--------------------*/
//Use three directional lights to make boxes not look flat.

/*var frontLight = new THREE.DirectionalLight(0xFFFFFF, .85);
frontLight.position.set(0, 1, 1);
scene.add(frontLight);

var rightLight = new THREE.DirectionalLight(0xFFFFFF, 0.8);
rightLight.position.set(1, 0, 1);
scene.add(rightLight);

var leftLight = new THREE.DirectionalLight(0xFFFFFF, 0.6);
leftLight.position.set(-1, 1, 0);
scene.add(leftLight);*/

/*Don't like this:
hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
hemiLight.color.setHSL( 0.6, 0.75, 1 );
hemiLight.groundColor.setHSL( 0.095, 0.5, 1 );
scene.add(hemiLight);*/

var ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(ambientLight);

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
				//switch the text/icon
				$("#genre").css("display", "none");
				$("#decade").css("display", "block");
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
				//switch the text/icon
				$("#decade").css("display", "none");
				$("#genre").css("display", "block")
			});
		moveToSide.start();
	}
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
	var current = counter;

	for(var i = 0; i < rows; i++){
		if(segments[i] != segments[current]){
			segments[i].position.z += unit;
		}
		segments[current].position.z = -unit*1.5;
	}
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
	renderer.render(scene, camera);
	requestAnimationFrame(renderScene);
	//console.log("hi");
}

//Start the render loop.
requestAnimationFrame(renderScene);

/*Handle various keyboard clicks*/
document.addEventListener('keydown', onKeyDown, false);
//$container.bind('click', updateHover);

//Creates the popup
function generateInfo(genreID, albumID, year){
	var x = offset.left;
	var y = offset.top;
	var html = [];
	//var h = "<div class='popup' style='" + style +  "'>test content</div>";
	html.push("<span style='color: #FFA72D'><h3>" + year + " " + genreID + "</h3></span>");
	html.push(releaseInfo[genreID][albumID].artist);
	html.push("<i>" + releaseInfo[genreID][albumID].title + "</i>");
	html.push(releaseInfo[genreID][albumID].year);
	document.getElementById("album-info").innerHTML = html.join("<br>");
	$albumDiv.css({'top' :  y + 'px', 'left' : x + 'px', 'display': 'inline', 'width' : unit*.75 + 'px'});
}

var projector = new THREE.Projector();
function updateHover(event){
	//event.preventDefault();
	//middle of scene is 0, 0. This coverts to unit space [-1 to 1]
	var vector = new THREE.Vector3((mouseX / WIDTH) * 2 -1, -(mouseY/HEIGHT) * 2 + 1, .5);
	//note that this modifies vector
	var ray = projector.pickingRay(vector, camera);
	//return intersecting segments
	var intersects = ray.intersectObjects(segments);

	if ( intersects.length > 0 ) {
		var genreID = intersects[0].object.genreID;
		if(sideView){
			
		}
		//Manually check for indivudual album collision, since it's one object.
		else {
			//0 is the middle of the bar
			var x = vector.x;
			var albumID;
			var year;
			if( x < 0 - unit){
				albumID = 0;
				year = "'80s";
			}
			else if(x < 0){
				albumID = 1;
				year = "'90s";
			}
			else if(x < unit){
				albumID = 2;
				year = "2000s";
			}
			else{ 
				albumID = 3;
				year = "2012";
			}
			generateInfo(genreID, albumID, year);
		}
	}

	intersects = ray.intersectObjects(scene.children, true);

	$("#mouse-stalker").css("display", "none")

	if(intersects[0]!=undefined && intersects[0].object.chartData !=undefined)
		{
			//console.log(intersects[0].object.chartData);
			$("#mouse-stalker").css("display", "block")
			$("#mouse-stalker").html(intersects[0].object.chartData);
		}
}

function onKeyDown ( event ) {
	switch ( event.keyCode ) {
		case 76: /*l*/
			directionalLight.visible = !directionalLight.visible;
			break;
		case 67: /*c*/
			cycleBlock(segments);
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
			if(canCycle)
				switchCharts(sideView);
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


document.addEventListener('mousemove', function(event){
	//update mousex and y relative to canvas
	offset = $container.offset();
	mouseX = ( event.pageX - offset.left);
    mouseY = ( event.pageY - offset.top) ;
    $("#mouse-stalker").css("top", event.y-32)
	$("#mouse-stalker").css("left", event.x+2)
    updateHover();
}, false);


/*
//http://konrad.strack.pl/blog/image-concatenation-with-imagemagick#.UaMB80BwqrQ
http://www.elated.com/articles/rotatable-3d-product-boxshot-threejs/
http://css-tricks.com/snippets/jquery/get-x-y-mouse-coordinates/
*/