import * as THREE from "three";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from "meshline";

const container = document.getElementById("container");
let scene = new THREE.Scene();
let camera, renderer, sphereArc;
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
var pointOnPlane = new THREE.Vector3();

const light1Pos = new THREE.Vector3(-2, 2, 2);
const sphereXOffset = -0.5;

function init() {
  camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor( 0xffffff, 0 );

  const spheregeom = new THREE.SphereGeometry(1, 32, 16);
  const spheremat = new THREE.MeshStandardMaterial({
    color: 0x55bbee,
    roughness: 0.3,
  });
  const sphere = new THREE.Mesh(spheregeom, spheremat);
  sphere.position.x = sphereXOffset;
  scene.add(sphere);

  const light1 = new THREE.PointLight(0xffee00, 1, 100);
  light1.position.copy(light1Pos);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xffffff, 1, 100);
  light2.position.set(2, -2, 2);
  scene.add(light2);

  var pointStart = new THREE.Vector3(0, -1, -1)
    .normalize()
    .multiplyScalar(1.01);
  var pointEnd = new THREE.Vector3(0, 1, -1).normalize().multiplyScalar(1.01);

  sphereArc = setArc3D(pointStart, pointEnd, 50, "black", true);
  sphere.add(sphereArc);
}

function setArc3D(pointStart, pointEnd, smoothness, color, clockWise) {
  // calculate a normal ( taken from Geometry().computeFaceNormals() )
  var cb = new THREE.Vector3(),
    ab = new THREE.Vector3(),
    normal = new THREE.Vector3();
  cb.subVectors(new THREE.Vector3(), pointEnd);
  ab.subVectors(pointStart, pointEnd);
  cb.cross(ab);
  normal.copy(cb).normalize();

  var angle = pointStart.angleTo(pointEnd); // get the angle between vectors
  if (clockWise) angle = angle - Math.PI * 2; // if clockWise is true, then we'll go the longest path
  var angleDelta = angle / (smoothness - 1); // increment

  let points = new Array(smoothness)
    .fill(0)
    .map((_, i) => pointStart.clone().applyAxisAngle(normal, angleDelta * i));

  let ray_geometry = new MeshLine();
  ray_geometry.setPoints(points, (p) => 0.025);

  var arc = new THREE.Mesh(
    ray_geometry,
    new MeshLineMaterial({
      color: color,
    })
  );

  return arc;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function onDocumentMouseMove(event) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  raycaster.ray.intersectPlane(plane, pointOnPlane);
  let norm = pointOnPlane.normalize();
  sphereArc.rotation.set(0, 0, Math.atan2(norm.y, norm.x) - Math.PI / 2);

  renderer.render(scene, camera);
}

init();

container.appendChild(renderer.domElement);
window.addEventListener("resize", onWindowResize);
document.addEventListener("mousemove", onDocumentMouseMove, false);

animate();
