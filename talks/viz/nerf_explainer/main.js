var urlParams = new URLSearchParams(window.location.search)

function parseParam (key, default_value, parse_func = null) {
  var queried = urlParams.get(key)
  if (queried === null) {
    queried = default_value
  }
  if (parse_func != null) {
    queried = parse_func(queried)
  }
  return queried
}

const object = parseParam('object', 'Elephant.glb')
const objectScale = parseParam('object_scale', '1.0', parseFloat)

const coareSample = parseParam('coarse_samples', '12', parseInt)
const fineSample = parseParam('fine_samples', '4', parseInt)

const numCamera = parseParam('cameras', '7', parseInt)
const debug = parseParam('debug', '0', parseInt)

import * as THREE from 'three'
import { stateService } from './ui_handler.js'

// console.log(GetPointsEquiAngularlyDistancedOnHemiSphere(3, 3.43));

const container = document.getElementById('container')

// let scene_rtts = [];
// let rt_textures = [];

// let cameras = [];
// let ray_models = [];
// let sample_spheres_coarse = [];
// let sample_spheres_fine = [];

import { GLTFLoader } from 'gltf_loader'
import Stats from 'stats_module'

import {
  init,
  scene,
  renderer,
  camera,
  controls,
  cam_ray_toggles,
  cam_coarse_sample_toggles,
  cam_distribution_toggle,
  coarse_compose_toggles,
  fine_compose_toggles,
  cam_fine_sample_toggles
} from './init.js'
import { render } from './render.js'

const loader = new GLTFLoader()

var stats = null
loader.load(object, function (object_gltf) {
  const object_model = object_gltf.scene
  object_model.scale.set(objectScale, objectScale, objectScale)

  var bbox = new THREE.Box3().setFromObject(object_model)
  //   const bbox_dist = bbox.max.distanceTo( bbox.min );
  const max_dist = Math.max(...[bbox.max, bbox.min].map(x => x.length()))

  loader.load('Camera.glb', function (camera_gltf) {
    const camera_model = camera_gltf.scene
    camera_model.scale.setScalar(max_dist * 1.0)

    camera_model.updateMatrix();

    console.log(camera_model)

    camera_model.children[0].geometry.applyMatrix4( camera_model.matrix );
    camera_model.scale.setScalar(1.0);
    camera_model.updateMatrix();

    console.log('Loaded')

    const non_hidden_index = 0

    init(
      numCamera,
      max_dist,
      object_model,
      camera_model,
      coareSample,
      fineSample,
      non_hidden_index
    )

    if (debug) {
      stats = new Stats()
      container.appendChild(stats.dom)
    }

    container.appendChild(renderer.domElement)

    console.log('Init done')

    render(renderer, scene, camera, controls, stats, 30)

    stateService.onTransition(state => {
      console.log(state)
      if (state.value == 'rays') {
        cam_ray_toggles.forEach((x, index) => {
          x(true)
        })
      } else if (state.value == 'coarse_samples') {
        cam_coarse_sample_toggles.forEach((x, index) => {
          x(true)
        })
      } else if (state.value == 'fine_samples') {
        cam_distribution_toggle(false)
        coarse_compose_toggles.forEach(x => {
          x(false)
        })
        cam_coarse_sample_toggles.forEach((x, index) => {
          x(true)
        })
        cam_ray_toggles.forEach((x, index) => {
          if (index != non_hidden_index) {
            x(true)
          }
        })
        cam_fine_sample_toggles.forEach(x => x(true))
      } else if (state.value == 'ray_density') {
        coarse_compose_toggles.forEach((x, index) => {
          if (index != non_hidden_index) {
            x(false)
          } else {
            x(true)
          }
        })

        cam_coarse_sample_toggles.forEach((x, index) => {
          if (index != non_hidden_index) {
            x(false)
          } else {
            x(true)
          }
        })
        cam_ray_toggles.forEach((x, index) => {
          if (index != non_hidden_index) {
            x(false)
          } else {
            x(true)
          }
        })
        cam_distribution_toggle(true)
      } else if (state.value == 'coarse_alpha_compose') {
        cam_ray_toggles.forEach(x => {
          x(true)
        })
        cam_coarse_sample_toggles.forEach(x => {
          x(false)
        })
        coarse_compose_toggles.forEach(x => {
          x(true)
        })
      } else if (state.value == 'fine_alpha_compose') {
        cam_fine_sample_toggles.forEach(x => x(false))
        cam_ray_toggles.forEach(x => {
          x(true)
        })
        cam_coarse_sample_toggles.forEach(x => {
          x(false)
        })

        coarse_compose_toggles.forEach(x => {
          x(false)
        })
        fine_compose_toggles.forEach(x => {
          x(true)
        })
      } else if (state.value == 'camera_object') {
        cam_coarse_sample_toggles.forEach((x, index) => {
          x(false)
        })
        cam_ray_toggles.forEach((x, index) => {
          x(false)
        })

        cam_distribution_toggle(false)

        coarse_compose_toggles.forEach(x => {
          x(false)
        })

        fine_compose_toggles.forEach(x => {
          x(false)
        })
        cam_fine_sample_toggles.forEach(x => x(false))
      }
    })
  })
})
