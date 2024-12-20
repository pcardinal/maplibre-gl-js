export const webpSupported = {
    supported: false,
    testSupport
};

let glForTesting: WebGLRenderingContext|WebGL2RenderingContext;
let webpCheckComplete = false;
let webpImgTest;
let webpImgTestOnloadComplete = false;

if (typeof document !== 'undefined') {
    webpImgTest = document.createElement('img');
    webpImgTest.onload = () => {
        if (glForTesting) testWebpTextureUpload(glForTesting);
        glForTesting = null;
        webpImgTestOnloadComplete = true;
    };
    webpImgTest.onerror = () => {
        webpCheckComplete = true;
        glForTesting = null;
    };
    webpImgTest.src = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAQAAAAfQ//73v/+BiOh/AAA=';
}

function testSupport(gl: WebGLRenderingContext | WebGL2RenderingContext) {
    if (webpCheckComplete || !webpImgTest) return;

    // HTMLImageElement.complete is set when an image is done loading it's source
    // regardless of whether the load was successful or not.
    // It's possible for an error to set HTMLImageElement.complete to true which would trigger
    // testWebpTextureUpload and mistakenly set exported.supported to true in browsers which don't support webp
    // To avoid this, we set a flag in the image's onload handler and only call testWebpTextureUpload
    // after a successful image load event.
    if (webpImgTestOnloadComplete) {
        testWebpTextureUpload(gl);
    } else {
        glForTesting = gl;

    }
}

function testWebpTextureUpload(gl: WebGLRenderingContext|WebGL2RenderingContext) {
    // Edge 18 supports WebP but not uploading a WebP image to a gl texture
    // Test support for this before allowing WebP images.
    // https://github.com/mapbox/mapbox-gl-js/issues/7671
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, webpImgTest);

        // The error does not get triggered in Edge if the context is lost
        if (gl.isContextLost()) return;

        webpSupported.supported = true;
    } catch {
        // Catch "Unspecified Error." in Edge 18.
    }

    gl.deleteTexture(texture);

    webpCheckComplete = true;
}
