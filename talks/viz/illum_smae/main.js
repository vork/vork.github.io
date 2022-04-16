const mean = [
  0.047575824, -0.054205943, 0.2330364, 0.019631485, -0.027961334, -0.16158485,
  0.106844604, -0.20533437, 0.34397286, 0.24958481, 0.15826698, -0.036757093,
  -0.22137831, 0.14478247, 0.29407778, -0.5088909, -0.2280513, -0.18502212,
  -0.3207818, 0.018300101, -0.26810998, -0.10717098, -0.0123874955, 0.34632042,
  0.081736326, -0.0018149475, 0.4089243, -0.13374637, -0.06760334, -0.091349006,
  0.29729044, 0.12559652, 0.3121793, 0.101769276, -0.24732594, 0.17364815,
  0.3603307, -0.18067163, -0.21850039, -0.34338737, -0.102174364, 0.1716936,
  -0.17154041, 0.1278356, -0.15443584, -0.34253794, -0.11842036, -0.32116908,
  0.0004900327, 0.113850355, 0.27494535, -0.023313504, -0.008680328,
  -0.12326048, -0.066232584, 0.070965305, -0.0554442, -0.11625351, 0.047352966,
  -0.199979, -0.13865031, -0.06979627, 0.054596785, 0.25769684, 0.028357359,
  -0.0991401, -0.06787253, 0.086964116, -0.29618782, 0.2501924, -0.03345219,
  -0.10465006, 0.090048686, -0.09972678, -0.07080866, 0.23933929, -0.23680727,
  -0.33412108, 0.1194608, -0.19359718, 0.08667845, 0.048015352, 0.02014955,
  -0.3122687, 0.021675078, -0.07759839, 0.27806896, -0.105271295, -0.11777069,
  -0.30319035, -0.030536165, 0.016113795, -0.35352686, -0.33903098, -0.17631286,
  -0.06558889, 0.028451463, 0.08465314, -0.021791527, 0.153043, 0.10842378,
  -0.22806743, 0.12436581, 0.033450276, -0.0021411951, -0.1667644, -0.08100101,
  -0.14269106, 0.5236457, -0.05440521, -0.12148792, 0.05465069, -0.12006799,
  0.029488862, 0.14316937, -0.0052618883, -0.30687982, 0.024451077, -0.1461864,
  -0.19699173, -0.10554288, 0.1168114, -0.33637765, 0.0757939, -0.1859002,
  -0.37486082, -0.104203776, -0.08325185,
];
const std = [
  0.90420645, 0.89437723, 1.3448355, 0.8876517, 3.0670185, 0.7826168, 0.8980852,
  0.8686581, 0.8254443, 1.0210782, 0.99091333, 0.84831387, 1.2172439, 0.8380912,
  1.2669983, 0.9527828, 0.84725314, 0.8619847, 1.1597141, 2.328952, 0.7517669,
  0.8406764, 0.95803773, 0.82808954, 0.87053114, 0.9775822, 0.86308485,
  1.0113163, 1.0850141, 2.9580762, 0.8709758, 0.97662795, 0.9968874, 0.93747497,
  1.5647895, 0.9225618, 1.5116897, 1.0429207, 0.85004115, 0.9342319, 0.8755291,
  1.1575673, 0.9038416, 1.6859584, 0.8866212, 2.0669363, 1.752844, 0.8640579,
  1.0847607, 0.96034724, 1.4292785, 0.96759313, 0.9317533, 0.968588, 0.95168555,
  0.9281904, 1.23441, 1.0961071, 0.931608, 0.8733394, 0.97455794, 0.88041264,
  0.85342824, 1.0057074, 0.9308068, 1.0056504, 0.94196665, 1.0115205, 1.2501614,
  0.9026826, 0.9895561, 0.9550841, 1.0877147, 1.0137395, 1.1594335, 0.872477,
  1.0285414, 1.0306323, 0.89369977, 0.88612586, 0.9656612, 0.8300817,
  0.91436046, 1.2336501, 0.85569006, 0.84396505, 2.3170168, 0.9126632,
  0.92731017, 1.2691517, 0.92248833, 0.93466806, 0.9686326, 0.8415562,
  0.8303234, 0.9934653, 0.99869245, 1.6172967, 0.974183, 0.79016936, 0.95964694,
  0.8822568, 0.86722106, 0.99574906, 0.96685416, 0.88497007, 0.885795,
  0.94276863, 2.5502837, 1.5596133, 1.0166104, 0.8602527, 0.99946415, 1.3986175,
  1.0072218, 0.768749, 0.8002811, 0.8841484, 0.9450201, 1.0457418, 1.1014677,
  0.8938306, 0.90405214, 1.0537871, 1.6390864, 1.1740764, 0.8411807, 1.1331412,
];

import * as THREE from "three";
import { EXRLoader } from "exr_loader";

