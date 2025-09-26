import { FastifyRequest, FastifyReply } from 'fastify';
type SearchQuery = {
    q: string;
    page?: string;
    limit?: string;
    type?: 'product' | 'blog';
};
type SuggestionsQuery = {
    q: string;
    limit?: string;
};
export declare const SearchController: {
    globalSearch(request: FastifyRequest<{
        Querystring: SearchQuery;
    }>, reply: FastifyReply): Promise<void>;
    getSearchSuggestions(request: FastifyRequest<{
        Querystring: SuggestionsQuery;
    }>, reply: FastifyReply): Promise<void>;
};
export {};
