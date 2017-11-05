import * as React from "react";

const Project = (props) => (
    <li>
        <a className="project-title" href={props.href}>{props.name}</a>
        <p>
            {props.children}
        </p>
    </li>
)

export const HomePage = () => (
    <div className="alternating-sections about-page">
        <section>
            <div className="content">
                <p>
                    I'm a software developer living in South Florida.
                    I enjoy learning new things, but above all I love making tools and experiences for people.
                    When I'm not programming, I'm playing video games or making stupid videos about them.
                </p>
                <p>
                    I learned to program in highschool in 2004, and earned a bachelor's degree in Computer Science in 2013.
                </p>
                <div className="social-media-links">
                    <a href="https://github.com/CarlosFdez"><span className="fa fa-github" aria-hidden="true"></span> Github</a>
                    <a href="https://twitter.com/MeSoSupe"><span className="fa fa-twitter" aria-hidden="true"></span> Twitter</a>
                    <a href="https://www.youtube.com/channel/UCNxCpInDAfcdp-PHZO4PtOA"><span className="fa fa-youtube-play" aria-hidden="true"></span> Youtube</a>
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
                <ul className="project-list">
                    <Project name="VideoCrop" href="https://carlosfdez.github.io/videocrop/">
                        A graphical tool I created to assist with my video editing hobby.
                        Used to preview footage and cut on keyframes to avoid losing quality due to generational loss.
                        This allows me to reduce the footage I need to examine during the editing phase, and reduce my hard disk usage as a bonus.
                        Written in <em>C++</em> and <em>Qt</em>.
                    </Project>
                    <Project name="SpueBox" href="https://github.com/CarlosFdez/SpueBox">
                        A custom bot for the <a href="https://discordapp.com/">discord</a> chat client.
                        It's used primarily to play audio clips from various online sources (including Youtube) in voice chat rooms.
                        Written in <em>Python</em> using the <em><a href="https://github.com/Rapptz/discord.py">discord.py</a></em> library.
                    </Project>
                    <Project name="tmibot.js" href="https://github.com/CarlosFdez/tmibot.js">
                        A node library used to create chatbots for Twitch.
                        Wraps the existing <a href="https://docs.tmijs.org/">tmi.js</a> library to add command parsing.
                    </Project>
                </ul>
            </div>
        </section>
        <section>
            <div className="content">
                <h2>Programming Contributions</h2>
                <p>
                    These are a few of the projects I've contributed to.
                </p>
                <ul className="project-list">
                    <Project name="MonsterHunter4UDatabase" href="https://github.com/kamegami13/MonsterHunter4UDatabase">
                        Added a universal search to an existing Android application written in Java that provides data about
                        the game <em>Monster Hunter 4 Ultimate</em>. Also contributed a few other bug fixes and tweaks.
                    </Project>
                    <Project name="PokeBattle Sim" href="https://github.com/sarenji/pokebattle-sim">
                        Participated in the development of a Pokemon battle system simulator for quick online matches and teambuilding.
                        The simulator was written in <em>CoffeeScript</em>, ran on <em>NodeJS</em>, and used <em>Backbone</em> for the front end.
                        The biggest single project I did was a teambuilder written in an MVC style using Backbone.
                        The project was dropped due to growing responsibilities and competition from <a href="http://pokemonshowdown.com/">Pokemon Showdown</a>.
                    </Project>
                </ul>
            </div>
        </section>

        <section>
            <div className="content">
                <h2>About this site</h2>
                <p>
                    This is my portfolio site written using NodeJs And React.
                    Webpack is used to bundle the frontend, and express is used to serve files.
                    The application is deployed to my own server using Capistrano.
                    The backend acts as a render server to support server side rendering.
                    <a href="https://code.visualstudio.com/">Visual Studio Code</a> text editor.
                    It is hosted using nginx on an Ubuntu instance in <a href="https://www.digitalocean.com/">Digital Ocean</a>.
                </p>
                <p>
                    This website's <a href="assets/js/main.js" target="_blank">javascript</a> was written from scratch
                    to demonstrate that I know how to work with the DOM.
                    However, if the scope of this portfolio grows I may end up using one in the future.
                    If I do, I'll use either JQuery or React.
                </p>
                <p>
                    The social network icons belong to <a href="http://fontawesome.io/">Font Awesome</a>.
                    Frameworks were harmed in the making of this website.
                </p>
            </div>
        </section>
    </div>
);