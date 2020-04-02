var canvas = document.getElementById("renderCanvas"); // Get the canvas element 
var engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine

var pbrMaterial;

var uncompressDepth = function (val) {
    return 1.0 / (2.0 * 2.5 * val + 0.7)
}

var meshCreatedCallback = function (mesh) {
    mesh.material = pbrMaterial;
    // mesh.rotate(BABYLON.Axis.X, Math.PI, BABYLON.Space.WORLD);
}

var createGridColumn = function (grid, basepath, matId, mapFile, mapName, pos) {
    var col = pos % grid.columnCount;
    var row = Math.floor(pos / grid.columnCount) * 2;

    var text = new BABYLON.GUI.TextBlock();
    text.text = mapName;
    text.color = "white";
    text.fontSize = 14;
    grid.addControl(text, row, col);

    var image = new BABYLON.GUI.Image(mapName, basepath + matId + "/" + mapFile);
    image.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
    grid.addControl(image, row + 1, col);
}

var createScene = function () {
    var urlParams = new URLSearchParams(window.location.search);
    var material = urlParams.get('mat')
    if (material === null) {
        material = "1";
    }
    var basepath = "predictions/"

    var scene = new BABYLON.Scene(engine);
    var distanceToZero = 0.7;
    var fov = 45;
    var fovrad = Math.tan((fov * Math.PI / 180));
    var size = distanceToZero * fovrad * 2;
    var near = uncompressDepth(1);
    var far = uncompressDepth(0);

    var skybox = BABYLON.Mesh.CreateBox("skyBox", 100.0, scene);
    var skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.disableLighting = true;
    skybox.material = skyboxMaterial;
    skybox.infiniteDistance = true;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture(basepath + material + "/env.dds", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;

    var camera = new BABYLON.ArcRotateCamera("camera1", Math.PI * 0.5, 0, far + distanceToZero, BABYLON.Vector3.Zero(), scene);
    camera.fov = fovrad;
    camera.lowerRadiusLimit = 100 / 7.0;
    camera.upperRadiusLimit = 3;

    camera.attachControl(canvas, true);

    var light = new BABYLON.PointLight("light1", BABYLON.Vector3.Zero(), scene);
    light.intensity = 30;
    light.parent = camera;

    var groundPlane = BABYLON.Mesh.CreateGroundFromHeightMap("groundPlane", basepath + material + "/output_depth.jpg", size, size, 20, near, far, scene, false, meshCreatedCallback);
    groundPlane.rotation.y = Math.PI;

    pbrMaterial = new BABYLON.PBRSpecularGlossinessMaterial("pbr", scene);

    pbrMaterial.diffuseTexture = new BABYLON.Texture(basepath + material + "/diffuse_alpha.png", scene);
    pbrMaterial.diffuseTexture.hasAlpha = true;
    pbrMaterial.specularColor = new BABYLON.Color3(1.0, 1.0, 1.0);
    pbrMaterial.glossiness = 1.0; // Let the texture controls the value 
    envMap = BABYLON.CubeTexture.CreateFromPrefilteredData(basepath + material + "/env.dds", scene);
    envMap.gammaSpace = false;
    pbrMaterial.environmentTexture = envMap;
    pbrMaterial.specularGlossinessTexture = new BABYLON.Texture(basepath + material + "/spec_gloss.png", scene);
    pbrMaterial.bumpTexture = new BABYLON.Texture(basepath + material + "/output_normal.jpg", scene);
    pbrMaterial.useParallax = true;
    pbrMaterial.useParallaxOcclusion = true;
    //pbrMaterial.invertNormalMapX = true;
    //pbrMaterial.invertNormalMapY = true;

    var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
    var uiSize = advancedTexture.getSize();
    var aspectRatio = uiSize.width / uiSize.height;
    console.log(uiSize, aspectRatio);

    var grid = new BABYLON.GUI.Grid();


    var textHeight = 0.03;
    if (aspectRatio < 1.0) {
        grid.addColumnDefinition(1.0 / 4.0); // 0 
        grid.addColumnDefinition(1.0 / 4.0); // 1
        grid.addColumnDefinition(1.0 / 4.0); // 2
        grid.addColumnDefinition(1.0 / 4.0); // 3
        grid.addRowDefinition(textHeight); // Header 
        grid.addRowDefinition(0.125); // Images
        grid.addRowDefinition(textHeight); // Header 
        grid.addRowDefinition(0.125); // Images
        grid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        grid.height = (0.125 + textHeight) * 2.0;
        grid.width = 1.0;
    } else {
        grid.addColumnDefinition(1.0 / 7.0); // 0 - Input
        grid.addColumnDefinition(1.0 / 7.0); // 1 - Diffuse
        grid.addColumnDefinition(1.0 / 7.0); // 2 - Specular
        grid.addColumnDefinition(1.0 / 7.0); // 3 - Roughness
        grid.addColumnDefinition(1.0 / 7.0); // 4 - Normal
        grid.addColumnDefinition(1.0 / 7.0); // 5 - Depth
        grid.addColumnDefinition(1.0 / 7.0 * 2.0); // 6 - Env (2 wide)
        grid.addRowDefinition(textHeight); // Header 
        grid.addRowDefinition(0.2); // Images
        grid.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
        grid.height = 0.2 + textHeight;
        grid.width = 1.0;
    }

    advancedTexture.addControl(grid);

    createGridColumn(grid, basepath, material, "input_flash.jpg", "Input", 0);
    createGridColumn(grid, basepath, material, "output_diffuse.jpg", "Diffuse", 1);
    createGridColumn(grid, basepath, material, "output_specular.jpg", "Specular", 2);
    createGridColumn(grid, basepath, material, "output_roughness.jpg", "Roughness", 3);
    createGridColumn(grid, basepath, material, "output_normal.jpg", "Normal", 4);
    createGridColumn(grid, basepath, material, "output_depth.jpg", "Depth", 5);
    createGridColumn(grid, basepath, material, "env.jpg", "Environment", 6);
    return scene;

};