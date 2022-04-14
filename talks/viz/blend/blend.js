import interact from
    'https://cdn.interactjs.io/v1.10.11/interactjs/index.js'

function loadImage(url, callback) {
    var image = new Image();
    image.src = url;
    image.onload = callback;
    return image;
}

function loadImages(urls, callback) {
    var images = [];
    var imagesToLoad = urls.length;

    // Called each time an image finished loading.
    var onImageLoad = function () {
        --imagesToLoad;
        // If all the images are loaded call the callback.
        if (imagesToLoad == 0) {
            callback(images);
        }
    };

    for (var ii = 0; ii < imagesToLoad; ++ii) {
        var image = loadImage(urls[ii], onImageLoad);
        images.push(image);
    }
}

function setRectangle(gl, x, y, width, height) {
    var x1 = x;
    var x2 = x + width;
    var y1 = y;
    var y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        x1, y1,
        x2, y1,
        x1, y2,
        x1, y2,
        x2, y1,
        x2, y2,
    ]), gl.STATIC_DRAW);
}

const zip = (a, b) => a.map((k, i) => [k, b[i]]);

function set_blend(gl, alpha_blend_loc, val1, val2) {
    gl.uniform2f(alpha_blend_loc, val1, val2);
}

function render(gl, program, images) {
    var textures = [];
    for (var ii = 0; ii < images.length; ++ii) {
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Set the parameters so we can render any size image.
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        // Upload the image into the texture.
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, images[ii]);

        // add the texture to the array of textures.
        textures.push(texture);
    }

    var tex_units = [gl.TEXTURE0, gl.TEXTURE1, gl.TEXTURE2, gl.TEXTURE3];
    var image_locations = []
    for (var ii = 0; ii < images.length; ++ii) {
        var u_imageLocation = gl.getUniformLocation(program, "u_image" + ii);

        gl.uniform1i(u_imageLocation, ii);

        gl.activeTexture(tex_units[ii]);
        gl.bindTexture(gl.TEXTURE_2D, textures[ii]);
        image_locations.push(u_imageLocation)
    }



    // look up where the vertex data needs to go.
    var positionLocation = gl.getAttribLocation(program, "a_position");
    var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

    // Create a buffer to put three 2d clip space points in
    var positionBuffer = gl.createBuffer();

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, images[0].width, images[0].height);

    // provide texture coordinates for the rectangle.
    var texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
    ]), gl.STATIC_DRAW);

    // lookup uniforms
    var resolutionLocation = gl.getUniformLocation(program, "u_resolution");

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);

    // Turn on the texcoord attribute
    gl.enableVertexAttribArray(texcoordLocation);

    // bind the texcoord buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

    // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(
        texcoordLocation, size, type, normalize, stride, offset);

    // set the resolution
    gl.uniform2f(resolutionLocation, images[0].width, images[0].height);

    // Draw the rectangle.
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    function random_blend() {
        update_blend(u_blend_loc, gl, Math.random(), Math.random());

        setTimeout(random_blend, 1000);
    }

    // random_blend();
}

function update_blend(u_blend_loc, gl, val1, val2) {
    set_blend(gl, u_blend_loc, val1, val2);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function dragMoveListener(width, height, offx, offy, update_func, event) {
    var target = event.target
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy

    // translate the element
    target.style.transform = 'translate(' + x + 'px, ' + y + 'px)'

    // update the posiion attributes
    target.setAttribute('data-x', x)
    target.setAttribute('data-y', y)

    update_func((x + offx) / width, (y + offy) / height);
}

function main(img_list) {
    var canvas = document.querySelector("#WebGL-output");
    var gl = canvas.getContext("webgl");
    if (!gl) {
        return;
    }

    // setup GLSL program
    var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);
    gl.useProgram(program);

    var image_container_ids = [
        "img_top_left", "img_top_right", "img_bot_left", "img_bot_right"
    ];

    zip(image_container_ids, img_list).forEach(function (item) {
        document.getElementById(item[0]).style.backgroundImage = "url(" + item[1] + ")";
    });

    loadImages(img_list, function (imgs) { render(gl, program, imgs) });

    var u_blend_loc = gl.getUniformLocation(program, "blend_alpha");

    var selector = document.querySelector("#drag-1");
    var update_blend_func_local = function (val1, val2) {
        update_blend(u_blend_loc, gl, val1, val2);
    }
    interact('.draggable')
        .draggable({
            // enable inertial throwing
            inertia: true,
            // keep the element within the area of it's parent
            modifiers: [
                interact.modifiers.restrictRect({
                    restriction: 'parent',
                    endOnly: true
                })
            ],
            // enable autoScroll
            autoScroll: true,

            listeners: {
                // call this function on every dragmove event
                move: function (event) {
                    var bounds = canvas.getBoundingClientRect()
                    var selbounds = selector.getBoundingClientRect()

                    dragMoveListener(bounds.width - selbounds.width, bounds.height - selbounds.height, selbounds.width / 2, selbounds.height / 2, update_blend_func_local, event);
                },

                // call this function on every dragend event
                end(event) { }
            }
        });

    window.dragMoveListener = dragMoveListener
}

main([
    "alley.png",
    "christmasphotostudio.png",
    "fireonsky.png",
    "studiosmall.png",
]);