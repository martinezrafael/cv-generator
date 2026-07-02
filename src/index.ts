import * as fs from 'fs';
import * as path from 'path';
import { AiFactory } from './factories/ai-factory.js';

async function main() {
  const ai = AiFactory.createProvider('groq');

  const systemPromptPath = path.join(__dirname, '../instructions/global-system.md');
  const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');

  const positioningPath = path.join(__dirname, '../strategy/positioning-core.md');
  const positioningContext = fs.readFileSync(positioningPath, 'utf-8');

  const vagaAlvo = 'Vaga: Desenvolvedor Backend Pleno. Requisitos: TypeScript, Microsserviços e RabbitMQ.';
  const userPrompt = `
    Contexto Estratégico de Posicionamento:
    ${positioningContext}

    Ação Solicitada: Gere uma resposta para o campo Fale sobre você da plataforma Gupy considerando a vaga abaixo:
    ${vagaAlvo}
  `;

  try {
    console.log('Carregando contextos locais e acionando a Vercel AI SDK via Groq...');
    
    const output = await ai.generateText(systemPrompt, userPrompt, {
      model: 'llama-3.3-70b-versatile', // Modelo estável oficial de produção
      temperature: 0.2
    });

    console.log('\n--- TEXTO ESTRATÉGICO GERADO ---');
    console.log(output);
  } catch (error) {
    console.error('Falha crítica na esteira de execução da IA:', error);
  }
}

main();