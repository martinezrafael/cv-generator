import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { AiFactory } from './factories/ai-factory.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const ai = AiFactory.createProvider('groq');

  try {
    console.log('Carregando bases de dados locais e acionando o Groq...');

    // 1. Resolve a leitura física de todas as diretrizes e instruções do sistema
    const systemPromptPath = path.join(__dirname, '../instructions/global-system.md');
    const systemPrompt = fs.readFileSync(systemPromptPath, 'utf-8');

    const positioningPath = path.join(__dirname, '../strategy/positioning-core.md');
    const positioningContext = fs.readFileSync(positioningPath, 'utf-8');

    // 2. Carrega a Descrição da Vaga Alvo a partir de um arquivo externo limpo
    const vagaAlvoPath = path.join(__dirname, '../vaga-alvo.md');
    const vagaAlvo = fs.existsSync(vagaAlvoPath)
      ? fs.readFileSync(vagaAlvoPath, 'utf-8')
      : 'Descrição da vaga não localizada no arquivo vaga-alvo.md.';

    // 3. Identificação Dinâmica de Perfil (Backend vs Full Stack) baseado na vaga alvo
    const precisaDeFront = /react|redux|html|css|flexbox|grid|frontend|fullstack|full-stack/i.test(vagaAlvo);
    const pastaPerfil = precisaDeFront ? 'fullstack-pleno' : 'backend-pleno';
    
    console.log(`🤖 Perfil selecionado estrategicamente para o contexto da vaga: ${pastaPerfil}`);

    // 4. Carrega o Histórico Profissional Correto de forma adaptativa
    const profilePath = path.join(__dirname, `../profiles/${pastaPerfil}/pt-br.md`);
    const profileContext = fs.existsSync(profilePath) 
      ? fs.readFileSync(profilePath, 'utf-8') 
      : 'Histórico profissional não localizado.';

    // 5. Carrega os Gabaritos Visuais obrigatórios (Templates)
    const cvTemplatePath = path.join(__dirname, '../templates/cv-ats-standard.md');
    const cvTemplate = fs.existsSync(cvTemplatePath) ? fs.readFileSync(cvTemplatePath, 'utf-8') : '';

    const coverTemplatePath = path.join(__dirname, '../templates/cover-letter.md');
    const coverTemplate = fs.existsSync(coverTemplatePath) ? fs.readFileSync(coverTemplatePath, 'utf-8') : '';

    const linkedinTemplatePath = path.join(__dirname, '../templates/linkedin-woohp.md');
    const linkedinTemplate = fs.existsSync(linkedinTemplatePath) ? fs.readFileSync(linkedinTemplatePath, 'utf-8') : '';
    
    // 6. Encapsula o prompt completo do usuário
    const userPrompt = `
    ### 1. VAGA ALVO (REFERÊNCIA PRINCIPAL)
    ${vagaAlvo}

    ### 2. PERFIL ESTRATÉGICO DE POSICIONAMENTO
    ${positioningContext}

    ### 3. HISTÓRICO PROFISSIONAL BRUTO DO USUÁRIO
    ${profileContext}

    ### 4. GABARITOS VISUAIS E CONFIGURAÇÕES DE ESTRUTURA (TEMPLATES)
    - Template do Currículo:
    ${cvTemplate}

    - Template da Carta de Apresentação:
    ${coverTemplate}

    - Template do Manual LinkedIn WOOHP:
    ${linkedinTemplate}
    `;

    // 7. Executa a requisição consumindo o modelo oficial estável de produção do Groq
    const output = await ai.generateText(systemPrompt, userPrompt, {
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2
    });

    const outputDir = path.join(__dirname, '../output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Expressões regulares para isolar os blocos de texto
    const regexBloco1 = /### BLOCO 1: CURRÍCULO \(ATUALIZADO\)[\s\S]*?```text([\s\S]*?)```/;
    const regexBloco2 = /### BLOCO 2: CARTA DE APRESENTAÇÃO[\s\S]*?```text([\s\S]*?)```/;
    const regexBloco3 = /### BLOCO 3: MANUAL DE INFILTRAÇÃO \(MENSAGENS LINKEDIN\)[\s\S]*?```text([\s\S]*?)```/;

    const matchCV = output.match(regexBloco1);
    const matchCarta = output.match(regexBloco2);
    const matchLinkedin = output.match(regexBloco3);

    console.log('\n--- GRAVANDO ARQUIVOS EM SEPARADO ---');

    if (matchCV && matchCV[1]) {
      fs.writeFileSync(path.join(outputDir, 'curriculo.md'), matchCV[1].trim(), 'utf-8');
      console.log('✅ Arquivo gerado: output/curriculo.md');
    }

    if (matchCarta && matchCarta[1]) {
      fs.writeFileSync(path.join(outputDir, 'carta-apresentacao.md'), matchCarta[1].trim(), 'utf-8');
      console.log('✅ Arquivo gerado: output/carta-apresentacao.md');
    }

    if (matchLinkedin && matchLinkedin[1]) {
      fs.writeFileSync(path.join(outputDir, 'mensagens-linkedin.md'), matchLinkedin[1].trim(), 'utf-8');
      console.log('✅ Arquivo gerado: output/mensagens-linkedin.md');
    }

  } catch (error) {
    console.error('Falha crítica na esteira de execução da IA:', error);
  }
}

main();