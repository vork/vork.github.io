import * as THREE from 'three'
import * as TWEEN from 'tweenjs'
import { OrbitControls } from 'orbit_control'
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'meshline'
import forEachTriangle from './triangle_iterator.js' // 'triangle_iterator';
import { smooth, binaryClosestIdx } from './utils.js'

// Cubic.InOut
// Elastic.Out/In

function GetPointsEquiAngularlyDistancedOnHemiSphere (
  numberOfPoints,
  radius = 1.0
) {
  const phi = Math.PI * (3.0 - Math.sqrt(5.0)) // ~2.39996323
  const points = []

  for (let i = 0; i < numberOfPoints; i++) {
    const y = i / (numberOfPoints - 1.0) // y goes from 1 to 0
    const r = Math.sqrt(1.0 - y * y) // radius at y

    const theta = phi * i // golden angle increment

    const x = Math.cos(theta) * r
    const z = Math.sin(theta) * r

    const ptNew = new THREE.Vector3(x, y, z)

    points.push(ptNew.multiplyScalar(radius))
  }
  return points
}

let scene, renderer
let camera, controls
let canvas_ctx
let cam_ray_toggles = []
let cam_coarse_sample_toggles = []
let cam_distribution_toggle
let coarse_sample_locations = []
let coarse_compose_toggles = []
let fine_compose_toggles = []
let cam_fine_sample_toggles = []

function setup_camera (
  cam_pos,
  plane_geometry,
  mat,
  scene_rtt,
  camera_model,
  bbox_radius
) {
  const camera_render = new THREE.OrthographicCamera(
    -bbox_radius,
    bbox_radius,
    bbox_radius,
    -bbox_radius,
    bbox_radius * 0.1,
    bbox_radius * 5
  )
  camera_render.position.fromArray(cam_pos.toArray())
  camera_render.lookAt(0, 0, 0)

  const rtTexture = new THREE.WebGLRenderTarget(256, 256)

  const wireframe = new THREE.LineSegments(
    new THREE.EdgesGeometry(plane_geometry),
    mat
  )
  wireframe.renderOrder = 1

  const rt_material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: rtTexture.texture,
    side: THREE.DoubleSide
  })
  const render_mesh = new THREE.Mesh(plane_geometry, rt_material)

  render_mesh.position.fromArray(
    cam_pos
      .clone()
      .multiplyScalar(0.85)
      .toArray()
  )
  render_mesh.lookAt(0, 0, 0)

  render_mesh.add(wireframe)
  scene.add(render_mesh)

  renderer.setRenderTarget(rtTexture)
  renderer.clear()
  renderer.render(scene_rtt, camera_render)

  const cam_model = camera_model.clone()
  cam_model.position.fromArray(cam_pos.toArray())
  cam_model.lookAt(0, 0, 0)

  scene.add(cam_model)

  return cam_model
}

function setup_ray (camera_model, bbox_radius, ray_magn_scaler = 1.75, tween_time = 1000) {
  const points = [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, camera_model.position.length() * ray_magn_scaler)
  ]

  const ray_material = new MeshLineMaterial({ color: 0x00796b })
  let ray_geometry = new MeshLine()
  ray_geometry.setPoints(points, p => 0.01 * bbox_radius)

  const ray_model = new THREE.Mesh(ray_geometry, ray_material)
  camera_model.add(ray_model)

  ray_model.scale.setComponent(2, 0.0)

  function change_state (visible) {
    var scale_val = { z: ray_model.scale.z }
    var tween = new TWEEN.Tween(scale_val)
    if (visible) {
      tween = tween.to({ z: 1.0 }, tween_time)
    } else {
      tween = tween.to({ z: 0.0 }, tween_time)
    }
    tween = tween
      .onUpdate(function () {
        ray_model.scale.setComponent(2, scale_val.z)
      })
      .easing(TWEEN.Easing.Cubic.InOut)

    tween.start()
  }

  return change_state
}

function perform_ray_intersection (scene_intersect, camera_pos) {
  let ray_direction = camera_pos
    .clone()
    .negate()
    .normalize()
  let ray = new THREE.Raycaster(camera_pos, ray_direction)
  let ray_object_intersections = ray.intersectObjects(
    scene_intersect.children,
    true
  )
  return ray_object_intersections
}

