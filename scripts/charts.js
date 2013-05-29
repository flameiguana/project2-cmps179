		var chartsMoney = [];
		var chartsBids = [];
		var viewingMoney;
		function makeCharts(segments){
			/*
			pop
			hip hop
			rock
			country
			*/
			//cd, vinyl (oldest to newest)
			chartsMoney[0] = new chartQuad([34, 6, 10, 12, 83, 46, 75, 21], 100, unit, 0, unit/2, 0, true);
			chartsMoney[1] = new chartQuad([4, 15, 5, 19, 115, 30, 118, 22], 100, unit, 0, unit/2, 0, true);
			chartsMoney[2] = new chartQuad([14, 4, 21, 11, 19, 24, 70, 53], 100, unit, 0, unit/2, 0, true);
			chartsMoney[3] = new chartQuad([6, 4, 0, 8, 20, 0, 0, 13], 100, unit, 0, unit/2, 0, true);

			//cd, vinyl
			chartsBids[0] = new chartQuad([180, 39, 72, 101, 369, 12, 1, 17], 150, unit, 0, unit/2, 0);
			chartsBids[1] = new chartQuad([57,35,59,26,22,8,2,2], 150, unit, 0, unit/2, 0);
			chartsBids[2] = new chartQuad([112, 160, 63, 63, 114, 7, 47, 25], 150, unit, 0, unit/2, 0);
			chartsBids[3] = new chartQuad([4, 60, 0, 28, 1, 0, 0, 1], 150, unit, 0, unit/2, 0);

			console.log(chartsMoney[0].chart);

			segments[0].add(chartsMoney[0].chart);
		 	segments[1].add(chartsMoney[1].chart);
		 	segments[2].add(chartsMoney[2].chart);
		 	segments[3].add(chartsMoney[3].chart);

			viewingMoney = true;

			return chartsMoney;
		}

		function switchCharts(){
			if(viewingMoney){
				console.log("viewingMoney");
				segments[0].remove(chartsMoney[0].chart);
				segments[1].remove(chartsMoney[1].chart);
				segments[2].remove(chartsMoney[2].chart);
				segments[3].remove(chartsMoney[3].chart);

				segments[0].add(chartsBids[0].chart);
				segments[1].add(chartsBids[1].chart);
				segments[2].add(chartsBids[2].chart);
				segments[3].add(chartsBids[3].chart);

				charts = chartsBids;
				viewingMoney = false;
			}
			else{
				console.log("notViewingMoney");
				segments[0].remove(chartsBids[0].chart);
				segments[1].remove(chartsBids[1].chart);
				segments[2].remove(chartsBids[2].chart);
				segments[3].remove(chartsBids[3].chart);

				segments[0].add(chartsMoney[0].chart);
				segments[1].add(chartsMoney[1].chart);
				segments[2].add(chartsMoney[2].chart);
				segments[3].add(chartsMoney[3].chart);

				charts = chartsMoney;
				viewingMoney = true;
			}
		}

		var MAX_HEIGHT = 150;
		function chartQuad(data, normalizedTo, totalSize, x, y, z, isMoney){
			var SQUARE_CHART_SIZE = totalSize/2;//the size of each pillar
			var MAX_HEIGHT = 200;
			var material1 = new THREE.MeshLambertMaterial( { color: 0xff0fff, shading: THREE.FlatShading, overdraw: true } );
			var material2 = new THREE.MeshLambertMaterial( { color: 0x0055AD, shading: THREE.FlatShading, overdraw: true,} );
			var material3 = new THREE.MeshBasicMaterial({color: 0xffffff});
			//var totalSize = 50;


			var sumFront = 0;
			var sumBack = 0;
			for(var i = 0; i < data.length/2; i++){
				sumFront += data[i];
				sumBack += data[i + data.length/2];
			}

			//pillars
			this.pillarsFront = [];
			this.pillarsBack = [];

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

			this.pillarsFront[0] = new pillar(data[0], normalizedTo, totalSize, material1, this.positionsX[0], this.positionsY[0], this.positionsZ[0], isMoney);
			this.pillarsFront[1] = new pillar(data[1], normalizedTo, totalSize, material1, this.positionsX[1], this.positionsY[1], this.positionsZ[1], isMoney);
			this.pillarsFront[2] = new pillar(data[2], normalizedTo, totalSize, material1, this.positionsX[2], this.positionsY[2], this.positionsZ[2], isMoney);
			this.pillarsFront[3] = new pillar(data[3], normalizedTo, totalSize, material1, this.positionsX[3], this.positionsY[3], this.positionsZ[3], isMoney, sumFront);

			this.pillarsBack[0] = new pillar(data[4], normalizedTo, totalSize,  material2, this.positionsX[4], this.positionsY[4], this.positionsZ[4], isMoney);
			this.pillarsBack[1] = new pillar(data[5], normalizedTo, totalSize,  material2, this.positionsX[5], this.positionsY[5], this.positionsZ[5], isMoney);
			this.pillarsBack[2] = new pillar(data[6], normalizedTo, totalSize,  material2, this.positionsX[6], this.positionsY[6], this.positionsZ[6], isMoney);
			this.pillarsBack[3] = new pillar(data[7], normalizedTo, totalSize,  material2, this.positionsX[7], this.positionsY[7], this.positionsZ[7], isMoney, sumBack);

			//backdrop
		 	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(totalSize*4, MAX_HEIGHT*2), material3);
		 	this.plane.position.x = 0; this.plane.position.y = totalSize; this.plane.position.z = -totalSize/2+.01;

			this.chart = new THREE.Object3D();

			this.chart.add(this.plane);

			for(var i = 0; i < this.pillarsFront.length; i++){
				this.chart.add(this.pillarsFront[i].pillar);
				this.chart.add(this.pillarsBack[i].pillar);
			}

			this.chart.position.x = x;
			this.chart.position.y = y;
			this.chart.position.z = z;

			this.stack = function(animationTime, easingFunction){
				this.plane.visible = false;
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
				this.plane.visible = true;
				var newYFront = [];
				var newYBack = [];
				for(var i = 0; i < this.pillarsFront.length; i++){
					newYFront[i] = this.positionsY[i] + this.pillarsFront[i].height/2;
					newYBack[i] = this.positionsY[i] + this.pillarsBack[i].height/2;
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

					planeScale: .000000001,
					plane: this.plane,
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
					planeScale: 1,

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
					this.plane.scale.y = this.planeScale;
				})
				//.onComplete(function(){this.plane.visible=true; console.log(this.plane)})
				unstackit.start();
			}
		}
		function pillar(data, normalizedTo, totalSize, material, x, y, z, isMoney, text){
			var SQUARE_CHART_SIZE = totalSize/2;//the size of each pillar
			this.height = data/normalizedTo*MAX_HEIGHT;

			this.pillar = makeCube(material, x, y+this.height/2, z, SQUARE_CHART_SIZE, this.height, SQUARE_CHART_SIZE);

			var prefix = "";
			if(isMoney)
				prefix = "$";
			var text1a = makeText(prefix+data, SQUARE_CHART_SIZE*.8, 0, 0, 0);
			text1a.rotation.z = Math.PI/2;
			text1a.position.x = SQUARE_CHART_SIZE/2.4; text1a.position.y = this.height/2; text1a.position.z = SQUARE_CHART_SIZE/2+.001;
			if(text != undefined){
				var text1b = makeText(prefix+text, SQUARE_CHART_SIZE*.8, 0, 0, 0);
				text1b.rotation.z = Math.PI/2; text1b.rotation.y = Math.PI/2;
				text1b.position.x = SQUARE_CHART_SIZE/2+.001; text1b.position.y = -this.height/2; text1b.position.z = -SQUARE_CHART_SIZE/2.4;
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
			var material = new THREE.MeshLambertMaterial( { color: 0x212121, shading: THREE.FlatShading, overdraw: true } );
			//get text from hash (?)
			var hash = document.location.hash.substr( 1 );

				if ( hash.length !== 0 ) {

					theText = hash;

				}

			var text3d = new THREE.TextGeometry( theText, {

					size: size,
					height: .00000000000000000001,
					curveSegments: 6,
					font: "gentilis"

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