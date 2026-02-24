declare function handleAIQuery(input: unknown): Promise<{
    message: string;
    report_type?: string | undefined;
    start_date?: string | undefined;
    end_date?: string | undefined;
    analysis_type?: "text" | "image" | "audio" | "multimodal" | undefined;
}>;
export { handleAIQuery };
