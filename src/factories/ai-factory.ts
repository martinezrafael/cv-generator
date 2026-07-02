import { AiProvider } from '../providers/ai-provider.interface.js';
import { GroqProvider } from '../providers/groq.provider.js';

export type ProviderType = 'groq';

export class AiFactory {
  static createProvider(type: ProviderType): AiProvider {
    switch (type) {
      case 'groq':
        return new GroqProvider();
      default:
        throw new Error(`O provider informado não é suportado pelo sistema: ${type}`);
    }
  }
}