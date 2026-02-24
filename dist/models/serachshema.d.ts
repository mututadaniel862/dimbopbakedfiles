import { z } from 'zod';
export declare const SearchQuerySchema: z.ZodObject<{
    q: z.ZodString;
    page: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    type: z.ZodOptional<z.ZodEnum<["product", "blog"]>>;
}, "strip", z.ZodTypeAny, {
    q: string;
    page: string;
    limit: string;
    type?: "product" | "blog" | undefined;
}, {
    q: string;
    type?: "product" | "blog" | undefined;
    page?: string | undefined;
    limit?: string | undefined;
}>;
export declare const SuggestionsQuerySchema: z.ZodObject<{
    q: z.ZodString;
    limit: z.ZodDefault<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    q: string;
    limit: string;
}, {
    q: string;
    limit?: string | undefined;
}>;
export declare const SearchResultSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    description: z.ZodString;
    type: z.ZodEnum<["product", "blog"]>;
    image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    price: z.ZodOptional<z.ZodNumber>;
    category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    status: z.ZodOptional<z.ZodString>;
    created_at: z.ZodDate;
    updated_at: z.ZodOptional<z.ZodDate>;
    frontend_url: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "product" | "blog";
    title: string;
    description: string;
    id: number;
    created_at: Date;
    frontend_url: string;
    status?: string | undefined;
    updated_at?: Date | undefined;
    price?: number | undefined;
    image_url?: string | null | undefined;
    category?: string | null | undefined;
}, {
    type: "product" | "blog";
    title: string;
    description: string;
    id: number;
    created_at: Date;
    frontend_url: string;
    status?: string | undefined;
    updated_at?: Date | undefined;
    price?: number | undefined;
    image_url?: string | null | undefined;
    category?: string | null | undefined;
}>;
export declare const GlobalSearchResponseSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodNumber;
        title: z.ZodString;
        description: z.ZodString;
        type: z.ZodEnum<["product", "blog"]>;
        image_url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        price: z.ZodOptional<z.ZodNumber>;
        category: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        status: z.ZodOptional<z.ZodString>;
        created_at: z.ZodDate;
        updated_at: z.ZodOptional<z.ZodDate>;
        frontend_url: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "product" | "blog";
        title: string;
        description: string;
        id: number;
        created_at: Date;
        frontend_url: string;
        status?: string | undefined;
        updated_at?: Date | undefined;
        price?: number | undefined;
        image_url?: string | null | undefined;
        category?: string | null | undefined;
    }, {
        type: "product" | "blog";
        title: string;
        description: string;
        id: number;
        created_at: Date;
        frontend_url: string;
        status?: string | undefined;
        updated_at?: Date | undefined;
        price?: number | undefined;
        image_url?: string | null | undefined;
        category?: string | null | undefined;
    }>, "many">;
    total: z.ZodNumber;
    query: z.ZodString;
    categories: z.ZodObject<{
        products: z.ZodNumber;
        blogs: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        blogs: number;
        products: number;
    }, {
        blogs: number;
        products: number;
    }>;
    pagination: z.ZodOptional<z.ZodObject<{
        page: z.ZodNumber;
        limit: z.ZodNumber;
        totalPages: z.ZodNumber;
        hasNext: z.ZodBoolean;
        hasPrev: z.ZodBoolean;
    }, "strip", z.ZodTypeAny, {
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }, {
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    categories: {
        blogs: number;
        products: number;
    };
    results: {
        type: "product" | "blog";
        title: string;
        description: string;
        id: number;
        created_at: Date;
        frontend_url: string;
        status?: string | undefined;
        updated_at?: Date | undefined;
        price?: number | undefined;
        image_url?: string | null | undefined;
        category?: string | null | undefined;
    }[];
    total: number;
    pagination?: {
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | undefined;
}, {
    query: string;
    categories: {
        blogs: number;
        products: number;
    };
    results: {
        type: "product" | "blog";
        title: string;
        description: string;
        id: number;
        created_at: Date;
        frontend_url: string;
        status?: string | undefined;
        updated_at?: Date | undefined;
        price?: number | undefined;
        image_url?: string | null | undefined;
        category?: string | null | undefined;
    }[];
    total: number;
    pagination?: {
        page: number;
        limit: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    } | undefined;
}>;
export declare const SearchSuggestionsResponseSchema: z.ZodObject<{
    suggestions: z.ZodArray<z.ZodString, "many">;
}, "strip", z.ZodTypeAny, {
    suggestions: string[];
}, {
    suggestions: string[];
}>;
export declare const ErrorResponseSchema: z.ZodObject<{
    message: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
    results: z.ZodOptional<z.ZodArray<z.ZodNever, "many">>;
    total: z.ZodOptional<z.ZodNumber>;
    suggestions: z.ZodOptional<z.ZodArray<z.ZodNever, "many">>;
}, "strip", z.ZodTypeAny, {
    message: string;
    error?: string | undefined;
    results?: never[] | undefined;
    total?: number | undefined;
    suggestions?: never[] | undefined;
}, {
    message: string;
    error?: string | undefined;
    results?: never[] | undefined;
    total?: number | undefined;
    suggestions?: never[] | undefined;
}>;
export declare const HealthCheckResponseSchema: z.ZodObject<{
    status: z.ZodEnum<["healthy", "unhealthy"]>;
    service: z.ZodLiteral<"search">;
    timestamp: z.ZodString;
    error: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: "healthy" | "unhealthy";
    service: "search";
    timestamp: string;
    error?: string | undefined;
}, {
    status: "healthy" | "unhealthy";
    service: "search";
    timestamp: string;
    error?: string | undefined;
}>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type SuggestionsQuery = z.infer<typeof SuggestionsQuerySchema>;
export type SearchResult = z.infer<typeof SearchResultSchema>;
export type GlobalSearchResponse = z.infer<typeof GlobalSearchResponseSchema>;
export type SearchSuggestionsResponse = z.infer<typeof SearchSuggestionsResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
export type HealthCheckResponse = z.infer<typeof HealthCheckResponseSchema>;
