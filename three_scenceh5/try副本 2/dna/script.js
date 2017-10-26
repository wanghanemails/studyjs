var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);

var renderer =  new THREE.WebGLRenderer( { antialias: true } );

var blue = 0x82cdf0;
var yellow = 0xfff0b4;
var purple = 0x82466e;
var purple2 = 0xffffff;

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

camera.position.z = 1000;

var cy_height = 3;
var tubeGeometry = new THREE.CylinderGeometry(0.3,0.3,cy_height,32);
var ballGeometry = new THREE.SphereGeometry(0.8,32,32);
var blueMaterial = new THREE.MeshBasicMaterial( { color: blue } );
var yellowMaterial = new THREE.MeshBasicMaterial( { color: yellow } );
var purpleMaterial = new THREE.MeshBasicMaterial( { color: purple } );
var purpleMaterial2 = new THREE.MeshBasicMaterial( { color: purple2 } );

var dna = new THREE.Object3D();
var holder = new THREE.Object3D();


for (var i = 0; i <= 40; i++) {
	var blueTube = new THREE.Mesh(tubeGeometry, purpleMaterial2);
	blueTube.rotation.z = 90 * Math.PI/180;
	blueTube.position.x = -cy_height/2;

	var yellowTube = new THREE.Mesh(tubeGeometry, purpleMaterial2 );
	yellowTube.rotation.z = 90 * Math.PI/180;
	yellowTube.position.x = cy_height/2;


	var ballRight = new THREE.Mesh( ballGeometry, yellowMaterial );
	ballRight.position.x = cy_height;

	var ballLeft = new THREE.Mesh( ballGeometry, blueMaterial );
	ballLeft.position.x = -cy_height;

	var row = new THREE.Object3D();
	row.add(blueTube);
	row.add(yellowTube);
	row.add(ballRight);
	row.add(ballLeft);

	row.position.y = i*2;
	row.rotation.y = 30*i * Math.PI/180;


	dna.add(row);

};


dna.position.y = -40;

scene.add(dna);

dna.position.y = -40;
holder.add(dna)
holder.position.z = 900;
scene.add(holder);



var render = function () {

	requestAnimationFrame(render);

	//holder.rotation.x += 0.01;
	holder.rotation.y += 0.01;
	renderer.render(scene, camera);
}

render();