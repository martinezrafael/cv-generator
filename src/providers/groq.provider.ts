import { Groq } from 'groq-sdk';
import { AiProvider, AiProviderOptions } from './ai-provider.interface';

export class GroqProvider implements AiProvider {
  private client: Groq;

  constructor() {
    this.client = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }

  async generateText(systemPrompt: string, userPrompt: string, options: AiProviderOptions): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: options.model,
      temperature: options.temperature ?? 0.2,
      max_tokens: options.maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ]
    });

    return response.choices[0]?.message?.content ?? '';
  }
}