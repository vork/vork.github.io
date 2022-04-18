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

// const env_maps = [
//   [-0.65142584, -0.93752617, -0.50904006, 0.21704662, 0.6813029, -0.5282879, -0.08291856, -0.28318098, 0.58060586, -0.13292582, -0.034498714, -0.068174124, 0.6505595, 0.06016847, -0.1578655, 0.069256015, 0.7455233, 0.51535064, -0.087894976, 0.7464299, -0.4631139, 0.8890742, -0.013322905, -0.8526284, -0.05521484, 0.5542035, 0.7444761, -0.0947619, 0.030872464, -0.30824962, -0.40886393, -0.12989298, -0.19228157, 0.2878599, 0.25814798, 0.5113153, -0.3365585, -0.0047711506, -0.58060354, 0.21317397, 0.1486267, 0.121971525, 0.04746168, 1.2495428, 0.15356372, 0.106805325, 0.4149328, -0.21232, -0.25507084, 0.38727137, 0.19450212, -0.5482668, 0.7142878, 0.5057471, 0.6082878, 0.9333483, -0.5858037, 0.30074906, 0.33776885, -0.1381091, -0.010817172, -0.6688276, -0.8364074, -0.71313, 0.24076727, 0.49644625, -0.5850959, -0.20543718, 0.894538, -0.29792643, -0.44816428, 0.6914637, -0.2991036, -0.7061343, 0.23954168, -0.31259784, -0.36281663, -0.20854318, -1.5680517, -0.8236337, -1.5000051, 1.6308091, -0.057486944, -0.11987639, -0.7913507, 0.23832375, 0.90824795, -0.58743125, -0.30571842, -0.7555557, -0.46885696, 0.1653145, -0.1473748, 0.20552686, -0.8780758, 0.45715928, 0.006635, -0.56297004, 0.3192643, 0.15914442, 0.571573, -0.21797529, -0.1990359, 0.19192718, 0.30987722, -0.13408132, 1.1090677, -0.5790482, 1.152064, -0.5076972, 0.27995753, 0.6057349, 0.29835367, 0.09057598, -0.867833, -0.12738246, -0.32401633, -0.46142432, -0.39794898, 0.021200042, -0.3974503, 0.6659856, -0.080440894, 0.77927214, 0.108623296, 0.00056187063, -0.055230513, -0.35659617],
//   [0.8764052, -0.208117, -0.46030378, 0.20513612, 0.34624207, 0.19259517, 0.6958444, 0.48016614, -1.1414218, 0.35787368, 0.19711173, -0.30426118, 0.8509569, 2.2667356, 0.98520696, -0.30274844, -5.1341386, -0.18783747, 0.27870533, -0.7198178, 3.0848947, 1.3237877, 4.1165032, -0.31278497, 0.5754845, -0.76747394, -1.5366155, 1.2274153, 0.88788116, 0.9788045, 0.4121265, -0.497979, -0.34969243, 0.53455925, 0.7851178, -1.7807547, -1.0065347, 0.53702015, -0.60083634, 0.11146109, -0.43119323, -0.754922, -0.15743817, 0.048221197, -0.34201705, 9.6671095, 0.58685195, 1.1127996, -1.3727261, -8.744777, 0.80933034, -0.6051745, 0.13288404, -6.93271, -0.2110523, -0.43991044, -0.62572587, 0.3197472, -0.5273839, -1.2653557, 0.6446262, -0.47129387, -0.05875589, 2.3642092, 0.60251015, 0.5646354, -0.08292312, 0.047685128, -0.26550686, 0.71106917, -0.26694012, -1.115171, 0.5856441, 0.9180982, -0.034807973, 0.293173, 0.7837594, 0.10153514, 0.32361937, -1.8673092, -0.27315342, 0.08425559, 0.04516097, 0.2290432, -1.1535169, -0.2581011, 0.285733, 1.8053769, 0.24147587, 0.3622518, -0.32660404, -0.5069769, 1.3664, -0.052649826, 1.7847764, -0.29854333, -0.53596175, -0.65700907, 0.38116008, 0.36573282, -0.77398515, -3.192238, 1.5382642, -0.348477, -0.7154487, 1.2753906, -0.010321231, 0.19518635, 0.39418858, 0.19358303, 0.29509413, 2.3124645, 0.35678607, 0.24491656, 0.42199725, -0.9821932, 0.014122963, -1.5408103, -1.1330122, -0.46610907, -0.039154217, 0.68800294, -0.5379341, 0.40276864, -1.2235991, -0.40788734, -1.1144041, 0.43468088],
//   [0.17980082, 0.18695883, -0.006603604, -0.7602791, 0.119182095, -0.5977344, -0.5026791, 0.28563935, -0.8558867, -0.43050617, -1.605425, -0.23451836, 0.073258474, 0.29674396, 0.045116596, -1.599839, -2.2174106, 0.76443875, -0.11453268, -0.016560242, -2.2893038, 0.14036658, -1.699373, 0.2421168, 0.38790897, 0.30686125, 0.30291212, 0.9778587, 0.28626046, 1.0378735, 0.2624102, 0.3567558, -0.763473, 0.043122128, 0.17250942, -0.092758894, -0.9666251, 0.6812642, -1.2357341, 0.015142484, -0.16914599, 0.3875866, 1.2029691, 1.1391371, 0.82228386, 0.6029507, 1.0886358, 1.3400524, -0.29266673, -0.2548302, 0.3834728, -0.33283323, -0.8193182, -0.035104875, -0.28263587, -0.8086454, 0.8040103, -0.3835995, 0.8433032, -1.3423152, 0.3503392, -0.041696332, 0.0003129989, -2.598519, 1.5223312, -0.0706802, 0.1431104, -0.26350904, -0.4038586, 0.76866835, -0.035678737, 1.638572, -0.32777128, 0.23552005, 1.1668576, 0.25035003, 1.2567655, -0.7820796, -0.880816, -1.7504379, 0.16625059, 0.69186544, -0.5829829, 0.15554811, 0.775251, 0.42670462, -0.98660254, 0.028728463, -0.98642373, -0.26842636, -0.23061243, 1.748301, 1.4780073, 0.08223124, 0.017260216, -0.56398326, -0.17938036, 0.17785442, -2.078359, 0.5789241, -1.7049623, 1.5504262, -0.56601846, 0.44536108, 0.5848659, -0.32497507, -0.48746467, -1.8455762, 0.97133726, 0.9609794, -1.208415, 0.04019232, -0.6923919, 0.110980004, 0.74489075, -2.3186924, -0.02739507, -0.8184991, 0.0734768, 0.48716694, 0.4468786, 1.4328462, 1.4078737, 1.1456901, -1.1907862, 0.33063895, -0.15104397, 0.49405795],
//   [-0.46775466, -0.23865803, 0.016057337, 0.3982923, 0.61959237, -0.30264473, -0.656844, -0.14084345, -1.7686864, -0.629057, 0.09590451, -0.32542554, 0.105576806, -0.08239925, 0.68256444, 0.620441, -0.658419, 0.29111755, -0.07782255, -0.76388776, -0.41002512, 0.015572209, 0.085896894, -0.01227299, 0.2818259, 0.471652, -0.7271706, 0.45792183, 0.26952958, -0.19722363, -0.46656528, -1.4525952, -0.12888736, 0.50237536, -0.7304341, -0.7030223, 0.20843525, -0.43330368, -0.64471066, -0.5180962, 0.53845286, 0.56357276, -0.31405753, 0.124601066, -0.08469782, -0.77724516, 0.16439356, 0.13563997, 0.7953205, 2.829467, -1.7968824, -0.7612035, -0.1351313, 1.3380262, 0.055048138, 1.0392615, 0.2238014, 0.24650463, 0.94348323, -0.2519254, -1.2021668, -0.7361583, -0.20997773, -0.68811655, 0.57833844, 0.11697216, -0.7806564, 0.3170662, 0.3212597, 0.62264043, 0.72939366, -0.23669769, -0.13580082, 0.52359, -0.15564829, 0.22421336, -0.37190455, -0.22610891, -0.2403247, -0.062255953, -0.8842242, 1.8009515, 0.20218161, -0.43056566, -0.29157048, 0.1644296, -0.62160134, -0.7143424, -0.742113, 0.37582016, 0.794619, 0.1324536, 0.8641105, 0.3907371, -1.358912, 0.38669455, 0.028643124, 0.4156944, -0.28584898, 0.42105415, 0.36133474, 0.3217217, 0.52865034, -0.117459565, 0.88762975, -1.0299553, -0.58149415, -0.3471553, 0.7013442, -0.9428561, -0.57931805, 0.3900541, 1.0739716, 0.13812768, -0.70489943, 0.07748234, 1.0160651, -0.29893526, 0.66692287, -0.064329654, -0.73143345, -0.61561453, 0.1985095, -0.0149698835, 0.0648482, -0.6054677, -0.756963, -0.3935613],
//   [0.77248603, -0.94943005, 0.40134436, -0.007875385, 0.34753162, -0.6500492, -1.1689019, -0.4357382, -0.8900826, 0.7482003, 0.123676576, 0.65491253, 0.91584384, -0.29489592, 0.30004144, 0.49188918, -2.2334569, 0.18908691, -0.586867, -0.3879288, 1.9894719, -0.98186755, -0.6561526, -1.4157252, 1.948768, -0.8452221, 0.7726623, 0.10539298, 0.86597526, -0.011625009, -0.2374671, 0.38686594, 0.98922956, -0.9047545, 1.092946, 1.4617622, -0.3868167, -0.42925343, -0.14183474, 0.5334278, 0.31677872, 0.019667666, 0.2810793, -1.1322924, 0.82302284, 3.1254237, 0.2883702, -0.86577433, -0.1737674, -1.7843683, -0.9052098, 0.070520625, 0.5651723, -2.6949193, -0.039186172, -0.1882679, -0.14342213, 0.6382532, -0.2243543, -0.7882298, -1.5548044, 0.55250865, 0.11544354, -0.18813966, 0.71550333, 1.4540236, -1.0509186, -0.33581963, 0.24257778, -0.37446946, 0.16915518, 0.26148856, 0.5181284, 0.27003768, -0.8598206, -0.4900256, 0.74384785, -0.48511258, 0.6903915, -0.63323677, -1.1543405, -2.360643, -1.699231, 0.5732135, -1.2784189, -1.69515, 0.6170672, 0.016218029, 0.7669469, 1.1321486, 0.16148108, -0.1655851, 0.07657722, -2.8970845, -1.1426136, 1.5479563, -0.008159719, -1.454349, 0.15625998, -0.73986685, -1.0590427, -0.25074556, 0.76903015, 0.92665756, -0.52050346, 0.027317613, -0.84172714, 0.16425669, 0.3539896, -0.242892, 0.0077768527, 0.9656998, -0.45869148, -0.17196903, -0.36930978, 0.2438212, -0.03730601, 0.23181811, 0.3421784, 1.3798463, 1.2352581, -0.8942641, -0.3881449, 1.1364715, -1.1435133, 0.8237258, 0.6625319, 1.1321356]
//   ]
  