console.log(window);
tf = window.tf;
dat = window.dat;
console.log(tf);
console.log(dat);

async function setup_model(url) {
  const model = await tf.loadGraphModel(url);
  return model;
}

function convert_array_to_input(arr) {
  const normal_applied = arr.map((x, i) => x * std[i] * 3.0 + mean[i]);
  return tf.tensor2d(normal_applied, [1, mean.length]);
}

function random_values() {
  return mean.map((x) => Math.random() * 2 - 1);
}

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

function linear_to_srgb(x) {
  const switch_val = 0.0031308;
  return x.map((v) => {
    if (v >= switch_val) {
      return 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
    } else {
      return v * 12.92;
    }
  });
}

function partial(x) {
  const A = 0.15;
  const B = 0.5;
  const C = 0.1;
  const D = 0.2;
  const E = 0.02;
  const F = 0.3;
  return (x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F) - E / F;
}

function tonemap(val) {
  return val.map((x) => {
    const exposure_bias = 2.0;
    const curr = partial(x * exposure_bias);

    const W = 11.2;
    const white_scale = 1.0 / partial(W);

    return curr * white_scale;
  });
}

function generate_shapes(height, width) {
  const ret = [];
  for (var y = 0; y < height; y++) {
    const y_norm = y / height + 0.5 / height;
    for (var x = 0; x < width; x++) {
      const x_norm = x / width + 0.5 / width;

      const theta = 2 * x_norm * Math.PI;
      const phi = y_norm * Math.PI;

      ret.push([
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
        Math.sin(phi) * Math.cos(theta),
      ]);
    }
  }

  return ret;
}

function vertexShader() {
  return `
  varying vec3 vViewPosition;
  varying vec3 vNormal;
  varying vec3 vWorldPosition;

  void main() {
    vec4 vViewPosition4 = modelViewMatrix * vec4(position, 1.0);
   
    vViewPosition = vViewPosition4.xyz;
    vNormal = normalMatrix * normal;

    vWorldPosition = (modelMatrix * vec4(position, 1.)).xyz;
    gl_Position = projectionMatrix * vViewPosition4;
  }
  `;
}

function fragmentShader() {
  return `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
  #else
    precision mediump float;
  #endif

  #define M_PI 3.1415926535897932384626433832795

  uniform sampler2D brdfLut;
  uniform sampler2D envMap;

  uniform float roughness;
  uniform vec3 cameraPos;

  varying vec3 vNormal;
  varying vec3 vViewPosition;
  varying vec3 vWorldPosition;

  highp vec3 fresnel_schlick_roughness(in float ndotv, in vec3 specular, in float roughness) {
    float neg_dot = max(1.0 - ndotv, 0.0);
    float neg_dot_sq = neg_dot * neg_dot;
    float neg_dot_5 = neg_dot_sq * neg_dot_sq * neg_dot;
    return specular + (max(vec3(1.0 - roughness), specular) - specular) * neg_dot_5;
  }

  highp vec3 reflect(in vec3 d, in vec3 n) {
    return d - 2.0 * dot(d, n) * n;
  }

  highp vec2 direction_to_uv(in vec3 d) {
    float theta = atan(d.x, d.z);
    float theta_w = clamp(theta > 0.0 ? theta : theta + 2.0 * M_PI, 0.0001, 2.0 * M_PI - 0.0001);
    float phi = acos(d.y);

    return vec2(theta_w / (2.0 * M_PI), phi / M_PI);
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 viewDir = normalize(cameraPos - vWorldPosition);
    vec3 reflectDir = normalize(reflect(-viewDir, normal));

    float ndotv = dot(normal, viewDir);

    vec3 specular = vec3(0.552, 0.571, 0.571);

    vec3 F = fresnel_schlick_roughness(ndotv, specular, roughness);
    highp vec2 brdf_coords = vec2(ndotv, roughness);
    highp vec2 env_coords = direction_to_uv(reflectDir);

    vec3 brdf_lut = texture2D(brdfLut, brdf_coords).rgb;
    vec3 specular_irradiance = texture2D(envMap, env_coords).rgb;

    vec3 spec_eval = specular_irradiance * (F * brdf_lut.x + brdf_lut.y);

    gl_FragColor = vec4(pow(spec_eval / (1.0 + spec_eval), vec3(1.0/2.2)), 1.0);
  }`;
}

const container = document.getElementById("container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  1,
  1000
);
const campos = new THREE.Vector3(0, 0, 2.5);
camera.position.copy(campos);
camera.lookAt(0, 0, 0);

// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);

scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});

function render(renderer, scene, camera, fps = 30) {
  let delta = 0;

  let clock = new THREE.Clock();

  var interval = 1;
  if (fps != null) {
    // Setup a framerate limit
    interval = 1 / fps;
  }

  function animate() {
    requestAnimationFrame(animate);
    delta += clock.getDelta();

    if (delta > interval || fps == null) {
      renderer.render(scene, camera);
      if (fps != null) {
        delta = delta % interval;
      }
    }
  }

  animate();
}

