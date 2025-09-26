export interface SearchResult {
    id: number;
    title: string;
    description: string;
    type: 'product' | 'blog';
    image_url?: string | null;
    price?: number;
    category?: string | null;
    status?: string;
    created_at: Date;
    updated_at?: Date;
    frontend_url: string;
}
export interface GlobalSearchResponse {
    results: SearchResult[];
    total: number;
    query: string;
    categories: {
        products: number;
        blogs: number;
    };
}
export declare const SearchService: {
    globalSearch(query: string, page?: number, limit?: number, type?: "product" | "blog", baseUrl?: string): Promise<GlobalSearchResponse>;
    getSearchSuggestions(query: string, limit?: number): Promise<string[]>;
};
