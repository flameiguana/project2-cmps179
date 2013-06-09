		var chartPrices = [];
		var chartSales = [];
		var viewingMoney;
		function makeCharts(segments){
			/*
			pop
			hip hop
			rock
			country
			*/
			//cd, vinyl (oldest to newest)
			var colors = [0x74E868, 0x4AE83A, 0x14D100, 0x329D27, 0x08a5d1, 0x078fb5, 0x057d9f, 0x056682]
			chartPrices[0] = new chartQuad([34, 6, 10, 12, 83, 46, 75, 21], 100, unit, 0, unit/2, 0, colors, true);
			chartPrices[1] = new chartQuad([4, 15, 5, 19, 115, 30, 118, 22], 100, unit, 0, unit/2, 0, colors, true);
			chartPrices[2] = new chartQuad([14, 4, 21, 11, 19, 24, 70, 53], 100, unit, 0, unit/2, 0, colors, true);
			chartPrices[3] = new chartQuad([6, 4, 0, 8, 20, 0, 0, 13], 100, unit, 0, unit/2, 0, colors, true);

			//cd, vinyl
			chartSales[0] = new chartQuad([180, 39, 72, 101, 369, 12, 1, 17], 150, unit, 0, unit/2, 0, colors, false);
			chartSales[1] = new chartQuad([57,35,59,26,22,8,2,2], 150, unit, 0, unit/2, 0, colors, false);
			chartSales[2] = new chartQuad([112, 160, 63, 63, 114, 7, 47, 25], 150, unit, 0, unit/2, 0, colors, false);
			chartSales[3] = new chartQuad([4, 60, 0, 28, 1, 0, 0, 1], 150, unit, 0, unit/2, 0, colors, false);

			console.log(chartPrices[0].chart);
			for(var i = 0; i < segments.length; i++)
				segments[i].add(chartPrices[i].chart);

			viewingMoney = true;

			return chartPrices;
		}

		function switchCharts(rotated){
			if(viewingMoney){
				for(var i = 0; i < segments.length; i++)
				{
					segments[i].remove(chartPrices[i].chart);
					segments[i].add(chartSales[i].chart);
				}
				charts = chartSales;
				viewingMoney = false;
			}
			else{
				for(var i = 0; i < segments.length; i++)
				{
					segments[i].remove(chartSales[i].chart);
					segments[i].add(chartPrices[i].chart);
				}

				charts = chartPrices;
				viewingMoney = true;
			}
			if(rotated){ 
				for(var i = 0; i < chartSales.length; i++)
				{
					chartSales[i].stackImmediately();
					chartPrices[i].stackImmediately();
				}
			}
			else{
				for(var i = 0; i < chartSales.length; i++)
				{
					chartSales[i].unstackImmediately();
					chartPrices[i].unstackImmediately();
				}
			}
		}


		function makeFlatMaterial(sampleColor){return new THREE.MeshLambertMaterial( { color: sampleColor, ambient: sampleColor, shading: THREE.FlatShading, overdraw: true } );}
		var MAX_HEIGHT = 140;
		
		//makes the q column chart
		function chartQuad(data, normalizedTo, totalSize, x, y, z, colors, isMoney){
			var SQUARE_CHART_SIZE = totalSize/2;//the size of each pillar

			//material for plane
			var planeMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
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
			this.positionsX = [ -totalSize*.25 - SQUARE_CHART_SIZE*3, 
							-totalSize*.25 - SQUARE_CHART_SIZE,
							-totalSize*.25 + SQUARE_CHART_SIZE,
							-totalSize*.25 + SQUARE_CHART_SIZE*3,
							totalSize*.25 - SQUARE_CHART_SIZE*3, 
							 totalSize*.25 - SQUARE_CHART_SIZE,
							 totalSize*.25 + SQUARE_CHART_SIZE,
							 totalSize*.25 + SQUARE_CHART_SIZE*3];
							 
			this.positionsY = [0,0,0,0,0,0,0,0];
			
			this.positionsZ = [totalSize*.25,  totalSize*.25,  totalSize*.25,  totalSize*.25, -totalSize*.25, -totalSize*.25, -totalSize*.25, -totalSize*.25]

			this.pillarsFront[0] = new pillar(data[0], normalizedTo, totalSize, makeFlatMaterial(colors[0]), this.positionsX[0], this.positionsY[0], this.positionsZ[0], isMoney);
			this.pillarsFront[1] = new pillar(data[1], normalizedTo, totalSize, makeFlatMaterial(colors[1]), this.positionsX[1], this.positionsY[1], this.positionsZ[1], isMoney);
			this.pillarsFront[2] = new pillar(data[2], normalizedTo, totalSize, makeFlatMaterial(colors[2]), this.positionsX[2], this.positionsY[2], this.positionsZ[2], isMoney);
			this.pillarsFront[3] = new pillar(data[3], normalizedTo, totalSize, makeFlatMaterial(colors[3]), this.positionsX[3], this.positionsY[3], this.positionsZ[3], isMoney, sumFront);

			this.pillarsBack[0] = new pillar(data[4], normalizedTo, totalSize,  makeFlatMaterial(colors[4]), this.positionsX[4], this.positionsY[4], this.positionsZ[4], isMoney);
			this.pillarsBack[1] = new pillar(data[5], normalizedTo, totalSize,  makeFlatMaterial(colors[5]), this.positionsX[5], this.positionsY[5], this.positionsZ[5], isMoney);
			this.pillarsBack[2] = new pillar(data[6], normalizedTo, totalSize,  makeFlatMaterial(colors[6]), this.positionsX[6], this.positionsY[6], this.positionsZ[6], isMoney);
			this.pillarsBack[3] = new pillar(data[7], normalizedTo, totalSize,  makeFlatMaterial(colors[7]), this.positionsX[7], this.positionsY[7], this.positionsZ[7], isMoney, sumBack);
			
			this.positionsYAlt = [];
			var totalHeightFront = 0;
			var totalHeightBack = 0;
			for(var i = this.pillarsFront.length-1; i > -1; i--){
				this.positionsYAlt[i] = totalHeightFront+this.pillarsFront[i].height/2;
				totalHeightFront += this.pillarsFront[i].height;
				this.positionsYAlt[i+4] = totalHeightBack+this.pillarsBack[i].height/2;
				totalHeightBack += this.pillarsBack[i].height;
			}

			//backdrop
		 	this.plane = new THREE.Mesh(new THREE.PlaneGeometry(totalSize*4, MAX_HEIGHT*3), planeMaterial);
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
				var stackit = new TWEEN.Tween(
				{
					//TODO: also update its children. Object3d has children attribute
					frontY0: this.positionsY[0] + this.pillarsFront[0].height/2,
					frontY1: this.positionsY[1] + this.pillarsFront[1].height/2,
					frontY2: this.positionsY[2] + this.pillarsFront[2].height/2,
					frontY3: this.positionsY[3] + this.pillarsFront[3].height/2,
					pillarsFront: this.pillarsFront,

					backY0: this.positionsY[4] + this.pillarsBack[0].height/2,
					backY1: this.positionsY[5] + this.pillarsBack[1].height/2,
					backY2: this.positionsY[6] + this.pillarsBack[2].height/2,
					backY3: this.positionsY[7] + this.pillarsBack[3].height/2,

					pillarsBack: this.pillarsBack
				})
				.to({ 
					frontY0: this.positionsYAlt[0],
					frontY1: this.positionsYAlt[1],
					frontY2: this.positionsYAlt[2],
					frontY3: this.positionsYAlt[3],
					backY0: this.positionsYAlt[4],
					backY1: this.positionsYAlt[5],
					backY2: this.positionsYAlt[6],
					backY3: this.positionsYAlt[7],
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
		
			this.stackImmediately = function(){
				for(var i = 0; i < this.pillarsFront.length; i++)	{
					this.pillarsFront[i].pillar.position.y = this.positionsYAlt[i];
					this.pillarsBack[i].pillar.position.y = this.positionsYAlt[i+4];
				}
			}
			this.unstackImmediately = function(){
				this.plane.visible = true;
				this.plane.scale.y = 1;

				for(var i = 0; i < this.pillarsFront.length; i++)
				{
					this.pillarsFront[i].pillar.position.y = this.positionsY[i] + this.pillarsFront[i].height/2;
					this.pillarsBack[i].pillar.position.y = this.positionsY[i+4] + this.pillarsBack[i].height/2;
				}
			}
		}
		function pillar(data, normalizedTo, totalSize, material, x, y, z, isMoney, text){
			var SQUARE_CHART_SIZE = totalSize/2;//the size of each pillar
			this.height = data/normalizedTo*MAX_HEIGHT;

			this.pillar = makeCube(material, x, y+this.height/2, z, SQUARE_CHART_SIZE, this.height, SQUARE_CHART_SIZE);

			var prefix = "";
			if(isMoney)
				prefix = "$";
			/*var text1a = makeText(prefix+data, SQUARE_CHART_SIZE*.8, 0, 0, 0);
			text1a.rotation.z = Math.PI/2;
			text1a.position.x = SQUARE_CHART_SIZE/2.4; text1a.position.y = this.height/2; text1a.position.z = SQUARE_CHART_SIZE/2+.001;
			if(text != undefined){
				var text1b = makeText(prefix+text, SQUARE_CHART_SIZE*.8, 0, 0, 0);
				text1b.rotation.z = Math.PI/2; text1b.rotation.y = Math.PI/2;
				text1b.position.x = SQUARE_CHART_SIZE/2+.001; text1b.position.y = -this.height/2; text1b.position.z = -SQUARE_CHART_SIZE/2.4;
				this.pillar.add(text1b);
			}

			this.pillar.add(text1a);*/

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
			var material = new THREE.MeshLambertMaterial( { color: 0x212121, ambient: 0x212121, shading: THREE.FlatShading, overdraw: true } );
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