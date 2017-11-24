
/**
 * Represents a blog post summary. This is what is stored in the database
 */
export interface BlogEntry {
    _id : number;
    
    /**
     * id for the blog entry in the file system. This is the folder name
     */
    localId: string;
    title: string;
    published: Date;
    brief: string;
}

/**
 * Represents a fully loaded blog entry
 */
export interface BlogEntryFull extends BlogEntry {
    /**
     * Contains the data for the blog entry if fully loaded
     */
    content: string;
}