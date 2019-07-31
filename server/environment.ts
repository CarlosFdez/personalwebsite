export enum Mode {
    Development = "development",
    Production = "production"
}

let mode = (process.env.NODE_ENV == "production") ? Mode.Production : Mode.Development

/**
 * Exports the environment settings used to drive the application.
 * This application can be imported by other modules to control the behavior
 */
export const settings = {
    // process settings
    mode: mode,
    port: parseInt(process.env.PORT || process.argv[2]) || 5000,
    isProduction: mode == Mode.Production,
    isDevelopment: mode == Mode.Development,
    
    /**
     * Main url of the website. Used in certain areas like rss building
     */
    webroot: 'http://supetroupe.com'
}