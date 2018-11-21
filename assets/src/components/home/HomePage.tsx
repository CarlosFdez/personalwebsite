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
    <a className="project" href={props.href}>
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
                    I enjoy learning new things, but above all I love making tools and experiences for people.
                    When I'm not programming, I'm playing video games or making stupid videos about them.
                </p>
                <p>
                    I learned to program in highschool in 2004, and earned a bachelor's degree in Computer Science in 2013.
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
                    These are a few of the projects I've created. Click on any to view it.
                </p>
                <ProjectList>
                    <Project name="Portfolio" href="https://github.com/CarlosFdez/personalwebsite">
                        This is the website you're looking at. 
                        Look at the <em>about</em> section for more information.
                    </Project>
                    <Project name="VideoCrop" href="https://carlosfdez.github.io/videocrop/">
                        A graphical tool I created to preview and crop videos. 
                        All cutting is performed on keyframes to avoid quality loss.
                        This reduces the footage I need to examine during the editing phase.
                        Written in <em>C++</em> and <em>Qt</em>.
                    </Project>
                    <Project name="SpueBox" href="https://github.com/CarlosFdez/SpueBox">
                        A custom bot for the discord chat client.
                        It's used primarily to play audio clips from various online sources (including Youtube) in voice chat rooms.
                        Written in <em>Python</em> using the <em>discord.py</em> library.
                    </Project>
                    <Project name="tmibot.js" href="https://github.com/CarlosFdez/tmibot.js">
                        A node library used to create chatbots for Twitch.
                        Wraps the existing <em>tmi.js</em> library to add command parsing.
                    </Project>
                </ProjectList>
            </div>
        </section>
        <section>
            <div className="content">
                <h2>Programming Contributions</h2>
                <p>
                    These are a few of the projects I've contributed to. Click on any to view it.
                </p>
                <ProjectList>
                    <Project name="Monster Hunter World Data" href="https://github.com/gatheringhallstudios/MHWorldData">
                        Spearheaded a data collection project for an upcoming <em>Monster Hunter World</em> application.
                        Assembles multiple spreadsheets into a SQLite file, with support for localization.
                        Written in Python, using SQLAlchemy and Marshmallow for persistance and validation.
                    </Project>
                    <Project name="MHW Database" href="https://github.com/gatheringhallstudios/MHWorldDatabase">
                        An in-progress Android application for the game <em>Monster Hunter World</em> to assist
                        players with finding item locations and optimal equipment. 
                        Written in Kotlin using the Android Architecture Components.
                    </Project>
                    <Project name="MH4U Database" href="https://github.com/kamegami13/MonsterHunter4UDatabase">
                        Contributed to a successful Android application with 4.7 stars and 100k+ downloads,
                        that provides data about the game the game <em>Monster Hunter 4 Ultimate</em>.
                        Largest contribution was a universal search feature.
                    </Project>
                    <Project name="PokeBattle Sim" href="https://github.com/sarenji/pokebattle-sim">
                        Participated in the development of a Pokemon battle system simulator for quick online matches and teambuilding.
                        The simulator was written in <em>CoffeeScript</em>, ran on <em>NodeJS</em>, and used <em>Backbone</em> for the front end.
                        The project was dropped due to growing responsibilities and competition from <em>Pokemon Showdown</em>.
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