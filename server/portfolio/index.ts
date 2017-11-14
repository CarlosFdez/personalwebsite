import * as path from 'path';
import { PortfolioItemEngine, PortfolioAsset } from './core';
import { BlogEngine } from './blog';

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
    }
}