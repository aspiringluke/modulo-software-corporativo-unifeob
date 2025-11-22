// --- CONFIGURAÇÕES GLOBAIS ---
let categoriaSelecionada = "produtos"; // Padrão
const alturaCards = 201.31; 
const JANELA = document.getElementById('virtual-window');
const FANTASMA = document.getElementById('phantom-height');
const CONTEUDO = document.getElementById('avaliacoes');

// --- ESTADO ---
let listaCompleta = []; 
let listaFiltrada = [];
let isScrolling = false;

// --- ELEMENTOS DO DOM ---
const campo = document.getElementById("campoFiltro");
const op = document.getElementById("operadorFiltro");
const valor = document.getElementById("valorFiltro");
const ordenar = document.getElementById("ordenar");
const categorias = document.getElementById("categorias");
const erroEl = document.getElementById("erro");

erroEl.style.display = "none";

// --- EVENT LISTENERS ---

// Listener de Scroll Otimizado
JANELA.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            renderizarVirtual();
            isScrolling = false;
        });
        isScrolling = true;
    }
});

// Filtros e Ordenação
valor.addEventListener("input", aplicarFiltros);
op.addEventListener("change", aplicarFiltros);

campo.addEventListener("change", (e) => {
    // Esconde operador se não for numérico (ajuste visual)
    if(e.target.value !== "idAvaliacao" && e.target.value !== "nota")
        op.style.display = "none";
    else
        op.style.display = "";
    
    aplicarFiltros();
});

ordenar.addEventListener("change", (e) => {
    const campoSort = e.target.value;
    // Ordenação simples
    listaFiltrada.sort((a, b) => {
        if (a[campoSort] > b[campoSort]) return 1;
        if (a[campoSort] < b[campoSort]) return -1;
        return 0;
    });
    renderizarVirtual(); // Apenas redesenha, não precisa recalcular altura
});

categorias.addEventListener("change", async (e) => {
    categoriaSelecionada = e.target.value;
    await carregarAvaliacoes();
});

// --- LÓGICA DE DADOS ---

function calcularItensPorLinha() {
    const larguraContainer = JANELA.clientWidth;
    const larguraCardEstimada = 400; 
    
    const itens = Math.floor(larguraContainer / larguraCardEstimada);
    return itens > 0 ? itens : 1; // Mínimo de 1 coluna
}

async function carregarAvaliacoes() {
    const loadingEl = document.getElementById("avaliacoes"); // Atenção: verifique se esse ID existe no seu HTML novo
    if(loadingEl) loadingEl.innerHTML = '<p style="color:#666;">Carregando...</p>';

    try {
        const response = await fetch(`http://localhost:4040/relatorios/avaliacaoclientes/${categoriaSelecionada}?contexto=descricoes`);
        const data = await response.json();
        
        if(loadingEl) loadingEl.innerHTML = '';

        if (!data || !data.idAvaliacao) {
            erroEl.style.display = "block";
            erroEl.textContent = "Nenhuma avaliação encontrada.";
            return;
        }

        // Mapeamento Unificado
        listaCompleta = data.idAvaliacao.map((_, i) => ({
            idAvaliacao: data.idAvaliacao[i],
            nota: data.nota[i],
            // Resolvemos o nome aqui para facilitar o render
            nomePrincipal: data.nomeProduto ? data.nomeProduto[i] : (data.nomeVendedor ? data.nomeVendedor[i] : 'Atendimento'),
            nomeCliente: data.nomeCliente[i],
            descricao: data.descricao[i],
            data: data.data[i] // Mantemos string ou date object
        }));
        
        // Resetar filtro e renderizar
        listaFiltrada = [...listaCompleta];
        valor.value = ""; // Limpa input de filtro visualmente
        
        atualizarLayoutVirtual();

    } catch (error) {
        erroEl.style.display = "block";
        erroEl.textContent = `Erro: ${error.message}`;
        console.error(error);
    }
}

// --- LÓGICA DE FILTRAGEM ---

