import * as React from "react";

import { Link } from 'react-router-dom';
import { getStore } from '../../store';

// todo: move below to somewhere more global for the client
import ApiClient from '../../../../lib/apiclient'
var api = new ApiClient("/");

function createSlug(id, title : string) {
    return id + encodeURIComponent(
        title.toLowerCase().replace(/("|')/, "").replace(" ", "-")
    )
}

const BlogBrief = (props) => (
    <Link className="article-brief" to={"/blog/"+createSlug(props.item.id, props.item.title)}>
        <h2 className="title">{props.item.title}</h2>
        <div className="date">
            <i className="fa fa-calendar" aria-hidden="true"></i>
            { new Date(props.item.published).toDateString() }
        </div>
        <div className="brief">
            { props.item.content }
        </div>
    </Link>
)

const BlogArticle = (props) => (
    <section>
        <div className="article">
            <header>
                <h1 className="title">{ props.title }</h1>
                <div className="date">
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    { props.published }
                </div>
            </header>
            <div dangerouslySetInnerHTML={{__html: props.content}}/>
        </div>
    </section>
)

interface BlogPageState {
    items: any[];
}

export class BlogPage extends React.Component<any, BlogPageState> {
    constructor(props) {
        super(props);

        this.state = { items: null }
        if (props.staticContext) {
            this.state = { ...props.staticContext }
        }
    }

    async componentDidMount() {
        if (this.state.items)
            return;

        try {
            if (window && window['loaded'])
                return;
                
            let items = await api.getBlogBriefs();
            this.setState({ items: items['items'] });

            if (window) window['loaded'] = true;
        }
        catch (err) {
            console.error("Error loading blog articles: " + err);
        }
    }

    render() {
        let briefs = (this.state.items || []).map((item) => (
            <BlogBrief key={item.id} item={item}/>
        ));
        return (
            <div className="article-list">
                { briefs }
            </div>
        )
    }
}

export class BlogArticlePage extends React.Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {};
        console.log(props);
    }
    async componentDidMount() {
        if (this.state.item)
            return;

        try {
            //let items = api.getBlogArticle();
            //this.setState({ items: items['items'] });
        } catch (err) {
            console.error("Error loading blog articles: " + err);
        }
    }

    render() {
        return (
            <BlogArticle item={this.state.item}/>
        )
    }
}