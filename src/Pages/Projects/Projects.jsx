import React from "react";
import { Helmet } from "react-helmet";
import "./Projects.scss";

import LandingSection from "../../Components/LandingSection";
import ProjectItem from "./ProjectItem";

import bunqDesktopImage from "./images/bunq-desktop.png";
import masteryPointsImage from "./images/masterypoints.png";
import bunqJSClientImage from "./images/bunq-js-client.png";
import bunqCLIImage from "./images/bunq-cli.png";

const projects = [
    {
        title: "bunqDesktop",
        description: "The unofficial, free and open source desktop application for the bunq API",
        image: bunqDesktopImage,
        url: "https://bunqdesk.top/",
        downloadCount: 15000
    },
    {
        title: "Masterypoints",
        description:
            "MasteryPoints lets you view summoner profiles, compare summoners and view your rankings on the highscores for league of legends",
        image: masteryPointsImage,
        url: "https://www.masterypoints.com/",
        viewCount: 750000
    },
    {
        title: "bunqJSClient",
        description: "A javascript SDK for the bunq API - was originally built for the web but has support for NodeJS",
        image: bunqJSClientImage,
        url: "https://github.com/bunqCommunity/bunqJSClient",
        downloadCount: 27000
    },
    {
        title: "bunq-cli",
        description: "An unofficial and open source CLI tool to quickly use the bunq API",
        image: bunqCLIImage,
        url: "https://github.com/bunqCommunity/bunq-cli"
    }
];

const Projects = () => {
    return (
        <div className="projects">
            <Helmet>
                <title>GregDev - Projects</title>
            </Helmet>

            <LandingSection className="text-wrapper" height="40vh" displayHomeLink>
                <h1>Projects</h1>
            </LandingSection>

            <div className="project-section">
                {projects.map(project => (
                    <ProjectItem key={project.title} {...project} />
                ))}
            </div>
        </div>
    );
};

export default Projects;
