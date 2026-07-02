import { groq } from '@ai-sdk/groq';
import { generateText } from 'ai';
import { AiProvider, AiProviderOptions } from './ai-provider.interface.js';

export class GroqProvider implements AiProvider {
  async generateText(systemPrompt: string, userPrompt: string, options: AiProviderOptions): Promise<string> {
    const response = await generateText({
      model: groq(options.model),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: options.temperature ?? 0.2,
      // Passa a propriedade apenas se ela for definida nas opções
      ...(options.maxTokens ? { maxTokens: options.maxTokens } : {})
    });

    return response.text;
  }
}