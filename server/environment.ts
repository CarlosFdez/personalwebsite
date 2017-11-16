export enum Mode {
    Development = "development",
    Production = "production"
}

/**
 * Exports the environment settings used to drive the application.
 * This application can be imported by other modules to control the behavior
 */
export const settings = {
    // process settings
    mode: (process.env.NODE_ENV == "production") ? Mode.Production : Mode.Development,
    port: parseInt(process.env.PORT || process.argv[2]) || 5000


}