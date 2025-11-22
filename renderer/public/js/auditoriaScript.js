// Configurações
const CONTAINER = document.getElementById('container-tabela');
const TBODY = document.getElementById('tabela-corpo');
const MSG_VAZIA = document.getElementById('mensagem-vazia');

// Estimativa de altura de uma linha (incluindo paddings e bordas).
// Se suas linhas variam muito (por causa do JSON), use um valor médio seguro.
const ALTURA_ESTIMADA_LINHA = 220; 

let isScrolling = false;

// 1. Inicialização
function iniciarTabela() {
    if (!DADOS_BRUTOS || DADOS_BRUTOS.length === 0) {
        MSG_VAZIA.style.display = 'block';
        return;
    }
    
    // Renderiza a primeira vez
    renderizarLinhas();
}

// 2. Motor de Renderização
function renderizarLinhas() {
    const scrollTop = CONTAINER.scrollTop;
    const alturaVisivel = CONTAINER.clientHeight;

    // Quantos itens cabem na tela?
    const itensPorTela = Math.ceil(alturaVisivel / ALTURA_ESTIMADA_LINHA);
    
    // Buffer para rolagem suave (renderiza um pouco antes e depois)
    const buffer = 5;

    // Calcular índices
    const inicio = Math.max(0, Math.floor(scrollTop / ALTURA_ESTIMADA_LINHA) - buffer);
    const fim = Math.min(DADOS_BRUTOS.length, inicio + itensPorTela + (buffer * 2));

    // Cortar os dados para exibir apenas o necessário
    const dadosVisiveis = DADOS_BRUTOS.slice(inicio, fim);

    // CALCULAR ESPAÇADORES (O Pulo do Gato)
    // Altura vazia acima dos dados visíveis
    const alturaTopo = inicio * ALTURA_ESTIMADA_LINHA;
    // Altura vazia abaixo dos dados visíveis
    const alturaFundo = (DADOS_BRUTOS.length - fim) * ALTURA_ESTIMADA_LINHA;

    // Montar o HTML
    let html = '';

    // 1. Linha Espaçadora do Topo (Empurra o conteúdo para baixo)
    if (alturaTopo > 0) {
        html += `<tr style="height: ${alturaTopo}px;"><td colspan="6"></td></tr>`;
    }

    // 2. Linhas de Dados Reais
    html += dadosVisiveis.map(registro => {
        // Formatar JSON bonito
        const jsonAntigo = registro.registro_antigo ? JSON.stringify(registro.registro_antigo, null, 2) : '-';
        const jsonNovo = registro.registro_novo ? JSON.stringify(registro.registro_novo, null, 2) : '-';
        const classeOp = `op-${registro.operacao.toLowerCase()}`; // Ex: op-update

        return `
            <tr>
                <td>${registro.tabela}</td>
                <td>
                    <span class="badge ${classeOp}">
                        ${registro.operacao}
                    </span>
                </td>
                <td><pre>${jsonAntigo}</pre></td>
                <td><pre>${jsonNovo}</pre></td>
                <td>${registro.usuario}</td>
                <td>${registro.horario}</td>
            </tr>
        `;
    }).join('');

    // 3. Linha Espaçadora do Fundo (Mantém o scrollbar funcionando)
    if (alturaFundo > 0) {
        html += `<tr style="height: ${alturaFundo}px;"><td colspan="6"></td></tr>`;
    }

    // Injetar no DOM
    TBODY.innerHTML = html;
}

// 3. Event Listener Otimizado
CONTAINER.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            renderizarLinhas();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Inicia
iniciarTabela();