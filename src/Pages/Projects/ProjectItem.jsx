import React from "react";
import "./ProjectItem.scss";

const ProjectItem = ({ title, description, image }) => {
    return (
        <div className="project-item">
            <div className="project-content">
                <div className="text-content">
                    <h3>{title}</h3>
                    <p>{description}</p>
                </div>

                <img src={image} alt={`${title} project`} />
            </div>
        </div>
    );
};

export default ProjectItem;
