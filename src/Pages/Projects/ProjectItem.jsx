import React from "react";
import "./ProjectItem.scss";
import Tilt from "react-tilt";

import DomainIcon from "@material-ui/icons/Domain";
import DownloadIcon from "../../SVGImages/Download";
import AccountGroupIcon from "../../SVGImages/AccountGroup";
import AccountMultipleIcon from "../../SVGImages/AccountMultiple";

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
const UserCount = ({ users }) => {
    if (!users) return null;

    const formattedUsers = users.toLocaleString();

    return (
        <p>
            <AccountMultipleIcon /> {formattedUsers} users
        </p>
    );
};
const PrivateText = ({ privateText }) => {
    if (!privateText) return null;

    return (
        <p>
            <DomainIcon /> {privateText}
        </p>
    );
};

const ProjectItem = ({
    title,
    description,
    image,
    url,
    downloadCount,
    privateText = false,
    viewCount = false,
    userCount = false,
    relativeUrl = false
}) => {
    const bottomContent = (
        <div className="usage-stats">
            <DownloadCount downloads={downloadCount} />
            <ViewCount views={viewCount} />
            <UserCount users={userCount} />
            <PrivateText privateText={privateText} />
        </div>
    );

    const content = (
        <div className={`project-item ${image ? "has-image" : ""}`}>
            <Tilt options={{ max: 35, scale: 1.05, perspective: 1000 }}>
                <div className="project-content purple-gradient">
                    <div className={image ? "text-content-image" : "text-content"}>
                        <h3>{title}</h3>
                        <p>{description}</p>

                        {!image && bottomContent}
                    </div>

                    {image && <div className="bottom-content">{bottomContent}</div>}

                    {image && <img src={image} alt={`${title} project`} />}
                </div>
            </Tilt>
        </div>
    );

    if (!url) return content;

    return relativeUrl ? (
        <a href={url}>{content}</a>
    ) : (
        <a href={url} target="_blank" rel="noopener noreferrer">
            {content}
        </a>
    );
};

export default ProjectItem;
