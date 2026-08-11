const images = document.querySelectorAll(".change-bg");

images.forEach((image) => {
    function changeBackground() {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const width = image.naturalWidth;
        const height = image.naturalHeight;

        canvas.width = width;
        canvas.height = height;

        context.drawImage(image, 0, 0, width, height);

        const imageData = context.getImageData(
            0,
            0,
            width,
            height
        );

        const pixels = imageData.data;

        for (let i = 0; i < pixels.length; i += 4) {
            const red = pixels[i];
            const green = pixels[i + 1];
            const blue = pixels[i + 2];

            if (
                red >= 245 &&
                green >= 245 &&
                blue >= 245
            ) {
                pixels[i] = 247;
                pixels[i + 1] = 241;
                pixels[i + 2] = 227;
            }
        }

        context.putImageData(imageData, 0, 0);

        image.src = canvas.toDataURL("image/png");
    }

    if (image.complete) {
        changeBackground();
    } else {
        image.addEventListener("load", changeBackground);
    }
});