//   for (var i = 0; i< env_maps.length - 1; i+=1) {
//     var a = env_maps[i]
//     var b = env_maps[i+1]
//     if (a.length != b.length) {
//       console.log("Not equal length of env map", i, i+1)
//     }
//   }

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
  const normal_applied = arr.map((x, i) => x * std[i] * 2.2 + mean[i]);
  return tf.tensor2d(normal_applied, [1, mean.length]);
}

// function convert_array_to_input(arr) {
//   // const normal_applied = arr.map((x, i) => x * std[i] * 3.0 + mean[i]);
//   return tf.tensor2d(arr, [1, env_maps[0].length]);
// }

function random_values() {
  return mean.map((x) => Math.random() * 2 - 1);
}

// function random_values() {
//   var all_idxs = [...Array(env_maps.length).keys()];
//   var random_idxs = shuffle(all_idxs)
//   console.log(random_idxs)
//   var env1 = env_maps[random_idxs[0]]
//   var env2 = env_maps[random_idxs[1]]
//   var interpol = 0.0;//Math.random()
//   console.log(interpol)
//   return env1.map((x, i) => env1[i] * (1.0 - interpol) + env2[i] * interpol);
// }

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

function aces_approx(val) {
    const v = val * 0.6
    const a = 2.51
    const b = 0.03
    const c = 2.43
    const d = 0.59
    const e = 0.14
    return clamp((v * (a * v + b)) / (v * (c * v + d) + e), 0.0, 1.0)
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

  highp vec3 aces_approx(in vec3 val) {
    vec3 v = val * 0.6;
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((v * (a * v + b)) / (v * (c * v + d) + e), 0.0, 1.0);
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

    gl_FragColor = vec4(pow(aces_approx(spec_eval), vec3(1.0/2.2)), 1.0);
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
              evaled[Math.floor(i / 4)].map((e) => aces_approx(e))
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
