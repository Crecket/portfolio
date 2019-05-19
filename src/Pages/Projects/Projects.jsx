import React from "react";
import { Helmet } from "react-helmet";

import "./Projects.scss";

import LandingSection from "../../Components/LandingSection";
import ProjectItem from "./ProjectItem";

import bunqDesktopImage from "./images/bunq-desktop.png";
import masteryPointsImage from "./images/masterypoints.png";
import bunqJSClientImage from "./images/bunq-js-client.png";
import bunqAutomationImage from "./images/bunq-automation.png";
import bunqCLIImage from "./images/bunq-cli.png";
import bunqChartsImage from "./images/bunq-charts.png";
import imdbTorrentSearchImage from "./images/imdb-torrent-search.png";
import infrastructureInsightsImage from "./images/infrastructure-insights.png";
import neatoScannedImage from "./images/neato-scanned-image.png";

const projects = [
    {
        title: "bunqDesktop",
        description: "The unofficial, free and open source desktop application for the bunq API.",
        image: bunqDesktopImage,
        url: "https://bunqdesk.top/",
        downloadCount: 28448
    },
    {
        title: "Masterypoints",
        description:
            "MasteryPoints lets you view summoner profiles, compare summoners and view your rankings on the highscores for league of legends.",
        image: masteryPointsImage,
        url: "https://www.masterypoints.com/",
        viewCount: 750000
    },
    {
        title: "bunqJSClient",
        description: "A javascript SDK for the bunq API - was originally built for the web but has support for NodeJS.",
        image: bunqJSClientImage,
        url: "https://github.com/bunqCommunity/bunqJSClient",
        downloadCount: 28595
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
        downloadCount: 561
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
        userCount: 600
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
        description: "An AngularJS application to display and manage the docker infrastructure by using the DCOS API.",
        image: infrastructureInsightsImage,
        privateText: "Internship at Zig Websoftware"
    }
];

const Projects = () => {
    return (
        <div className="projects">
            <Helmet title="GregoryG - Projects" />

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
