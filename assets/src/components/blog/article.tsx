import * as React from 'react';

interface BlogArticleProps {
    title: string,
    published: Date
}

export class BlogArticle extends React.Component<BlogArticleProps> {
    render() {
        var props = this.props;
        return (
            <section>
                <div className="article">
                    <header>
                        <h1 className="title">{ props.title }</h1>
                        <div className="date">
                            <i className="fa fa-calendar" aria-hidden="true"></i>
                            { props.published }
                        </div>
                    </header>
                    Actual content will go in here later
                </div>
            </section>
        )
    }
}