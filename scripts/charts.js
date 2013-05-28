/**
		* Makes the chart type we were talking about, with the center of 
		* its base at x,y,z. Scene is just the scene were using, data1 and
		* data2 are just numbers, and normalizedTo is the value that we are
		* normalizing the data to
		* NOTE: If we wanted to have the text aligned to the bottom of the charts
		* 		all we would have to do is flip the signs on the text1a, 1b, etc. 
		*		signs
		*/
		function chartQuad(data, normalizedTo, totalSize, x, y, z){
			var SQUARE_CHART_SIZE = totalSize/2;//the size of each pillar
			var MAX_HEIGHT = 200;
			var material1 = new THREE.MeshLambertMaterial( { color: 0xff0fff, shading: THREE.FlatShading, overdraw: true } );
			var material2 = new THREE.MeshLambertMaterial( { color: 0xff0f0f, shading: THREE.FlatShading, overdraw: true } );
			//var totalSize = 50;

			this.pillarsFront = [];
			this.pillarsBack = [];

			var sumFront = 0;
			var sumBack = 0;
			for(var i = 0; i < data.length/2; i++){
				sumFront += data[i];
				sumBack += data[i + data.length/2];
			}

			this.positionsX = [ totalSize*.25 - SQUARE_CHART_SIZE*3, 
							 totalSize*.25 - SQUARE_CHART_SIZE,
							 totalSize*.25 + SQUARE_CHART_SIZE,
							 totalSize*.25 + SQUARE_CHART_SIZE*3, 
							-totalSize*.25 - SQUARE_CHART_SIZE*3, 
							-totalSize*.25 - SQUARE_CHART_SIZE,
							-totalSize*.25 + SQUARE_CHART_SIZE,
							-totalSize*.25 + SQUARE_CHART_SIZE*3];
			this.positionsY = [0,0,0,0,0,0,0,0];
			this.positionsZ = [totalSize*.25,  totalSize*.25,  totalSize*.25,  totalSize*.25, -totalSize*.25, -totalSize*.25, -totalSize*.25, -totalSize*.25]

			this.pillarsFront[0] = new pillar(data[0], normalizedTo, totalSize, material1, this.positionsX[0], this.positionsY[0], this.positionsZ[0]);
			this.pillarsFront[1] = new pillar(data[1], normalizedTo, totalSize, material1, this.positionsX[1], this.positionsY[1], this.positionsZ[1]);
			this.pillarsFront[2] = new pillar(data[2], normalizedTo, totalSize, material1, this.positionsX[2], this.positionsY[2], this.positionsZ[2]);
			this.pillarsFront[3] = new pillar(data[3], normalizedTo, totalSize, material1, this.positionsX[3], this.positionsY[3], this.positionsZ[3], sumFront);

			this.pillarsBack[0] = new pillar(data[4], normalizedTo, totalSize,  material2, this.positionsX[4], this.positionsY[4], this.positionsZ[4]);
			this.pillarsBack[1] = new pillar(data[5], normalizedTo, totalSize,  material2, this.positionsX[5], this.positionsY[5], this.positionsZ[5]);
			this.pillarsBack[2] = new pillar(data[6], normalizedTo, totalSize,  material2, this.positionsX[6], this.positionsY[6], this.positionsZ[6]);
			this.pillarsBack[3] = new pillar(data[7], normalizedTo, totalSize,  material2, this.positionsX[7], this.positionsY[7], this.positionsZ[7], sumBack);

			this.chart = new THREE.Object3D();

			for(var i = 0; i < this.pillarsFront.length; i++){
				this.chart.add(this.pillarsFront[i].pillar);
				this.chart.add(this.pillarsBack[i].pillar);
			}

			this.chart.position.x = x;
			this.chart.position.y = y;
			this.chart.position.z = z;

			this.stack = function(animationTime, easingFunction){
				var newYFront = []
				var newYBack = []
				var totalHeightFront = 0;
				var totalHeightBack = 0;
				for(var i = this.pillarsFront.length-1; i > -1; i--){
					newYFront[i] = totalHeightFront+this.pillarsFront[i].height/2;
					totalHeightFront += this.pillarsFront[i].height;

					newYBack[i] = totalHeightBack+this.pillarsBack[i].height/2;
					totalHeightBack += this.pillarsBack[i].height;
				}
				var stackit = new TWEEN.Tween(
				{
					//TODO: also update its children. Object3d has children attribute
					frontY0: this.positionsY[0]+this.pillarsFront[0].height/2,
					frontY1: this.positionsY[1]+this.pillarsFront[1].height/2,
					frontY2: this.positionsY[2]+this.pillarsFront[2].height/2,
					frontY3: this.positionsY[3]+this.pillarsFront[3].height/2,
					pillarsFront: this.pillarsFront,

					backY0: this.positionsY[4]+this.pillarsBack[0].height/2,
					backY1: this.positionsY[5]+this.pillarsBack[1].height/2,
					backY2: this.positionsY[6]+this.pillarsBack[2].height/2,
					backY3: this.positionsY[7]+this.pillarsBack[3].height/2,
					pillarsBack: this.pillarsBack
				})
				.to({ 
					frontY0: newYFront[0],
					frontY1: newYFront[1],
					frontY2: newYFront[2],
					frontY3: newYFront[3],
					backY0: newYBack[0],
					backY1: newYBack[1],
					backY2: newYBack[2],
					backY3: newYBack[3],
				}, animationTime)
				.easing(easingFunction)
				.onUpdate(function(){
					this.pillarsFront[0].pillar.position.y = this.frontY0;
					this.pillarsFront[1].pillar.position.y = this.frontY1;
					this.pillarsFront[2].pillar.position.y = this.frontY2;
					this.pillarsFront[3].pillar.position.y = this.frontY3;

					this.pillarsBack[0].pillar.position.y = this.backY0;
					this.pillarsBack[1].pillar.position.y = this.backY1;
					this.pillarsBack[2].pillar.position.y = this.backY2;
					this.pillarsBack[3].pillar.position.y = this.backY3;
				})
				stackit.start();
			}

			this.unstack = function(animationTime, easingFunction){
				var newYFront = [];
				var newYBack = [];
				for(var i = 0; i < this.pillarsFront.length; i++){
					newYFront[i] = this.positionsY[i] + this.pillarsFront[i].height/2;
					newYBack[i] = this.positionsY[i] + this.pillarsBack[i].height/2;
					//this.pillarsFront[i].pillar.position.y = this.positionsY[i] + this.pillarsFront[i].height/2;
					//this.pillarsBack [i].pillar.position.y = this.positionsY[i+4] + this.pillarsBack[i].height/2;
				}

				var unstackit = new TWEEN.Tween(
				{
					//TODO: also update its children. Object3d has children attribute
					frontY0: this.pillarsFront[0].pillar.position.y,
					frontY1: this.pillarsFront[1].pillar.position.y,
					frontY2: this.pillarsFront[2].pillar.position.y,
					frontY3: this.pillarsFront[3].pillar.position.y,
					pillarsFront: this.pillarsFront,

					backY0: this.pillarsBack[0].pillar.position.y,
					backY1: this.pillarsBack[1].pillar.position.y,
					backY2: this.pillarsBack[2].pillar.position.y,
					backY3: this.pillarsBack[3].pillar.position.y,
					pillarsBack: this.pillarsBack
				})
				.to({ 
					frontY0: newYFront[0],
					frontY1: newYFront[1],
					frontY2: newYFront[2],
					frontY3: newYFront[3],
					backY0: newYBack[0],
					backY1: newYBack[1],
					backY2: newYBack[2],
					backY3: newYBack[3],
				}, animationTime)
				.easing(easingFunction)
				.onUpdate(function(){
					this.pillarsFront[0].pillar.position.y = this.frontY0;
					this.pillarsFront[1].pillar.position.y = this.frontY1;
					this.pillarsFront[2].pillar.position.y = this.frontY2;
					this.pillarsFront[3].pillar.position.y = this.frontY3;

					this.pillarsBack[0].pillar.position.y = this.backY0;
					this.pillarsBack[1].pillar.position.y = this.backY1;
					this.pillarsBack[2].pillar.position.y = this.backY2;
					this.pillarsBack[3].pillar.position.y = this.backY3;
				})
				unstackit.start();
			}
		}
		function pillar(data, normalizedTo, totalSize, material, x, y, z, text){
			var SQUARE_CHART_SIZE = totalSize/2;//the size of each pillar
			var MAX_HEIGHT = 200;
			this.height = data/normalizedTo*MAX_HEIGHT;

			this.pillar = makeCube(material, x, y+this.height/2, z, SQUARE_CHART_SIZE, this.height, SQUARE_CHART_SIZE);

			var text1a = makeText(data, SQUARE_CHART_SIZE*.8, 0, 0, 0);
			text1a.rotation.z = Math.PI/2;
			text1a.position.x = SQUARE_CHART_SIZE/2.4; text1a.position.y = -this.height/2; text1a.position.z = SQUARE_CHART_SIZE/2+.0000001;
			if(text != undefined){
				var text1b = makeText(text, SQUARE_CHART_SIZE*.8, 0, 0, 0);
				text1b.rotation.z = Math.PI/2; text1b.rotation.y = Math.PI/2;
				text1b.position.x = SQUARE_CHART_SIZE/2+.0000001; text1b.position.y = -this.height/2; text1b.position.z = -SQUARE_CHART_SIZE/2.4;
				this.pillar.add(text1b);
			}

			this.pillar.add(text1a);

		}
		function makeCube(material, x, y, z, w, h, d){
			var geometry = new THREE.CubeGeometry( w, h, d );
			var cube = new THREE.Mesh( geometry, material );

			cube.position.x = x;
			cube.position.y = y;
			cube.position.z = z;

			return cube;
		}
		function makeText(theText, size, x, y, z){
			var material = new THREE.MeshLambertMaterial( { color: 0x333333, shading: THREE.FlatShading, overdraw: true } );
			//get text from hash (?)
			var hash = document.location.hash.substr( 1 );

				if ( hash.length !== 0 ) {

					theText = hash;

				}

			var text3d = new THREE.TextGeometry( theText, {

					size: size,
					height: 1.00000000000000000001,
					curveSegments: 6,
					font: "helvetiker"

				});

				text3d.computeBoundingBox();
				var centerOffsetX = -0.5 * ( text3d.boundingBox.max.x - text3d.boundingBox.min.x );
				var centerOffsetY = -0.5 * ( text3d.boundingBox.max.y - text3d.boundingBox.min.y );
				var centerOffsetZ = -0.5 * ( text3d.boundingBox.max.z - text3d.boundingBox.min.z );

				text = new THREE.Mesh( text3d, material );

				text.position.x = centerOffsetX + x;
				text.position.y = centerOffsetY + y;
				text.position.z = centerOffsetZ + z;

				return text;
		}