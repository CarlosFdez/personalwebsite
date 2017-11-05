export interface BlogEntryBase {
    id : string;
    title: string;
    published: Date;
}

/**
 * Represents a blog post summary
 */
export interface BlogEntryBrief extends BlogEntryBase {
    content: string;
}

/**
 * Represents a fully loaded blog entry
 */
export interface BlogEntry extends BlogEntryBase {
    /**
     * Contains the data for the blog entry 
     */
    content: string;
}