function setup_compose (
  scene_intersect,
  camera_model,
  bbox_radius,
  noise,
  tween_time = 1000
) {
  const ray_intersections = perform_ray_intersection(
    scene_intersect,
    camera_model.position
  )
  const ray_uv = ray_intersections.map(x => x.uv)[0]
  const ray_distance = ray_intersections.map(x => x.distance)[0]
  console.log(ray_intersections)

  let magn = camera_model.position.length()
  let near = bbox_radius * 1.15

  let start = Math.max(magn - near, 0)

  const color = new THREE.Color()
  const pixelData = canvas_ctx.getImageData(
    Math.floor(ray_uv.x * canvas_ctx.canvas.width),
    Math.floor(ray_uv.y * canvas_ctx.canvas.height),
    1,
    1
  ).data
  // Sum the color values. Also apply gamma correction
  color.setRGB(
    ...Array.from(pixelData.slice(0, 3)).map(val => Math.pow(val / 255.0, 2.2))
  )
  console.log(color)

  const sample_geometry = new THREE.SphereGeometry(bbox_radius / 30, 16, 8)
  const sample_material = new THREE.MeshStandardMaterial({
    color: color,
    transparent: true,
    opacity: 0.0
  })
  const final_position = ray_distance - Math.random() * noise

  const sphere = new THREE.Mesh(sample_geometry, sample_material)
  sphere.position.z = start
  sphere.scale.set(0.0, 0.0, 0.0)

  camera_model.add(sphere)

  function change_state (visible) {
    var tweenval = {
      z: sphere.position.z,
      s: sphere.scale.x,
      so: sphere.material.opacity
    }
    var tween = new TWEEN.Tween(tweenval)
    if (visible) {
      tween = tween.to({ z: final_position, s: 1.0, so: 1.0 }, tween_time)
    } else {
      tween = tween.to({ z: start, s: 0.0, so: 0.0 }, tween_time)
    }

    tween = tween
      .onUpdate(function () {
        sphere.position.setComponent(2, tweenval.z)
        sphere.scale.setScalar(tweenval.s)
        sphere.material.opacity = tweenval.so
      })
      .easing(TWEEN.Easing.Cubic.InOut)

    tween.start()
  }

  return change_state
}

function setup_fine_sampling (
  scene_intersect,
  camera_model,
  bbox_radius,
  fine_samples,
  noise = 0.1,
  tween_time = 1000
) {
  const ray_intersections = perform_ray_intersection(
    scene_intersect,
    camera_model.position
  )
  const ray_distance = ray_intersections.map(x => x.distance)
  const distribute_around = [ray_distance[0]]
  if (ray_distance.length > 1) {
    distribute_around.push(ray_distance[1])
  }

  const sample_geometry = new THREE.SphereGeometry(bbox_radius / 30, 16, 8)
  const sample_material = new THREE.MeshBasicMaterial({ color: 0x01579b })

  const samples_per_inter = Math.floor(fine_samples / 2)
  const samples = [samples_per_inter, samples_per_inter]
  if (samples_per_inter * 2 != fine_samples) {
    samples[0] = samples[0] + 1
  }

  const samples_front = [distribute_around[0] - Math.random() * noise]
  for (let i = 1; i < samples[0]; i++) {
    samples_front.push(samples_front[i - 1] - Math.random() * noise)
  }
  const samples_back = [distribute_around[1] + Math.random() * noise]
  for (let i = 1; i < samples[1]; i++) {
    samples_front.push(samples_front[i - 1] + Math.random() * noise)
  }
  const all_samples = samples_front.concat(samples_back)

  const sample_spheres = []
  for (const smpl of all_samples) {
    const sphere = new THREE.Mesh(sample_geometry, sample_material)
    sphere.position.z = smpl
    sphere.scale.set(0.0, 0.0, 0.0)

    sample_spheres.push(sphere)
    camera_model.add(sphere)
  }

  function change_state (visible) {
    var tweens = []
    for (const smpl_sph of sample_spheres) {
      let scale_val = {
        x: smpl_sph.scale.x
      }
      var subtween = new TWEEN.Tween(scale_val)

      if (visible) {
        subtween = subtween.to(
          { x: 1.0 },
          Math.floor(tween_time / fine_samples)
        )
      } else {
        subtween = subtween.to(
          { x: 0.0 },
          Math.floor(tween_time / fine_samples)
        )
      }

      subtween = subtween
        .onUpdate(function () {
          smpl_sph.scale.setScalar(scale_val.x)
        })
        .easing(TWEEN.Easing.Elastic.Out)

      tweens.push(subtween)
    }

    for (let i = 0; i < fine_samples - 1; i++) {
      tweens[i].chain(tweens[i + 1])
    }

    tweens[0].start()
  }

  return change_state
}

