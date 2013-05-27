//images are oldest to newest
function baseChunk(z, unit, color, image, genre){

	var ALBUM_COUNT = 4;
	var depth = unit;
	var width = unit * ALBUM_COUNT;
	var height = unit;
	var coverMaterials = [];


	//left, right, top, bottom, front, and back
	var baseColor = new THREE.MeshLambertMaterial({color: color});
	var coverMaterial = new THREE.MeshLambertMaterial({map: THREE.ImageUtils.loadTexture(image)});

	var materials = [
		baseColor,
		baseColor,
		baseColor,
		baseColor,
		coverMaterial,
		baseColor
	];

	var geometry = new THREE.CubeGeometry(width, height, depth, ALBUM_COUNT, 1, 1);
	var mainMaterial = new THREE.MeshFaceMaterial(materials);
	//mainMaterial.wrapAround = true;
	var mesh = new THREE.Mesh(geometry, mainMaterial);
	console.log(z);
	mesh.position.set(0, 0, z);
	return mesh;
}
