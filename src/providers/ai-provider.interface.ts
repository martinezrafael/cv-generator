export interface AiProviderOptions {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiProvider {
  generateText(systemPrompt: string, userPrompt: string, options: AiProviderOptions): Promise<string>;
}