function setup_coarse_sampling (
  coarse_samples,
  camera_model,
  bbox_radius,
  tween_time = 1000
) {
  let magn = camera_model.position.length()
  let near = bbox_radius * 1.15
  let far = bbox_radius * 1.15 * 2

  let start = Math.max(magn - near, 0)
  let end = start + far

  const sample_geometry = new THREE.SphereGeometry(bbox_radius / 30, 16, 8)
  const sample_material = new THREE.MeshBasicMaterial({ color: 0x00796b })

  let sample_spheres = []
  let sample_locations = []
  for (let i = 0; i < coarse_samples; i++) {
    let step = (1 / (coarse_samples - 1)) * i
    let distance = start * (1 - step) + end * step
    sample_locations.push(distance)

    const sphere = new THREE.Mesh(sample_geometry, sample_material)
    sphere.position.z = distance
    sphere.scale.set(0.0, 0.0, 0.0)

    camera_model.add(sphere)
    sample_spheres.push(sphere)
  }

  coarse_sample_locations.push(sample_locations)

  function change_state (visible) {
    var tweens = []
    for (let i = 0; i < coarse_samples; i++) {
      let scale_val = {
        x: sample_spheres[i].scale.x,
        y: sample_spheres[i].scale.y,
        z: sample_spheres[i].scale.z
      }
      var subtween = new TWEEN.Tween(scale_val)

      if (visible) {
        subtween = subtween.to(
          { x: 1.0, y: 1.0, z: 1.0 },
          Math.floor(tween_time / coarse_samples)
        )
      } else {
        subtween = subtween.to(
          { x: 0.0, y: 0.0, z: 0.0 },
          Math.floor(tween_time / coarse_samples)
        )
      }

      subtween = subtween
        .onUpdate(function () {
          sample_spheres[i].scale.set(scale_val.x, scale_val.y, scale_val.z)
        })
        .easing(TWEEN.Easing.Elastic.Out)

      tweens.push(subtween)
    }

    for (let i = 0; i < coarse_samples - 1; i++) {
      tweens[i].chain(tweens[i + 1])
    }

    tweens[0].start()
  }

  return change_state
}

function createPlaneStencilGroup (geometry, plane, renderOrder) {
  const group = new THREE.Group()
  const baseMat = new THREE.MeshStandardMaterial()
  baseMat.depthWrite = false
  baseMat.depthTest = false
  baseMat.colorWrite = false
  baseMat.stencilWrite = true
  baseMat.stencilFunc = THREE.AlwaysStencilFunc

  // back faces
  const mat0 = baseMat.clone()
  mat0.side = THREE.BackSide
  mat0.clippingPlanes = [plane]
  mat0.stencilFail = THREE.IncrementWrapStencilOp
  mat0.stencilZFail = THREE.IncrementWrapStencilOp
  mat0.stencilZPass = THREE.IncrementWrapStencilOp

  const mesh0 = new THREE.Mesh(geometry, mat0)
  // mesh0.renderOrder = renderOrder;
  group.add(mesh0)

  // front faces
  const mat1 = baseMat.clone()
  mat1.side = THREE.FrontSide
  mat1.clippingPlanes = [plane]
  mat1.stencilFail = THREE.DecrementWrapStencilOp
  mat1.stencilZFail = THREE.DecrementWrapStencilOp
  mat1.stencilZPass = THREE.DecrementWrapStencilOp

  const mesh1 = new THREE.Mesh(geometry, mat1)
  // mesh1.renderOrder = renderOrder;

  group.add(mesh1)

  return group
}

function get_material (object_model) {
  var mesh_material = null
  if (object_model instanceof THREE.Group) {
    mesh_material = object_model.children[0].material
  } else {
    mesh_material = object_model.material
  }

  return mesh_material
}

