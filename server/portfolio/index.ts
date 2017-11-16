import * as path from 'path';
import * as RSS from 'rss';
import * as fs from 'fs-extra';

import { PortfolioItemEngine, PortfolioAsset } from './core';
import { BlogEngine } from './blog';
import * as env from '../environment';

import { createSlug } from '../../lib/slug'

/**
 * Loads an initializes the portfolio system. 
 * The portfolio system reads data from the given directory and makes it available
 * to the rest of the application.
 * 
 * TODO: Currently it initializes on application start. 
 * Instead it should be able to update the directory without having to restart node.
 */
export function getPortfolio(dataDirectory : string) {
    let portfolio = new Portfolio(dataDirectory);
    return portfolio;
}



export class Portfolio {
    blog: BlogEngine;

    constructor(public rootDirectory : string) {
        this.blog = new BlogEngine(path.join(rootDirectory, "blog"));
    }

    /**
     * Builds the portfolio by indexing everything
     */
    async build() {
        console.log("Building blog ...")
        await this.blog.build();
        console.log("✔️ Blog built ");


        console.log("Building RSS feed");

        let feed = new RSS({
            title: "SupeTroupe",
            description: "Musings of a software developer",
            feed_url: `${env.settings.webroot}/rss.xml`,
            site_url: `${env.settings.webroot}/blog`,
            language: "english",
            pubDate: new Date()
        });

        for await (let entry of this.blog.loadItemsReverse()) {
            feed.item({
                title: entry.title,
                description: entry.brief,
                url: `${env.settings.webroot}/blog/${createSlug(entry.id, entry.title)}`,
                guid: entry.id,
                date: entry.published
            });
        }

        let rssLocation = path.join(__dirname, '../../assets/rss.xml');
        await fs.writeFile(rssLocation, feed.xml());

        console.log("✔️ RSS feed built");
    }
}