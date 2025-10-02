declare function handleAIQuery(input: unknown): Promise<{
    message: string;
    report_type?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    analysis_type?: "image" | "text" | "audio" | "multimodal" | undefined;
}>;
export { handleAIQuery };
