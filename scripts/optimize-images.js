import * as fs from "fs";
import * as path from "path";
import glob from "glob";
import sharp from "sharp";
const imagemin = require("imagemin");
const imageminPngquant = require("imagemin-pngquant");

const basePath = path.normalize(`${__dirname}${path.sep}..${path.sep}src${path.sep}`);

const optimizeImages = (images, maxWidth, label = "images") => {
    console.log(`> Optimizing ${label}`);
    const resizedImagePromises = images.map(imagePath => {
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

    // wait for all images to be resized
    Promise.all(resizedImagePromises)
        .then(resizedImagePaths => {
            // go through each resizedImage and optimize them
            return Promise.all(
                resizedImagePaths.map(resizedImagePath => {
                    if (!resizedImagePath) return null;

                    // optmize a single image
                    return imagemin([resizedImagePath], {
                        plugins: [
                            imageminPngquant({
                                quality: [0.6, 0.8]
                            })
                        ]
                    }).then(result => {
                        return {
                            contents: result[0].data,
                            path: resizedImagePath
                        };
                    });
                })
            );
        })
        .then(optimizedImages => {
            optimizedImages.map(optimizedImage => {
                if (!optimizedImage) return;
                const currentFile = fs.readFileSync(optimizedImage.path);
                const currentSize = currentFile.byteLength;

                const newSize = optimizedImage.contents.byteLength;
                const percentageImproved = 100 - newSize / (currentSize / 100);

                // only update image if improvement is more than 2 percent
                if (percentageImproved > 2) {
                    fs.writeFileSync(optimizedImage.path, optimizedImage.contents);

                    console.log(` -> Optimized by ${percentageImproved.toFixed(1)}%: ${optimizedImage.path}`);
                }
            });
        });
};

const thumbnailImages = glob.sync(`${basePath}/**/*-thumbnail.png`);
optimizeImages(thumbnailImages, 500, "thumbnails");