function create_fake_distribution (
  scene_intersect,
  cam_model,
  coarse_sample_location,
  bbox_radius,
  min_density_noise = 0.05,
  max_density_noise = 0.1,
  max_density = 0.5,
  density_resolution = 200
) {
  const ray_intersections = perform_ray_intersection(
    scene_intersect,
    cam_model.position
  ).map(x => x.distance)
  let ray_densities_temp = []

  for (let i = 0; i < coarse_sample_location.length; i++) {
    const distance = coarse_sample_location[i]
    let distance_future
    if (i == coarse_sample_location.length - 1) {
      distance_future = distance + bbox_radius * 0.001
    } else {
      distance_future = coarse_sample_location[i + 1]
    }

    let ray_distance = distance_future - distance
    let distance_threshold = ray_distance * 1.5
    let min_distance = Math.min(
      ...ray_intersections.map(x => Math.abs(x - distance))
    )

    if (min_distance > distance_threshold) {
      // Not near a surface
      ray_densities_temp.push([
        distance,
        Math.random() * min_density_noise * bbox_radius
      ])
    } else {
      // Near a surface
      let scaler = 1.0 - min_distance / distance_threshold
      ray_densities_temp.push([
        distance,
        max_density * bbox_radius * scaler +
          Math.random() * max_density_noise * bbox_radius
      ])
    }
  }

  // Create a nicer smoothed out version
  let density_samples = ray_densities_temp.map(x => x[0])
  let ray_densities = []
  let start = coarse_sample_location[0]
  let end = coarse_sample_location[coarse_sample_location.length - 1]

  for (let i = 0; i < density_resolution; i++) {
    let step = (1 / (density_resolution - 1)) * i

    let target = start * (1 - step) + end * step

    let idx = binaryClosestIdx(density_samples, target)

    let cur_density = ray_densities_temp[idx]
    if (target < cur_density[0]) {
      // We are in front of the closest density
      let prev_val, prev_start
      if (idx == 0) {
        prev_val = 0.0
        prev_start = start
      } else {
        prev_val = ray_densities_temp[idx - 1][1]
        prev_start = ray_densities_temp[idx - 1][0]
      }

      let diff = cur_density[0] - prev_start
      let scaler = smooth((target - prev_start) / diff)

      ray_densities.push([
        target,
        cur_density[1] * scaler + prev_val * (1 - scaler)
      ])
    } else {
      let next_val, next_start
      if (idx == coarse_sample_location.length - 1) {
        next_val = 0.0
        next_start = end
      } else {
        next_val = ray_densities_temp[idx + 1][1]
        next_start = ray_densities_temp[idx + 1][0]
      }

      let diff = next_start - cur_density[0]
      let scaler = smooth((next_start - target) / diff)

      var new_val = cur_density[1] * scaler + next_val * (1 - scaler)
      if (isNaN(new_val)) new_val = 0
      ray_densities.push([target, new_val])
    }
  }

  console.log(ray_densities)

  const points_densities = []
  ray_densities.forEach(element =>
    points_densities.push(new THREE.Vector3(-0.015, element[1], element[0]))
  )
  const density_material = new MeshLineMaterial({
    color: 0x01579b,
    transparent: true,
    opacity: 0.0
  })
  let ray_density_geo = new MeshLine()
  ray_density_geo.setPoints(points_densities, p => 0.03)

  const density_model = new THREE.Mesh(ray_density_geo, density_material)

  density_model.scale.setComponent(1, 0.0)

  return density_model
}

