import React from "react";
import "./ProjectItem.scss";

import DownloadIcon from "../../SVGImages/Download";
import AccountGroupIcon from "../../SVGImages/AccountGroup";
// import AccountMultipleIcon from "../../SVGImages/AccountMultiple";

const DownloadCount = ({ downloads }) => {
    if (!downloads) return null;

    const formattedDownloads = downloads.toLocaleString();

    return (
        <p>
            <DownloadIcon /> {formattedDownloads} Downloads
        </p>
    );
};
const ViewCount = ({ views }) => {
    if (!views) return null;

    const formattedViews = views.toLocaleString();

    return (
        <p>
            <AccountGroupIcon /> {formattedViews} views/month
        </p>
    );
};

const ProjectItem = ({ title, description, image, url, downloadCount, viewCount }) => {
    const content = (
        <div className="project-item">
            <div className="project-content">
                <div className="text-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>

                <div className="bottom-content">
                    <DownloadCount downloads={downloadCount} />
                    <ViewCount views={viewCount} />
                </div>

                <img src={image} alt={`${title} project`} />
            </div>
        </div>
    );

    return url ? (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {content}
        </a>
    ) : (
        content
    );
};

export default ProjectItem;
