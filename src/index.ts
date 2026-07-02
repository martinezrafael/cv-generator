import * as fs from 'fs';
import * as path from 'path';
import { AiFactory } from './factories/ai-factory';

async function main() {
  // 1. Inicializa o provider abstraído apontando para o Groq
  const ai = AiFactory.createProvider('groq');

  // 2. Resolve a leitura física dos ficheiros estruturados de estratégia e prompt
  const systemPromptPath = path.join(__dirname, '../instructions/global-system.md');
  const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');

  const positioningPath = path.join(__dirname, '../strategy/positioning-core.md');
  const positioningContext = fs.readFileSync(positioningPath, 'utf-8');

  // 3. Define a vaga desejada e encapsula o escopo do usuário
  const vagaAlvo = 'Vaga: Desenvolvedor Backend Pleno. Requisitos: TypeScript, Microserviços e RabbitMQ.';
  const userPrompt = `
    Contexto Estratégico de Posicionamento:
    ${positioningContext}

    Ação Solicitada: Gere uma resposta para o campo Fale sobre você da plataforma Gupy considerando a vaga abaixo:
    ${vagaAlvo}
  `;

  // 4. Executa a requisição consumindo o modelo de alta velocidade do Groq
  try {
    console.log('Carregando bases de dados locais e acionando o Groq...');
    
    const output = await ai.generateText(systemPrompt, userPrompt, {
      model: 'llama3-70b-8192',
      temperature: 0.2
    });

    console.log('\n--- TEXTO ESTRATÉGICO GERADO ---');
    console.log(output);
  } catch (error) {
    console.error('Falha crítica na esteira de execução da IA:', error);
  }
}

main();