function setup_distribution (
  scene_intersect,
  camera_model,
  object_model,
  bbox_radius,
  coarse_sample_location,
  setup_clip_planes,
  tween_time = 1000
) {
  if (setup_clip_planes) {
    let ray_dir = camera_model.position.clone().normalize()
    let up_dir = THREE.Object3D.DefaultUp

    let plane_normal = ray_dir.cross(up_dir).normalize()

    let plane = new THREE.Plane(plane_normal, 0.0)

    // Find stencil color
    // This is slightly over the top.
    // We actually check the average color at the plane intersection point
    var a = new THREE.Vector3()
    var b = new THREE.Vector3()
    var c = new THREE.Vector3()

    var target = new THREE.Vector3()
    var triangle = new THREE.Triangle()
    let uv_target = new THREE.Vector2()

    let intersection_uvs = []
    // By first finding all intersections with the plane
    forEachTriangle(object_model, (face, uvs) => {
      object_model.localToWorld(a.copy(face[0]))
      object_model.localToWorld(b.copy(face[1]))
      object_model.localToWorld(c.copy(face[2]))

      let lineAB = new THREE.Line3(a, b)
      let lineBC = new THREE.Line3(b, c)
      let lineCA = new THREE.Line3(c, a)

      for (const line of [lineAB, lineBC, lineCA]) {
        let potential_intersection = plane.intersectLine(line, target)
        if (potential_intersection) {
          // let local_intersection = object_model.worldToLocal(potential_intersection.clone())
          triangle.set(face[0], face[1], face[2])

          if (
            uvs.length > 0 &&
            triangle.containsPoint(potential_intersection)
          ) {
            let uv_coord = triangle.getUV(
              potential_intersection,
              uvs[0],
              uvs[1],
              uvs[2],
              uv_target
            )
            intersection_uvs.push(uv_coord.clone())
          }
        }
      }
    })

    // Then looking up the actual color and calculating the average
    const avg_color = new THREE.Color(0, 0, 0)
    const num_elements = intersection_uvs.length
    for (const uv of intersection_uvs) {
      const pixelData = canvas_ctx.getImageData(
        Math.floor(uv.x * canvas_ctx.canvas.width),
        Math.floor(uv.y * canvas_ctx.canvas.height),
        1,
        1
      ).data
      // Sum the color values. Also apply gamma correction
      avg_color.setRGB(
        ...avg_color
          .toArray()
          .map(
            (val, idx) =>
              val + Math.pow(pixelData[idx] / 255, 2.2) / num_elements
          )
      )
    }
    console.log(avg_color)

    plane.constant = bbox_radius

    // Then setup capping with stencils
    const planeGeom = new THREE.PlaneGeometry(bbox_radius * 2, bbox_radius * 2)

    let mesh
    if (object_model instanceof THREE.Group) {
      mesh = object_model.children[0]
    } else {
      mesh = object_model
    }

    const stencilGroup = createPlaneStencilGroup(mesh.geometry, plane, 1)

    // plane is clipped by the other clipping planes
    const planeMat = new THREE.MeshStandardMaterial({
      color: avg_color,
      metalness: 0.0,
      roughness: 1.0,
      stencilWrite: true,
      stencilRef: 0,
      stencilFunc: THREE.NotEqualStencilFunc,
      stencilFail: THREE.ReplaceStencilOp,
      stencilZFail: THREE.ReplaceStencilOp,
      stencilZPass: THREE.ReplaceStencilOp
    })
    const po = new THREE.Mesh(planeGeom, planeMat)

    mesh.add(stencilGroup)
    po.renderOrder = 2

    scene.add(po)

    plane.coplanarPoint(po.position)
    po.lookAt(
      po.position.x - plane_normal.x,
      po.position.y - plane_normal.y,
      po.position.z - plane_normal.z
    )

    console.log(scene, po, object_model)

    // Setup clipping

    // TODO interestingly if I direclty alter the material some render
    // to texture scenes are also altered. Create an explicit clone
    let mesh_material = mesh.material.clone()
    mesh_material.clipIntersection = true
    mesh_material.clippingPlanes = [plane]
    mesh_material.side = THREE.DoubleSide

    mesh.material = mesh_material

    // Now setup the actual fake distribution function
    const density_model = create_fake_distribution(
      scene_intersect,
      camera_model,
      coarse_sample_location,
      bbox_radius
    )
    camera_model.add(density_model)

    function change_state (visible) {
      var constant_val = {
        v: plane.constant,
        dsy: density_model.scale.y,
        dmo: density_model.material.opacity
      }
      var tween = new TWEEN.Tween(constant_val)
      if (visible) {
        tween = tween.to({ v: 0.0, dsy: 1.0, dmo: 1.0 }, tween_time)
      } else {
        tween = tween.to({ v: bbox_radius, dsy: 0.0, dmo: 0.0 }, tween_time)
      }

      tween = tween
        .onUpdate(function () {
          plane.constant = constant_val.v
          plane.coplanarPoint(po.position)
          po.lookAt(
            po.position.x - plane_normal.x,
            po.position.y - plane_normal.y,
            po.position.z - plane_normal.z
          )

          density_model.scale.setComponent(1, constant_val.dsy)
          density_model.material.opacity = constant_val.dmo
        })
        .easing(TWEEN.Easing.Cubic.InOut)

      tween.start()
    }

    return change_state
  }

  return null
}

