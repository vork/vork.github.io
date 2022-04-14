import * as THREE from 'three'
import * as TWEEN from 'tweenjs'

function render (renderer, scene, camera, controls, stats = null, fps = 30) {
  console.log('Rendering')

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
      if (controls != null) {
        controls.update()
      }

      TWEEN.update()

      renderer.render(scene, camera)

      if (stats != null) {
        stats.update()
      }

      if (fps != null) {
        delta = delta % interval
      }
    }
  }

  animate()
}

export { render }
