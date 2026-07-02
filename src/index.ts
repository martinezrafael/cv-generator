import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // Adicionado utilitário nativo de URL
import { AiFactory } from './factories/ai-factory.js';

// Emula o comportamento do __dirname para ambiente ESM nativo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  // 1. Inicializa o provider abstraído apontando para o Groq
  const ai = AiFactory.createProvider('groq');

  // 2. Resolve a leitura física dos arquivos estruturados de estratégia e prompt
  const systemPromptPath = path.join(__dirname, '../instructions/global-system.md');
  const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');

  const positioningPath = path.join(__dirname, '../strategy/positioning-core.md');
  const positioningContext = fs.readFileSync(positioningPath, 'utf-8');

  // 3. Define a vaga desejada e encapsula o escopo do usuário
  const vagaAlvo = 'Vaga: Desenvolvedor Backend Pleno. Requisitos: TypeScript, Microsserviços e RabbitMQ.';
  const userPrompt = `
    Contexto Estratégico de Posicionamento:
    ${positioningContext}

    Ação Solicitada: Gere uma resposta para o campo Fale sobre você da plataforma Gupy considerando a vaga abaixo:
    ${vagaAlvo}
  `;

  // 4. Executa a requisição consumindo o modelo oficial estável de produção do Groq
  try {
    console.log('Carregando bases de dados locais e acionando o Groq...');
    
    const output = await ai.generateText(systemPrompt, userPrompt, {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2
    });

    console.log('\n--- TEXTO ESTRATÉGICO GERADO ---');
    console.log(output);
  } catch (error) {
    console.error('Falha crítica na esteira de execução da IA:', error);
  }
}

main();