import React, { useEffect, useState } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";

import "./Images.scss";

import SEO from "../../../Components/SEO";
import useShareValueSetter from "../../../Hooks/useShareValueSetter";

const fileSizePretty = number => {
    const estimateString = (number / 1024).toFixed(2);
    return `${estimateString}Kb`;
};

export default () => {
    const [imageLists, setImageLists] = useState<false|any[]>(false);

    useShareValueSetter({
        title: "bunq chart images which are generated and kept up-to-date automatically",
        url: "https://gregoryg.dev/bunq/images"
    });

    useEffect(() => {
        axios
            .get(`/bunq-chart-images/images.json?v=v1`)
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
                    <div className="content">
                        <h3>{imageList.description}</h3>

                        <ul>
                            {imageList.images.map((image, key) => {
                                return (
                                    <li key={key}>
                                        <a
                                            className="animated"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            href={`/bunq-chart-images/${image.fileName}`}
                                        >
                                            {image.fileName} - {fileSizePretty(image.size)}
                                        </a>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                    <div className="image-preview">
                        <img
                            src={`/bunq-chart-images/${imageList.images[0].fileName}`}
                            alt={`${imageList.description} images preview`}
                        />
                    </div>
                </div>
            );
        });
    }

    return (
        <div className="images-tab">
            <SEO
                title="Generated bunq images"
                path="/bunq/images"
                description="Images which are generated and kept up-to-date automatically"
            />

            <Paper className="paper grey-gradient">{imagesComponent}</Paper>
        </div>
    );
};