function init (
  num_cameras,
  bbox_radius,
  object_model,
  camera_model,
  coarse_samples,
  fine_samples,
  distribution_non_hidden_idx
) {
  const camera_poses = GetPointsEquiAngularlyDistancedOnHemiSphere(
    num_cameras + 1,
    bbox_radius * 2.5
  )
  const cam_pose = camera_poses[0].multiplyScalar(3.0)
  const vol_cam_pose = camera_poses.slice(1)

  console.log(cam_pose, vol_cam_pose)

  renderer = new THREE.WebGLRenderer()
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.autoClear = false
  renderer.localClippingEnabled = true

  camera = new THREE.PerspectiveCamera(
    30,
    window.innerWidth / window.innerHeight,
    1,
    1000
  )
  camera.position.fromArray(cam_pose.toArray())
  camera.lookAt(0, 0, 0)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.listenToKeyEvents(window) // optional

  controls.update()

  scene = new THREE.Scene()
  const scene_rtts = vol_cam_pose.map(x => new THREE.Scene())

  const light = new THREE.DirectionalLight(0xfff8f2, 3.5)
  light.position.set(bbox_radius, bbox_radius, bbox_radius)

  scene.add(light)
  scene_rtts.forEach(x => x.add(light.clone()))

  const light_hemi = new THREE.HemisphereLight(0xdee6ff, 0x222222, 2.0)
  scene.add(light_hemi)
  scene_rtts.forEach(x => x.add(light_hemi.clone()))

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)

  scene.add(ambientLight)
  scene_rtts.forEach(x => x.add(ambientLight.clone()))

  scene_rtts.forEach(x => x.add(object_model.clone()))

  window.addEventListener('resize', function () {
    var width = window.innerWidth
    var height = window.innerHeight
    renderer.setSize(width, height)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
  })

  const scene_intersect = new THREE.Scene()
  scene_intersect.add(object_model.clone())
  scene_intersect.updateMatrixWorld()

  const mat = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 4 })
  const plane_geometry = new THREE.PlaneGeometry(
    bbox_radius * 0.75,
    bbox_radius * 0.75
  )
  plane_geometry.rotateX(Math.PI)
  plane_geometry.rotateZ(Math.PI)

  scene.add(object_model)
  let mesh_material = get_material(object_model)

  // This creates a hidden canvas element to lookup the texture colors
  canvas_ctx = document.createElement('canvas').getContext('2d')
  document.body.appendChild(canvas_ctx.canvas)
  canvas_ctx.canvas.style.visibility = 'hidden'
  canvas_ctx.canvas.style.position = 'fixed'
  canvas_ctx.canvas.width = mesh_material.map.image.width
  canvas_ctx.canvas.height = mesh_material.map.image.height
  // ctx.fillStyle = '#FFF';
  // ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  canvas_ctx.drawImage(mesh_material.map.image, 0, 0)

  for (let cam_idx = 0; cam_idx < num_cameras; cam_idx++) {
    console.log('Setting up', cam_idx)
    const scene_rtt = scene_rtts[cam_idx]
    const cam_pos = vol_cam_pose[cam_idx]

    scene_rtt.background = new THREE.Color(0xffffff)

    const cam_model = setup_camera(
      cam_pos,
      plane_geometry,
      mat,
      scene_rtt,
      camera_model,
      bbox_radius
    )
    const cam_toggle = setup_ray(cam_model, bbox_radius)
    cam_ray_toggles.push(cam_toggle)

    const cam_coarse_sample_toggle = setup_coarse_sampling(
      coarse_samples,
      cam_model,
      bbox_radius
    )
    cam_coarse_sample_toggles.push(cam_coarse_sample_toggle)

    let pot_toggle = setup_distribution(
      scene_intersect,
      cam_model,
      object_model,
      bbox_radius,
      coarse_sample_locations[cam_idx],
      cam_idx == distribution_non_hidden_idx
    )
    if (pot_toggle) {
      cam_distribution_toggle = pot_toggle
    }

    coarse_compose_toggles.push(
      setup_compose(scene_intersect, cam_model, bbox_radius, 0.2)
    )

    const cam_fine_sample_toggle = setup_fine_sampling(
      scene_intersect,
      cam_model,
      bbox_radius,
      fine_samples
    )
    cam_fine_sample_toggles.push(cam_fine_sample_toggle)

    fine_compose_toggles.push(
      setup_compose(scene_intersect, cam_model, bbox_radius, 0.01)
    )
  }

  renderer.setRenderTarget(null)
  renderer.clear()
}

export {
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
}
