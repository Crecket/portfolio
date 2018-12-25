import React from "react";
import "./ProjectItem.scss";

const ProjectItem = ({ title, description, image }) => {
    return (
        <div className="project-item">
            <div className="project-content">
                <img src={image} alt={`${title} project`} />

                <div className="text-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectItem;
