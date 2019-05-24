import * as fs from "fs";
import sharp from "sharp";
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");

export const resizeToMaxWidth = async (images, maxWidth, label = "images") => {
    console.log(`> Resizing ${label} to ${maxWidth} max width`);

    const imagePromises = images.map(imagePath => {
        const imageContents = fs.readFileSync(imagePath);

        // create sharp image object
        const image = sharp(imageContents);

        // check meta data to view size
        return image.metadata().then(metaData => {
            // only resize if not already correct width
            if (metaData.width > maxWidth) {
                // size down only if required
                return image
                    .resize({ width: maxWidth, withoutEnlargement: true })
                    .toFile(imagePath)
                    .then(() => {
                        console.log(` -> Resized to ${maxWidth} width: ${imagePath}`);

                        return imagePath;
                    });
            }

            return null;
        });
    });

    return Promise.all(imagePromises);
};

export const optimizeImageSize = async (images, label = "images") => {
    console.log(`> Optimizing ${label}`);

    // wait for all images to be resized
    return Promise.all(
        images.map(imagePath => {
            if (!imagePath) return null;

            // optmize a single image
            return imagemin([imagePath], {
                plugins: [
                    imageminPngquant({
                        quality: [0.6, 0.8]
                    })
                ]
            }).then(result => {
                fs.writeFileSync(imagePath, result[0].data);
                console.log(` -> Optimized image:  ${imagePath}`);
            });
        })
    ).catch(console.error);
};
