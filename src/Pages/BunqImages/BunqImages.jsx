import React, { useEffect, useState } from "react";
import axios from "axios";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";

import "./BunqImages.scss";

const fileSizePretty = number => {
    const estimateString = (number / 1024).toFixed(2);
    return `${estimateString}Kb`;
};

const BunqImages = () => {
    const [imageLists, setImageLists] = useState(false);

    useEffect(() => {
        axios
            .get(`/bunq-images/images.json?v=v1`)
            .then(response => response.data)
            .then(setImageLists)
            .catch(error => {
                console.error(error);
                console.error("Failed to get bunq data");
            });
    }, []);

    let imagesComponent = null;
    if (imageLists) {
        imagesComponent = imageLists.map((imageList, index) => {
            return (
                <div className="image-sets" key={index}>
                    <h3>{imageList.description}</h3>

                    <ul>
                        {imageList.images.map((image, key) => {
                            return (
                                <li key={key}>
                                    <a
                                        className="animated"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        href={`/bunq-images/${image.fileName}`}
                                    >
                                        {image.fileName} - {fileSizePretty(image.size)}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            );
        });
    }

    return (
        <div className="bunq-charts">
            <SEO
                title="bunq images"
                description="Generated images for the bunq charts which are updated automatically"
                path="/bunq-images"
                // image={bunqThumbnail}
            />

            <LandingSection className="text-wrapper">
                <h1>bunq images</h1>

                {imagesComponent}
            </LandingSection>
        </div>
    );
};

export default BunqImages;
