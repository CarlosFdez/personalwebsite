import * as React from "react";

interface BlogBriefProps {

}

export class BlogBrief extends React.Component {
    render() {
        let props = this.props;
        return (
            <a className="article-brief" href="/blog/25">
                <h2 className="title">Article name</h2>
                <div className="date">
                    <i className="fa fa-calendar" aria-hidden="true"></i>
                    July 18, 2017
                </div>
                <div className="brief">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam molestie turpis nibh, eu vulputate ex facilisis mollis. Aliquam et turpis nec erat viverra suscipit quis et velit. Maecenas auctor diam et justo scelerisque, sed consequat est eleifend. Aenean fringilla in lacus et hendrerit. Vestibulum at leo quis sapien faucibus pretium commodo a diam. Aenean et mattis dui, id dignissim arcu. In hac habitasse platea dictumst.
                </div>
            </a>
        )
    }
}

export class BlogList extends React.Component {
    render() {
        return (
            <div className="article-list">
                <BlogBrief/>
                <BlogBrief/>
                <BlogBrief/>
                <BlogBrief/>
                <BlogBrief/>
                <BlogBrief/>
                <BlogBrief/>
                <BlogBrief/>
            </div>
        );
    }
}