/**
 * Represents an asset file of a portfolio that is available to the front end.
 */
export class PortfolioAsset {
    /// Absolute path of the root folder of the portfolio itself
    itemRoot : string;

    /// Relative path of the item inside the item root
    relativePath : string;
}

export interface PortfolioItemEngine {
    load(rootDir : string) : Promise<void>;

    /**
     * Loads the full list of portfolio items.
     * These portfolio items may not contain full information.
     * 
     */
    loadItems() : IterableIterator<any>;

    /**
     * Loads a portfolio object that can be sent to the front end.
     * This is a complete load, showing full detail.
     */
    loadItem(itemId: string) : Promise<any>;

    getAsset(itemId : string, relativeUrl : string) : PortfolioAsset;
}

