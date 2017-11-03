/**
 * Represents an asset file of a portfolio that is available to the front end.
 */
export class PortfolioAsset {
    /// Absolute path of the root folder of the portfolio itself
    itemRoot : string;

    /// Relative path of the item inside the item root
    relativePath : string;
}