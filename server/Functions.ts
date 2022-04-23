import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import gzipSize from "gzip-size";
import imagemin from "imagemin";
import imageminPngquant from "imagemin-pngquant";

/**
 * Resize images if they are too wide
 * @param images
 * @param maxWidth
 * @param label
 * @returns {Promise<any[]>}
 */
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

/**
 * Human read-able text
 * @param number
 * @returns {string}
 */
export const fileSizePretty = number => {
    const estimateString = (number / 1024).toFixed(2);
    return `${estimateString}Kb`;
};

/**
 * Optimize images
 * @param images
 * @param label
 * @returns {Promise<any[] | void>}
 */
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
                const fileStat = fs.statSync(imagePath);
                console.log(` -> Optimized image: ${imagePath} {${fileSizePretty(fileStat.size)}}`);
            });
        })
    ).catch(console.error);
};

/**
 * Stores a file to a given location
 * @param location
 * @param data
 * @param prettify
 */
export const writeJsonFile = async (location, data, prettify = false) => {
    const fileLocation = path.normalize(location);
    const fileContents = JSON.stringify(data, null, prettify ? 2 : 0);
    fs.writeFileSync(fileLocation, fileContents);

    const fileStat = fs.statSync(fileLocation);
    const gzipEstimate = await gzipSize(fileContents);

    const fileSizeText = `${fileSizePretty(fileStat.size)} raw, ${fileSizePretty(gzipEstimate)} gzipped`;
    console.log(`Written file to ${fileLocation}. ${fileSizeText}`);
};
