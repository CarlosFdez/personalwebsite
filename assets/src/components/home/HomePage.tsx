import * as React from "react";

const SocialMediaButton = (props) => {
    let icon = props.name.toLowerCase()
    if (icon == "youtube") {
        icon = "youtube-play";
    }

    return (
        <a href={props.href} className="social-media-button">
            <span className={`fa fa-${icon}`} aria-hidden="true"></span> {props.name}
        </a>
    )    
}

const ProjectList = (props) => (
    <div className="project-list">
        {props.children}
    </div>
)

const Project = (props) => (
    <a className="project" href={props.href} target="_blank">
        <span className="project-title">
            {props.name}
            <span className="href">{props.href}</span>
        </span>
        <div className="description">
            {props.children}
        </div>
    </a>
)

export const HomePage = () => (
    <div className="alternating-sections about-page">
        <section>
            <div className="content">
                <p>
                    I am a full stack software developer living in South Florida. 
                    I've been programming since 2004, earning my bachelor's degree in Computer Science in 2013.
                    Recently most of my work has been in either Web or Android development, but I can do a little bit of everything.
                </p>
                <div className="social-media-links">
                    <SocialMediaButton name="Github" href="https://github.com/CarlosFdez"/>
                    <SocialMediaButton name="Twitter" href="https://twitter.com/MeSoSupe"/>
                    <SocialMediaButton name="Youtube" href="https://www.youtube.com/channel/UCNxCpInDAfcdp-PHZO4PtOA"/>
                </div>
                <p>
                    You can contact me at <a href="mailto:me@supetroupe.com">me@supetroupe.com</a>.
                </p>
            </div>
        </section>

        <section>
            <div className="content">
                <h2>Personal Programming Projects</h2>
                <p>
                    These are a few of the projects I've created.
                </p>
                <ProjectList>
                    <Project name="Computer Vision for Game Stream Broadcasting">
                        A set of video game broadcasting dashboards and overlays using ReactJS via NodeCG.
                        Live footage is analyzed by a separate Python process using OpenCV, and the result is communicated via a websocket.
                        Currently being used for an automated Sekiro death timer and for Smash Bros match analysis.
                    </Project>
                    <Project name="Portfolio" href="https://github.com/CarlosFdez/personalwebsite">
                        This is the website you're looking at. 
                        A personal portfolio built using ReactJS and hosted on a DigitalOcean virtual machine.
                        Look at the <em>about</em> section for more information.
                    </Project>
                    <Project name="VideoCrop" href="https://carlosfdez.github.io/videocrop/">
                        A graphical tool created to preview and crop videos to reduce the amount of footage to work with while editing videos.
                        Quality loss is avoided by cutting on keyframes.
                        Written in C++ and Qt.
                    </Project>
                    <Project name="SpueBox" href="https://github.com/CarlosFdez/SpueBox">
                        A custom built bot (chat command parser) for the discord voice chat client.
                        It's used primarily to play audio clips from various online sources (including Youtube) in voice chat rooms.
                        Written in Python using the discord.py library.
                    </Project>
                    <Project name="tmibot.js" href="https://github.com/CarlosFdez/tmibot.js">
                        A NodeJS library used to create chatbots for Twitch.
                        Wraps the existing tmi.js library to support bot-style command parsing.
                    </Project>
                </ProjectList>
            </div>
        </section>
        <section>
            <div className="content">
                <h2>Programming Contributions</h2>
                <p>
                    These are a few of the projects I've contributed to.
                </p>
                <ProjectList>
                    <Project name="MHWorld Database" href="https://github.com/gatheringhallstudios/MHWorldDatabase">
                        An open source Android application built as an assistant for the videogame <em>Monster Hunter World</em>.
                        Written in Kotlin using the Android Architecture Components.
                        Uses the MHWorldData project's exported SQLite file as a data source.
                    </Project>
                    <Project name="MHWorldData" href="https://github.com/gatheringhallstudios/MHWorldData">
                        Spearheaded a data collection project for the <em>MHWorld Database</em> project.
                        Assembles multiple human editable spreadsheets (including translations) into a SQLite file, with support for data validation.
                        Written in Python, using SQLAlchemy and Marshmallow for persistance and validation.
                    </Project>
                    <Project name="MH4U Database" href="https://github.com/kamegami13/MonsterHunter4UDatabase">
                        Contributed to a successful Android application with 4.7 stars and 100k+ downloads,
                        that provides data about the video game <em>Monster Hunter 4 Ultimate</em>.
                        My largest contribution to this project was the universal search feature.
                    </Project>
                    <Project name="PokeBattle Sim" href="https://github.com/sarenji/pokebattle-sim">
                        Participated in the development of a now defunct Pokemon battle system simulator for quick online player vs player matches and teambuilding.
                        The simulator was written in CoffeeScript running on NodeJS, and used BackboneJS to structure the front end.
                    </Project>
                </ProjectList>
            </div>
        </section>

        <section>
            <div className="content">
                <h2>About this site</h2>
                <p>
                    This is my portfolio site written using NodeJs and React, deployed to my own server
                    on  <a href="https://www.digitalocean.com/">Digital Ocean</a> using
                    {' '} <a href="http://capistranorb.com/">Capistrano</a>.
                    Feel free to read my <a href="/blog/1-building-the-portfolio">article about the process</a>
                    {' '} on my blog.
                    The portfolio is open source,
                    and hosted on <a href="https://github.com/CarlosFdez">my github</a>.
                    If you want to look at the source code, 
                    it's available <a href="https://github.com/CarlosFdez/personalwebsite">here</a>.
                </p>
                <p>
                    The icons used belong
                    to <a href="http://fontawesome.io/">Font Awesome</a>.
                </p>
            </div>
        </section>
    </div>
);