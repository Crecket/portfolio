import React from "react";

import SEO from "../../Components/SEO";
import LandingSection from "../../Components/LandingSection";

import "./Projects.scss";
import ProjectItem from "./ProjectItem";

import bunqDesktopImage from "./images/bunq-desktop-thumbnail.png";
import masteryPointsImage from "./images/masterypoints-thumbnail.png";
import bunqJSClientImage from "./images/bunq-js-client-thumbnail.png";
import bunqAutomationImage from "./images/bunq-automation-thumbnail.png";
import bunqCLIImage from "./images/bunq-cli-thumbnail.png";
import bunqChartsImage from "./images/bunq-charts-thumbnail.png";
import imdbTorrentSearchImage from "./images/imdb-torrent-search-thumbnail.png";
import infrastructureInsightsImage from "./images/infrastructure-insights-thumbnail.png";
import neatoScannedImage from "./images/neato-scanned-image-thumbnail.png";
import zkiliImage from "./images/zkili-thumbnail.png";

const projects = [
    {
        title: "bunqDesktop",
        description: "The unofficial, free and open source desktop application for the bunq API.",
        image: bunqDesktopImage,
        url: "https://bunqdesk.top/",
        downloadCount: 75912
    },
    {
        title: "Masterypoints",
        description:
            "MasteryPoints lets you view summoner profiles, compare summoners and view your rankings on the highscores for league of legends.",
        image: masteryPointsImage,
        url: "https://www.masterypoints.com/",
        pageViews: 33500000
    },
    {
        title: "Zkili.app",
        description:
            "A site with different tools and small projects including a discord bot and different calculators for EVE Online.",
        image: zkiliImage,
        url: "https://zkili.app/"
    },
    {
        title: "bunqJSClient",
        description: "A javascript SDK for the bunq API - was originally built for the web but has support for NodeJS.",
        image: bunqJSClientImage,
        url: "https://github.com/bunqCommunity/bunqJSClient",
        downloadCount: 48827
    },
    {
        title: "bunqAutomation",
        description: "A new opensource bunq project to automate tons of different things.",
        image: bunqAutomationImage,
        url: "https://github.com/bunqCommunity/bunqAutomation"
    },
    {
        title: "bunq charts",
        description: "Estimating the amount of paying users and total payments at bunq.",
        image: bunqChartsImage,
        url: "/bunq",
        relativeUrl: true
    },
    {
        title: "bunq-cli",
        description: "An unofficial and open source CLI tool to quickly use the bunq API.",
        image: bunqCLIImage,
        url: "https://github.com/bunqCommunity/bunq-cli",
        downloadCount: 634
    },
    {
        title: "UploadBroBot",
        description:
            "A personal project for a Telegram bot which helps with sharing/uploading files to different providers.",
        url: "https://github.com/Crecket/upload-bro-bot",
        userCount: 1000
    },
    {
        title: "imdb-torrent-search",
        description: "A chrome extension to view torrents for movies and series directly on IMDB.",
        url: "https://github.com/Crecket/imdb-torrent-search",
        image: imdbTorrentSearchImage,
        userCount: 1498
    },
    {
        title: "Neato robot dashboard",
        description:
            "React dashboard to remotely control a Neato cleaning bot. Along that we used machine learning to start multiple robots when required based on the cleaning results.",
        image: neatoScannedImage,
        privateText: "Internship at LEVIY"
    },
    {
        title: "Infrastructure Insights",
        description: "An AngularJS application to display and manage the docker infrastructure through the DCOS API.",
        image: infrastructureInsightsImage,
        privateText: "Internship at Zig Websoftware"
    }
];

const Projects = () => {
    return (
        <div className="projects">
            <SEO title="Projects" description="Projects I have developed" path="/projects" />

            <LandingSection className="text-wrapper" height="40vh" displayMenuButton>
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
