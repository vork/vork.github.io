import * as THREE from 'three'
import * as TWEEN from 'tweenjs'
import { GLTFLoader } from 'gltf_loader'

const container = document.getElementById('container')
const loader = new GLTFLoader()

const min_size = Math.min(window.innerWidth, window.innerHeight);

const camera = new THREE.OrthographicCamera(
  -0.375,
  0.1,
  0.375,
  -0.1,
  0.1,
  5
)
camera.position.set(0, 2, 0)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(min_size, min_size)

window.addEventListener('resize', function () {
  var width = window.innerWidth
  var height = window.innerHeight
  var min_size = Math.min(width, height)
  renderer.setSize(min_size, min_size)
  camera.aspect = 1.0
  camera.updateProjectionMatrix()
})

container.appendChild(renderer.domElement)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xffffff);

function render(renderer, scene, camera, fps=30) {
  let delta = 0

  let clock = new THREE.Clock()

  var interval = 1
  if (fps != null) {
    // Setup a framerate limit
    interval = 1 / fps
  }

  function animate () {
    requestAnimationFrame(animate)
    delta += clock.getDelta()
    if (delta > interval || fps == null) {
      TWEEN.update()

      renderer.render(scene, camera)

      if (fps != null) {
        delta = delta % interval
      }
    }
  }

  animate()
}

const light_position_1 = new THREE.Vector3(-0.3, 0, 0);
const light_position_2 = new THREE.Vector3(0, 0, -0.3);

loader.load("LightBulb.glb", function (bulb) {
  var light_bulb_model = bulb.scene;
  if (light_bulb_model instanceof THREE.Group) {
    light_bulb_model = light_bulb_model.children[0];
  }

  light_bulb_model.scale.setScalar(0.05);
  light_bulb_model.updateMatrix();

  light_bulb_model.geometry.applyMatrix4( light_bulb_model.matrix );
  light_bulb_model.scale.setScalar(1.0);
  light_bulb_model.updateMatrix();

  const light1 = light_bulb_model.clone()
  light1.position.copy(light_position_1);
  light1.rotation.set(0, 0, -Math.PI / 2);

  const light2 = light_bulb_model.clone()
  light2.position.copy(light_position_2);
  light2.rotation.set(0, -Math.PI / 2, -Math.PI / 2);

  scene.add(light1, light2);

  const light_hemi = new THREE.HemisphereLight(0xdee6ff, 0x222222, 1.2)
  scene.add(light_hemi)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
  scene.add(ambientLight)

  const light1_pl = new THREE.PointLight( 0xffffff, 1, 0.7 );
  light1_pl.position.copy(light_position_1.sub(new THREE.Vector3(0.1, -0.2, 0)))
  scene.add( light1_pl );

  const light2_pl = new THREE.PointLight( 0xffffff, 1, 0.7 );
  light2_pl.position.copy(light_position_2.sub(new THREE.Vector3(0, -0.2, 0.1)))
  scene.add( light2_pl );

  loader.load("../nerf_explainer/Gnome.glb", function (gnome) {
    var gnome_model = gnome.scene;
    if (gnome_model instanceof THREE.Group) {
      gnome_model = gnome_model.children[0];
    }
    gnome_model.scale.setScalar(0.2);
    gnome_model.position.setComponent(2, 0.0025);
    gnome_model.updateMatrix();

    gnome_model.geometry.applyMatrix4( gnome_model.matrix );
    gnome_model.scale.setScalar(1.0);
    gnome_model.updateMatrix();

    console.log(light_bulb_model, gnome_model);
    scene.add(gnome_model);

    function illumination_distance(is_near, tween_time=2000) {
      var scale_val = { z: gnome_model.scale.z }
      var tween = new TWEEN.Tween(scale_val)

      if (is_near) {
        tween = tween.to({ z: 1.0 }, tween_time)
      } else {
        tween = tween.to({ z: 0.01 }, tween_time)
      }

      tween = tween
      .onUpdate(function () {
        gnome_model.scale.setScalar(scale_val.z)
      })
      .easing(TWEEN.Easing.Exponential.Out)

      tween.start()
    }

    function near() {
      illumination_distance(true)
    }

    function far() {
      illumination_distance(false)
    }

    const near_button = document.getElementById("near")
    near_button.onclick = near;

    const far_button = document.getElementById("far")
    far_button.onclick = far;

    render(renderer, scene, camera);
  });

});