new EXRLoader().load("brdflut.exr", function (brdflut, brdflut_data) {
  function to_texture(data, width, height) {
    const dat = new Float32Array(
      data.map((x) => [...x.map((y) => (y / (1.0 + y)) * 255.0), 255.0]).flat()
    );
    const texture = new THREE.DataTexture(
      dat,
      width,
      height,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    texture.needsUpdate = true;
    return texture;
  }

  function update_texture(texture, data) {
    texture.image.data = new Float32Array(
      data.map((x) => [...x.map((y) => (y / (1.0 + y))), 1.0]).flat()
    );
    texture.needsUpdate = true;
  }

  const uniforms = {
    cameraPos: { value: campos },
    roughness: { value: 0 },
    brdfLut: { type: "t", value: brdflut },
    envMap: {
      type: "t",
      value: to_texture(new Array(256 * 128).fill([1.0, 1.0, 1.0]), 256, 128),
    },
  };
  //material.uniforms.roughness.value
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: vertexShader(),
    fragmentShader: fragmentShader(),
  });

  const CONDITIONAL = "conditional/model.json";
  const MAPPING = "mapping/model.json";
  const OUTPUT = "output/model.json";

  const models = [
    setup_model(MAPPING),
    setup_model(CONDITIONAL),
    setup_model(OUTPUT),
  ];

  function evaluate(
    mapping_model,
    conditional_model,
    output_model,
    latent_normed,
    height = 128,
    width = 256
  ) {
    const normalized = convert_array_to_input(latent_normed);
    let main_maps = mapping_model.predict(normalized);
    // .map((x) => x * tf.ones([height * width, x.shape[1], x.shape[2]]));
    let directions_arr = generate_shapes(height, width).flat();
    let directions_tf = tf.tensor2d(directions_arr, [height * width, 3]);

    function eval_model(roughness) {
      let conditional_maps = conditional_model.predict(
        tf.tensor2d([roughness], [1, 1])
      );
      // .map((x) => x * tf.ones([height * width, x.shape[1], x.shape[2]]));
      let output = output_model.predict([
        directions_tf,
        ...main_maps,
        ...conditional_maps,
      ]);
      return output;
    }

    return eval_model;
  }

  const canvas_ctx = document.createElement("canvas").getContext("2d");
  document.body.appendChild(canvas_ctx.canvas);
  canvas_ctx.canvas.width = 256;
  canvas_ctx.canvas.height = 128;
  canvas_ctx.canvas.style.border = "2px solid black";
  canvas_ctx.canvas.style.position = "absolute";
  canvas_ctx.canvas.style.top = "0";
  canvas_ctx.canvas.style.zIndex = "10";

  const sphere = new THREE.Mesh(
    new THREE.SphereBufferGeometry(1.0, 32, 32),
    material
  );

  scene.add(sphere);

  Promise.all(models).then((models) => {
    let [mapping, conditional, output] = models;

    var matParam = new (function () {
      this.roughness = 0.1;
    })();

    let eval_func = evaluate(mapping, conditional, output, random_values());
    display(matParam.roughness);

    function display(roughness) {
      eval_func(roughness)
        .array()
        .then((evaled) => {
          sphere.material.uniforms.roughness.value = roughness;
          // update_texture( sphere.material.uniforms.envMap.value, evaled)
          // sphere.material.uniforms.envMap.value = to_texture(evaled);
          update_texture(sphere.material.uniforms.envMap.value, evaled);
          sphere.material.needsUpdate = true;
          console.log(sphere.material.uniforms);

          const imageData = canvas_ctx.createImageData(256, 128);
          for (let i = 0; i < imageData.data.length; i += 4) {
            const val_mapped = linear_to_srgb(
              tonemap(evaled[Math.floor(i / 4)])
            ).map((v) => v * 255);
            imageData.data[i + 0] = val_mapped[0]; // R value
            imageData.data[i + 1] = val_mapped[1]; // G value
            imageData.data[i + 2] = val_mapped[2]; // B value
            imageData.data[i + 3] = 255; // A value
          }

          canvas_ctx.putImageData(imageData, 0, 0);
        });
    }

    var gui = new dat.GUI({
      width: 225,
    });
    var btn = {
      reroll: function () {
        eval_func = evaluate(mapping, conditional, output, random_values());
        display(matParam.roughness);
      },
    };
    gui.add(btn, "reroll").name("New Random");
    const roughness = gui
      .add(matParam, "roughness", 0, 1.0)
      .name("Roughness")
      .listen();

    roughness.onChange(() => display(matParam.roughness));

    container.appendChild(renderer.domElement);

    render(renderer, scene, camera);
  });
});
