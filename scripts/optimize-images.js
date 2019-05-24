import * as path from "path";
import glob from "glob";

import { resizeToMaxWidth, optimizeImageSize } from "../server/ImageManipulation";

const baseSrcPath = path.normalize(`${__dirname}${path.sep}..${path.sep}src${path.sep}`);

(async () => {
    const thumbnailImages = glob.sync(`${baseSrcPath}/**/*-thumbnail.png`);
    const resizedImages = await resizeToMaxWidth(thumbnailImages, 500, "thumbnails");

    // optimize any images which were resized
    await optimizeImageSize(resizedImages, "thumbnails");
})();
