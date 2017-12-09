We are often told to create an online presence. I began my own with a static webpage, but over time I've felt the need to create a portfolio befitting a programmer. A portfolio that is part of the portfolio. Despite plenty of existing solutions, I created my own.

If you want to see the code, you can view it at my [github repository](https://github.com/CarlosFdez/personalwebsite).


## What I built

I upgraded my portfolio to host a blog. Some of the most helpful advice I've received came from blogs, and I want to give back to others by doing the same. I'll be writing about information or resources I find along the way, and I hope something here will be helpful to someone someday.

This is not a stopping point: there will be more updates to this platform in the future. I hope I can make this portfolio a more thorough showcase of my work and hobbies beyond simply programming.


## What I needed

I began by analyzing what was important.
- Support for multiple hobbies (programming, video editing, etc)
- Searchable and cached on Google ("SEO friendly")
- Human friendly but permanent page urls and links
- To show off my own programming ability as a piece of my portfolio

These goals don't require a fully dynamic system like Wordpress, but they do necessitate certain techniques such as server side rendering. I don't intend on making the application scale for the initial version, but I may consider it in a later version.


## What I used

After some deliberation, I settled on the following.
- Typescript
- React + Redux
- React Router and React Router Redux
- Webpack
- NodeJS
- Express

I originally planned on a python server with flask, pjax, and jquery, a stack I was already very familar with. However, frontend development had many interesting evolutions in the past few years. Avoiding the unknown for the sake of comfort is how you become left behind in the software development world.

React is a declarative approach to frontend development, and using a node backend allows us to *server side render* without needing to use a separate process. Server side rendering is required because we want google to cache it. Going this route will make it easier to add more dynamic front end behavior in future installments. 


## Architecture and Design

The application consists of three core parts: The render server, the API, and the client. The render server reads data from the API and renders the client. Afterwards, all subsequent page navigation and rendering is handled by the client, using the API to read data.

![Architecture Diagram](assets/architecture.png "Architecture Diagram")

The API receives its data from the portfolio system, which is fed by a directory of files indexed using MongoDb. A custom build process performs this indexing. The portfolio files are stored in a seperate github repository as a cheap backup and deployment system. This arrangement normally scales poorly but for a single portfolio it should remain manageable.

Reusing the API makes it easier to guarantee that both the server and client will render correctly with less testing required. 


## Special thanks

This is the section where I thank the people that made this possible.

I'd first like to thank [Alain Galvan](https://alain.xyz/) for allowing me to use his own website as an example, and for answering my endless barrage of questions. Several of the ideas in my portfolio came from his, and the published [source code](https://github.com/alaingalvan/alain.xyz) of that website was an excellent resource for when I got stuck.

I'd also like to thank [Francisco Marcano](https://github.com/Francodes) and [Alain Meier](https://alainmeier.com/) for answering a few of my questions and helping me get started. You guys are great!

And finally, I'd like to thank the many React users out there kind enough to share their insights on the web. If it weren't for all of you, it would have been much harder to learn React.