function aplicarFiltros() {
    const campoSelecionado = campo.value;
    const operadorSelecionado = op.value;
    const valorDigitado = valor.value.toLowerCase();

    if (!valorDigitado && operadorSelecionado !== '!=') {
        listaFiltrada = [...listaCompleta];
    } else {
        listaFiltrada = listaCompleta.filter(item => {
            let valorItem = item[campoSelecionado]; 
            
            // Tratamento Numérico vs Texto
            if (campoSelecionado === 'nota' || campoSelecionado === 'idAvaliacao') {
                valorItem = Number(valorItem);
                const valorFiltro = Number(valorDigitado);

                switch (operadorSelecionado) {
                    case '==': return valorItem === valorFiltro;
                    case '>': return valorItem > valorFiltro;
                    case '<': return valorItem < valorFiltro;
                    case '>=': return valorItem >= valorFiltro;
                    case '<=': return valorItem <= valorFiltro;
                    case '!=': return valorItem !== valorFiltro;
                    default: return true;
                }
            } else {
                // Tratamento Texto (Seguro contra null/undefined)
                const itemString = String(valorItem || "").toLowerCase();
                
                switch (operadorSelecionado) {
                    case '==': return itemString === valorDigitado;
                    case 'pertence': return itemString.includes(valorDigitado);
                    case '!=': return itemString !== valorDigitado;
                    default: return itemString.includes(valorDigitado);
                }
            }
        });
    }

    JANELA.scrollTop = 0; // Volta ao topo ao filtrar
    atualizarLayoutVirtual();
}

function atualizarLayoutVirtual() {
    const itensPorLinha = calcularItensPorLinha();
    const totalLinhas = Math.ceil(listaFiltrada.length / itensPorLinha);
    FANTASMA.style.height = `${totalLinhas * alturaCards}px`;
    
    renderizarVirtual();
}

// --- RENDERIZAÇÃO (CORE) ---

function renderizarVirtual() {
    const scrollTop = JANELA.scrollTop;
    const alturaJanela = JANELA.clientHeight;
    const itensPorLinha = calcularItensPorLinha();

    CONTEUDO.innerHTML = "";

    if (listaFiltrada.length === 0) {
        CONTEUDO.innerHTML = '<div style="padding:20px;">Nenhum resultado.</div>';
        return;
    }

    // 1. Calcular qual LINHA está no topo
    const linhaInicial = Math.floor(scrollTop / alturaCards);
    
    // 2. Converter Linha para Índice do Array
    // Ex: Se estamos na linha 2 e temos 4 colunas, o índice inicial é 8
    const inicio = linhaInicial * itensPorLinha;

    // 3. Calcular quantas linhas cabem na tela + Buffer
    const linhasVisiveis = Math.ceil(alturaJanela / alturaCards) + 2;
    const fim = Math.min(
        listaFiltrada.length, 
        inicio + (linhasVisiveis * itensPorLinha)
    );

    // 4. Renderizar
    const dadosVisiveis = listaFiltrada.slice(inicio, fim);
    
    // 5. O Pulo do Gato: Offset baseado na LINHA
    const offsetY = linhaInicial * alturaCards;
    CONTEUDO.style.transform = `translateY(${offsetY}px)`;

    // Gerar HTML
    const htmlBatch = dadosVisiveis.map(item => {
        const dataFormatada = item.data ? new Date(item.data).toLocaleDateString('pt-BR') : '--/--';
        const iniciais = getIniciais(item.nomeCliente);
        const classeNota = classificarNota(item.nota);
        
        // Tratamento para nome vazio (Causa do visual estranho nos primeiros cards)
        const nomeExibicao = item.nomePrincipal || "Sem Nome"; 
        const notaExibicao = item.nota !== null ? Number(item.nota).toFixed(1) : "-";

        return `
            <div class="card" style="height: ${alturaCards}px; box-sizing: border-box;">
                <div class="id-badge">#${item.idAvaliacao}</div>
                
                <div class="card-header">
                    <div class="nome">${nomeExibicao}</div>
                    <div class="nota ${classeNota}">${notaExibicao} ★</div>
                </div>

                <div class="descricao">"${item.descricao || ''}"</div>

                <div class="card-footer">
                    <div class="cliente-info">
                        <div class="avatar-circle">${iniciais}</div>
                        <div class="nomeCliente">${item.nomeCliente || 'Anônimo'}</div>
                    </div>
                    <div class="data">${dataFormatada}</div>
                </div>
            </div>
        `;
    }).join('');

    CONTEUDO.innerHTML = htmlBatch;
}

// --- UTILITÁRIOS VISUAIS ---

function classificarNota(nota) {
    if (nota >= 8) return "nota-alta";
    if (nota >= 5) return "nota-media";
    return "nota-baixa";
}

function getIniciais(nome) {
    if (!nome) return "?";
    const partes = nome.split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
}

window.addEventListener('resize', () => {
    window.requestAnimationFrame(atualizarLayoutVirtual);
});

// Inicializa
carregarAvaliacoes();