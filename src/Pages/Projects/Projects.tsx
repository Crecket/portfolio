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
import wardogsArtilleryImage from "./images/wardogs-artillery-thumbnail.png";
import olmPetImage from "./images/olm-pet-thumbnail.png";

const projects = [
    {
        title: "WARDOGS Artillery Calculator",
        description:
            "Calculator tool accounting for height, flight time ranges and real time sharing through websockets for multiple players.",
        image: wardogsArtilleryImage,
        url: "https://wardogs-artillery.com/"
    },
    {
        title: "olm.pet",
        description: "Collection of Oldschool Runescape related project used by thousands of players daily.",
        image: olmPetImage,
        url: "https://olm.pet/"
    },
    {
        title: "bunqDesktop",
        description: "The unofficial, free and open source desktop application for the bunq API.",
        image: bunqDesktopImage,
        url: "https://github.com/bunqCommunity/bunqDesktop",
        downloadCount: 75912
    },
    {
        title: "Masterypoints",
        description:
            "MasteryPoints let you view summoner profiles, compare summoners and view your rankings on the highscores for league of legends. The websites got too big and has since then been taken down.",
        image: masteryPointsImage,
        url: "https://www.masterypoints.com/",
        pageViews: 33500000
    },
    {
        title: "Zkili.app",
        description:
            "A site with different tools and small projects including a discord bot and different calculators for EVE Online. Taken down after a few years due to losing interest in the game.",
        image: zkiliImage
    },
    {
        title: "bunqJSClient",
        description:
            "A javascript SDK for the bunq API since no official SDK was present at the time - originally built for the web but has support for NodeJS.",
        image: bunqJSClientImage,
        url: "https://github.com/bunqCommunity/bunqJSClient",
        downloadCount: 48827
    },
    {
        title: "bunqAutomation",
        description: "An opensource bunq project to automate tons of different things using hte bunq API.",
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
    console.log("asdf");
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
