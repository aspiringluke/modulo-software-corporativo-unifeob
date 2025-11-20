let cards = [];

function filtrar()
{
    // ler a expressão de filtragem
    const campo = document.getElementById("campoFiltro");
    const selectedCampo = campo.options[campo.selectedIndex].value;
    const op = document.getElementById("operadorFiltro");
    const valor = document.getElementById("valorFiltro");

    // iterar sobre os cards
    for(const card of cards)
    {
        let id = card.getAttribute("idAvaliacao");
        console.log(id);
        let nota = card.getAttribute("nota");
        console.log(nota);
        let nomeProduto = card.getAttribute("nomeProduto");
    }
    // esconder aqueles que não se encaixam na expressão
    // mostrar os que estiverem escondidos e se encaixarem na expressão
}

const valorFiltro = document.getElementById("valorFiltro");
valorFiltro.addEventListener("input", filtrar);

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

async function carregarAvaliacoes() {
    const loadingEl = document.getElementById("avaliacoes");
    loadingEl.innerHTML = '<p style="color:#666;">Carregando avaliações...</p>';

    try {
        const response = await fetch("http://localhost:4040/relatorios/avaliacaoclientes/produtos?contexto=descricoes");
        const data = await response.json();
        
        loadingEl.innerHTML = '';

        if (!data || !data.idAvaliacao) {
            document.getElementById("erro").textContent = "Nenhuma avaliação encontrada.";
            return;
        }

        const container = document.getElementById("avaliacoes");

        data.idAvaliacao.forEach((id, index) => {
            const idAvaliacao = id;
            const nota = data.nota[index];
            const nomeProduto = data.nomeProduto[index] || "Produto sem nome";
            const descricao = data.descricao[index] || "Sem descrição.";
            const nomeCliente = data.nomeCliente[index] || "Anônimo";
            
            const rawDate = data.data[index];
            const dataFormatada = rawDate ? new Date(rawDate).toLocaleDateString('pt-BR') : '--/--/----';

            const card = document.createElement("div");
            card.classList.add("card");
            card.setAttribute("idAvaliacao", idAvaliacao);
            card.setAttribute("nota", nota);
            card.setAttribute("nomeProduto", nomeProduto);
            card.setAttribute("descricao", descricao);
            card.setAttribute("nomeCliente", nomeCliente);
            card.innerHTML = `
                <div class="id-badge" id="idAvaliacao">#${idAvaliacao}</div>
                
                <div class="card-header">
                    <div class="nomeProduto">${nomeProduto}</div>
                    <div class="nota ${classificarNota(nota)}">
                        ${nota.toFixed(1)} ★
                    </div>
                </div>

                <div class="descricao">
                    "${descricao}"
                </div>

                <div class="card-footer">
                    <div class="cliente-info">
                        <div class="avatar-circle">${getIniciais(nomeCliente)}</div>
                        <div class="nomeCliente">${nomeCliente}</div>
                    </div>
                    <div class="data">${dataFormatada}</div>
                </div>
            `;

            container.appendChild(card);
            cards.push(card);
        });

    } catch (error) {
        document.getElementById("avaliacoes").innerHTML = '';
        document.getElementById("erro").textContent = `Erro de conexão ao carregar avaliações: ${error}`;
    }
}

carregarAvaliacoes();