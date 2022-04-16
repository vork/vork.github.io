const mean = [0.06426890185123511, 0.09494116318799094, 0.2332199619523088, 2.3827225027081593]
const std = [0.03009282929277891, 0.011115828710593561, 0.015823922071621217, 0.5211065446711474]

async function setup_model() {
    const MODEL_URL = 'network/model.json';
    const model = await tf.loadGraphModel(MODEL_URL);
    return model
}

function convert_array_to_input(arr) {
    const normal_applied = arr.map((x, i) => (x * std[i] * 3) + mean[i])
    return tf.tensor2d(normal_applied, [1, mean.length])
}

function random_values() {
    return mean.map(x => Math.random() * 2 - 1)
}

function tensor_to_material(tensor) {
    const diffuse = tensor[0].slice(0, 3)
    const specular = tensor[0].slice(3, 6)
    const roughness = tensor[0].slice(6, 7)
    return [diffuse, specular, roughness]
}

async function predict_values(model, values) {
    const normalized = convert_array_to_input(values)
    const result = await model.predict(normalized).array();
    return tensor_to_material(result)
}



window.addEventListener('DOMContentLoaded', function () {
    var scene;
    var sphere;
    var plane;
    var material;
    var engine;
    var canvas;
    var shaderMaterial;
    var colorMapTexture;

    BABYLON.Effect.ShadersStore["brdfVertexShader"] = "precision highp float;\r\n" +

        "// Attributes\r\n" +
        "attribute vec3 position;\r\n" +
        "attribute vec3 normal;\r\n" +
        "attribute vec2 uv;\r\n" +

        "// Uniforms\r\n" +
        "uniform mat4 worldViewProjection;\r\n" +
        "uniform float diffuse;\r\n" +
        "uniform float specular;\r\n" +
        "uniform float roughness;\r\n" +
        "uniform sampler2D colorMapSampler;\r\n" +

        "// Varying\r\n" +
        "varying vec3 vColor;\r\n" +

        "// Constants\r\n" +
        "const vec3 lo = normalize(vec3(-1.0, 1.0, 0.0));\r\n" +
        "const vec3 lo_mirror = normalize(vec3(1.0, 1.0, 0.0));\r\n" +

        "const float PI = 3.1415926535897932384626433832795;\r\n" +
        "const float PI_2 = 1.57079632679489661923;\r\n" +
        "const float PI_4 = 0.785398163397448309616;\r\n" +
        "const float REC_PI = 0.318309886183790671537767526745;\r\n" +

        "const float scale = 0.45;\r\n" +

        "float geometric_func(float vdh, float alpha) {\r\n" +
        "    return (vdh * 2.0) / max(0.00001, vdh + (sqrt(max(0.00001, alpha + (1.0 - alpha) * vdh * vdh))));\r\n" +
        "}\r\n" +

        "float eval_brdf(vec3 li) {\r\n" +
        "    vec3 n = vec3(0.0, 1.0, 0.0);\r\n" +
        "    vec3 h = normalize(li + lo);\r\n" +
        "    \r\n" +
        "    float ndv = clamp(dot(n, lo), 0.0, 1.0);\r\n" +
        "    float ndl = clamp(dot(n, li), 0.0, 1.0);\r\n" +
        "    float ldh = clamp(dot(li, h), 0.0, 1.0);\r\n" +
        "    float ndh = clamp(dot(n, h), 0.0, 1.0);\r\n" +
        "    \r\n" +
        "    float diff = diffuse * ndv * REC_PI;\r\n" +
        "    \r\n" +
        "    float a = roughness * roughness;\r\n" +
        "    float a2 = a * a;\r\n" +
        "    \r\n" +
        "    // Fresnel\r\n" +
        "    float ct = clamp(1.0 - ldh, 0.0, 1.0);\r\n" +
        "    float ctsq = ct * ct;\r\n" +
        "    float ct5 = ctsq * ctsq * ct;\r\n" +
        "    float f = specular + (1.0 - specular) * ct5;\r\n" +
        "    \r\n" +
        "    // Geometric self attenuation\r\n" +
        "    float g = geometric_func(ndl, a2) * geometric_func(ndv, a2);\r\n" +
        "    \r\n" +
        "    // ndf\r\n" +
        "    float denom = (ndh * ndh) * (a2 - 1.0) + 1.0;\r\n" +
        "    float denom2 = denom * denom;\r\n" +
        "    \r\n" +
        "    float d = a2 / max(0.00001, PI * denom2);\r\n" +
        "    \r\n" +
        "    float spec = (f * g * d) / max(0.00001, 4.0 * ndl);\r\n" +
        "    \r\n" +
        "    float brdf = diff + spec;\r\n" +
        "    \r\n" +
        "    return brdf;\r\n" +
        "}\r\n" +

        "vec3 sperical_to_cartesian(vec2 uv) {\r\n" +
        "    float theta = uv.x * PI;\r\n" +
        "    float phi = uv.y * PI;\r\n" +
        "    \r\n" +
        "    float x = sin(phi) * cos(theta);\r\n" +
        "    float y = sin(phi) * sin(theta);\r\n" +
        "    float z = cos(phi);\r\n" +
        "    \r\n" +
        "    return vec3(x, y, z);\r\n" +
        "}\r\n" +

        "void main() {\r\n" +
        "    vec3 li = sperical_to_cartesian(uv);\r\n" +
        "    float brdf = eval_brdf(li);\r\n" +
        "    float max_brdf = eval_brdf(lo_mirror);\r\n" +
        "    \r\n" +
        "    float scaled_brdf = clamp(brdf / max_brdf, 0.0, 1.0);\r\n" +
        "    \r\n" +
        "    vec3 c = texture2D(colorMapSampler, vec2(scaled_brdf, 0.0)).rgb;\r\n" +
        "    vec4 p = vec4(li * scaled_brdf * scale, 1. );\r\n" +

        "    vColor = c;\r\n" +

        "    gl_Position = worldViewProjection * p;\r\n" +

        "}\r\n";

    BABYLON.Effect.ShadersStore["brdfFragmentShader"] = "precision highp float;\r\n" +

        "uniform mat4 worldView;\r\n" +

        "varying vec3 vColor;\r\n" +

        "void main(void) {\r\n" +
        "    gl_FragColor = vec4( vColor, 1. );\r\n" +
        "}\r\n";

    var matParam = new function () {
        this.embd1_1 = Math.random() * 2 - 1;
        this.embd1_2 = Math.random() * 2 - 1;
        this.embd1_3 = Math.random() * 2 - 1;
        this.embd1_4 = Math.random() * 2 - 1;
        this.embd2_1 = Math.random() * 2 - 1;
        this.embd2_2 = Math.random() * 2 - 1;
        this.embd2_3 = Math.random() * 2 - 1;
        this.embd2_4 = Math.random() * 2 - 1;
        this.alpha = 0.5;
    };

    function init(brdf_model) {
        canvas = document.getElementById("WebGL-output");
        console.log("init");
        engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

        var scene = new BABYLON.Scene(engine);
        scene.useRightHandedSystem = true; // x left, y up, z camera direction
        scene.clearColor = new BABYLON.Color3(1.0, 1.0, 1.0);

        var fov = 32;
        var fovrad = Math.tan((fov * Math.PI / 180));
        // Align camera with coordinate system assumption
        var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI * 1.5, Math.PI * 0.5, 1.5, BABYLON.Vector3.Zero(), scene);

        camera.fov = fovrad;
        camera.lowerRadiusLimit = 0.1;
        camera.upperRadiusLimit = 3;

        //camera.attachControl(canvas, true);

        var light = new BABYLON.PointLight("light1", new BABYLON.Vector3(2, 2, -2), scene);
        light.intensity = 15

        plane = BABYLON.MeshBuilder.CreateGround("eval", {
            subdivisions: 175,
            updatable: true
        }, scene);
        // Compile
        if (!shaderMaterial)
            shaderMaterial = new BABYLON.ShaderMaterial("shader", scene, {
                vertex: "brdf",
                fragment: "brdf",
            }, {
                attributes: ["position", "normal", "uv"],
                uniforms: ["world", "worldView", "worldViewProjection", "view", "projection"]
            });

        if (!colorMapTexture) {
            var colorMapTexture = new BABYLON.Texture("JetColormap.png", scene);
            colorMapTexture.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE;
            colorMapTexture.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE;
        }

        function setBrdf(dff, spc, rgh) {
            shaderMaterial.setFloat("diffuse", (dff.r + dff.g + dff.b) / 3.0);
            shaderMaterial.setFloat("specular", (spc.r + spc.g + spc.b) / 3.0);
            shaderMaterial.setFloat("roughness", rgh);
        }

        shaderMaterial.setTexture("colorMapSampler", colorMapTexture);

        shaderMaterial.backFaceCulling = true;
        plane.material = shaderMaterial;

        material = new BABYLON.PBRSpecularGlossinessMaterial("pbr", scene);
        function run_predict_from_params() {
            const val1 = [matParam.embd1_1, matParam.embd1_2, matParam.embd1_3, matParam.embd1_4];
            const val2 = [matParam.embd2_1, matParam.embd2_2, matParam.embd2_3, matParam.embd2_4];
            const alpha = matParam.alpha
            const interpol = val1.map((x, i) => {
                return x * (1.0 - alpha) + val2[i] * alpha;
            })

            predict_values(brdf_model, interpol).then(params => {
                material.diffuseColor = new BABYLON.Color3(...params[0]);
                material.specularColor = new BABYLON.Color3(...params[1]);
                material.glossiness = 1.0 - params[2];

                setBrdf(new BABYLON.Color3(...params[0]), new BABYLON.Color3(...params[1]), params[2])
            })
        }
        run_predict_from_params()

        sphere = BABYLON.MeshBuilder.CreateSphere("sphere", {
            diameter: 1
        }, scene);
        sphere.material = material;
        sphere.translate(BABYLON.Axis.Z, 0.5, BABYLON.Space.WORLD);

        light.includedOnlyMeshes.push(sphere)

        // Face the viewer
        plane.rotateAround(BABYLON.Vector3.Zero(), BABYLON.Vector3.Up(), Math.PI);
        plane.translate(BABYLON.Axis.Z, -0., BABYLON.Space.WORLD);
        const plane_y_offset = -0.35;
        plane.translate(BABYLON.Axis.Y, plane_y_offset, BABYLON.Space.WORLD);

        let eye_mesh, light_mesh;
        var light1 = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(-1, 1, 0), scene);
        light1.diffuse = new BABYLON.Color3(1, 1, 1);
        light1.specular = new BABYLON.Color3(1, 1, 1);
        light1.groundColor = new BABYLON.Color3(0, 0, 0);
        light1.excludedMeshes.push(plane, sphere);

        BABYLON.SceneLoader.Append("../nerf_explainer/", "Camera.glb", scene, function (scene) {
            // do something with the scene
            const geoms = scene.meshes
            const new_append = geoms[geoms.length - 1]

            new_append.position = new BABYLON.Vector3(-0.4,0.4+plane_y_offset,0);	

            var lookAt = BABYLON.Matrix.LookAtLH(new_append.position, new BABYLON.Vector3(0, plane_y_offset, 0), BABYLON.Vector3.Up()).invert();
            new_append.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(lookAt);
            
            new_append.scaling = new BABYLON.Vector3(0.05,0.05,0.05);	

            console.log(new_append);
        });

        BABYLON.SceneLoader.Append("../infinite_distant_explainer/", "LightBulb.glb", scene, function (scene) {
            // do something with the scene
            const geoms = scene.meshes
            const new_append = geoms[geoms.length - 1]

            
            new_append.position = new BABYLON.Vector3(0.4,0.4+plane_y_offset,0);

            // var lookAt = BABYLON.Matrix.LookAtLH(new_append.position, new BABYLON.Vector3(0, plane_y_offset, 0), BABYLON.Vector3.Up());
            // new_append.rotationQuaternion = BABYLON.Quaternion.FromRotationMatrix(lookAt);
            
            new_append.scaling = new BABYLON.Vector3(0.05,0.05,0.05);

            console.log(new_append);
        });

        const options = {
            points: [
                new BABYLON.Vector3(0,plane_y_offset,0), 
                new BABYLON.Vector3(0,0.475+plane_y_offset,0),
                new BABYLON.Vector3(0.025,0.45+plane_y_offset,0),
                new BABYLON.Vector3(0,0.475+plane_y_offset,0),
                new BABYLON.Vector3(-0.025,0.45+plane_y_offset,0)
            
            ], //vec3 array,
            updatable: false
        }

        let lines = BABYLON.MeshBuilder.CreateLines("lines", options, scene).color = BABYLON.Color3.Red();

        var gui = new dat.GUI({
            // height: 16 * 8 - 1,
            width: 225,
        });

        var btn = { reroll:function(){ 
            matParam.embd1_1 = Math.random() * 2 - 1;
            matParam.embd1_2 = Math.random() * 2 - 1;
            matParam.embd1_3 = Math.random() * 2 - 1;
            matParam.embd1_4 = Math.random() * 2 - 1;
            
            matParam.embd2_1 = Math.random() * 2 - 1;
            matParam.embd2_2 = Math.random() * 2 - 1;
            matParam.embd2_3 = Math.random() * 2 - 1;
            matParam.embd2_4 = Math.random() * 2 - 1;

            run_predict_from_params()
        }};

        gui.add(btn,'reroll').name("New Random");

        const embd1 = gui.addFolder('Embd. 1')
        const embd1_1 = embd1.add(matParam, "embd1_1", -1.0, 1.0).name("1").listen();
        const embd1_2 = embd1.add(matParam, "embd1_2", -1.0, 1.0).name("2").listen();
        const embd1_3 = embd1.add(matParam, "embd1_3", -1.0, 1.0).name("3").listen();
        const embd1_4 = embd1.add(matParam, "embd1_4", -1.0, 1.0).name("4").listen();

        const embd2 = gui.addFolder('Embd. 2')
        const embd2_1 = embd2.add(matParam, "embd2_1", -1.0, 1.0).name("1").listen();
        const embd2_2 = embd2.add(matParam, "embd2_2", -1.0, 1.0).name("2").listen();
        const embd2_3 = embd2.add(matParam, "embd2_3", -1.0, 1.0).name("3").listen();
        const embd2_4 = embd2.add(matParam, "embd2_4", -1.0, 1.0).name("4").listen();

        const alpha = gui.add(matParam, "alpha", 0.0, 1.0).name("Interp.")

        const functions = [embd1_1, embd1_2, embd1_3, embd1_4, embd2_1, embd2_2, embd2_3, embd2_4, alpha]
        functions.forEach(x => x.onChange(() => run_predict_from_params()))

        return scene;
    }

    setup_model().then(m => {
        scene = init(m);

        engine.runRenderLoop(function () {
            scene.render();
        });

        window.addEventListener("resize", function () {
            engine.resize();
        });
    })
});
