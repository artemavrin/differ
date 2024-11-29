
export type Provider = {
    label: string;
    description?: string | undefined;
    detail?: string | undefined;
}

export type Model = {
    name: string;
    baseUrl: string;
    type: "openai" | "anthropic" | "xai";
    apiKey: string;
}

export type Store = {
    selectedModelName: string;
    models: Model[];
}
